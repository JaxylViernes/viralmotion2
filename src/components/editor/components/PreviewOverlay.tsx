import React, { useState, useRef, useCallback, useEffect } from "react";
import type { ElementPosition, ElementPositions } from "../../remotion_compositions/QuoteTemplate";

// ============================================================================
// TYPES
// ============================================================================

export type SelectableElement = "quote" | "author" | "quoteMark" | "image" | null;

type DragMode = "move" | "rotate" | "resize" | null;

export interface PreviewOverlayProps {
  positions: ElementPositions;
  onPositionChange: (
    element: keyof ElementPositions,
    position: Partial<ElementPosition>
  ) => void;
  selectedElement: SelectableElement;
  onSelectElement: (element: SelectableElement) => void;
  containerWidth: number;
  containerHeight: number;
}

// ============================================================================
// PREVIEW OVERLAY COMPONENT
// ============================================================================

export const PreviewOverlay: React.FC<PreviewOverlayProps> = ({
  positions,
  onPositionChange,
  selectedElement,
  onSelectElement,
  containerWidth,
  containerHeight,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragElement, setDragElement] = useState<keyof ElementPositions | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState<ElementPosition>({ x: 0, y: 0, rotation: 0, scale: 1 });
  const [elementCenter, setElementCenter] = useState({ x: 0, y: 0 });

  // Element hit areas - sized to contain text with padding
  const elements: {
    id: keyof ElementPositions;
    label: string;
    baseWidth: number;  // base percentage width
    baseHeight: number; // base percentage height
  }[] = [
    { id: "quoteMark", label: 'Quote Mark "', baseWidth: 15, baseHeight: 15 },
    { id: "quote", label: "Quote Text", baseWidth: 85, baseHeight: 22 },
    { id: "author", label: "Author", baseWidth: 80, baseHeight: 12 },
  ];

  // Get scaled dimensions for element
  const getScaledDimensions = (elementId: keyof ElementPositions) => {
    const el = elements.find((e) => e.id === elementId);
    if (!el) return { width: 0, height: 0 };
    
    const scale = positions[elementId]?.scale || 1;
    return {
      width: el.baseWidth * scale,
      height: el.baseHeight * scale,
    };
  };

  // Get element box center in pixels
  const getElementCenter = (elementId: keyof ElementPositions) => {
    const dims = getScaledDimensions(elementId);
    if (!dims.width) return { x: 0, y: 0 };
    
    const pos = positions[elementId];
    let centerX: number;
    let centerY: number;

    if (elementId === "quoteMark") {
      centerX = (pos.x + dims.width / 2) / 100 * containerWidth;
      centerY = (pos.y + dims.height / 2) / 100 * containerHeight;
    } else {
      centerX = pos.x / 100 * containerWidth;
      centerY = pos.y / 100 * containerHeight;
    }

    return { x: centerX, y: centerY };
  };

  // Handle mouse down for move
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, elementId: keyof ElementPositions) => {
      e.stopPropagation();
      e.preventDefault();

      const pos = positions[elementId];
      setDragMode("move");
      setDragElement(elementId);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragStartPos({ 
        x: pos.x, 
        y: pos.y, 
        rotation: pos.rotation || 0, 
        scale: pos.scale || 1 
      });
      onSelectElement(elementId as SelectableElement);
    },
    [positions, onSelectElement]
  );

  // Handle rotation start
  const handleRotateStart = useCallback(
    (e: React.MouseEvent, elementId: keyof ElementPositions) => {
      e.stopPropagation();
      e.preventDefault();

      const pos = positions[elementId];
      const center = getElementCenter(elementId);
      
      setDragMode("rotate");
      setDragElement(elementId);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragStartPos({ 
        x: pos.x, 
        y: pos.y, 
        rotation: pos.rotation || 0, 
        scale: pos.scale || 1 
      });
      setElementCenter(center);
    },
    [positions, containerWidth, containerHeight]
  );

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, elementId: keyof ElementPositions) => {
      e.stopPropagation();
      e.preventDefault();

      const pos = positions[elementId];
      const center = getElementCenter(elementId);
      
      setDragMode("resize");
      setDragElement(elementId);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragStartPos({ 
        x: pos.x, 
        y: pos.y, 
        rotation: pos.rotation || 0, 
        scale: pos.scale || 1 
      });
      setElementCenter(center);
    },
    [positions, containerWidth, containerHeight]
  );

  // Handle mouse move
  useEffect(() => {
    if (!dragMode || !dragElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragMode === "move") {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const deltaXPercent = (deltaX / containerWidth) * 100;
        const deltaYPercent = (deltaY / containerHeight) * 100;

        const newX = Math.max(0, Math.min(100, dragStartPos.x + deltaXPercent));
        const newY = Math.max(0, Math.min(100, dragStartPos.y + deltaYPercent));

        onPositionChange(dragElement, { x: newX, y: newY });
      } else if (dragMode === "rotate") {
        // Calculate angle from center to current mouse position
        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = rect.left + elementCenter.x;
        const centerY = rect.top + elementCenter.y;

        // Starting angle
        const startAngle = Math.atan2(
          dragStart.y - centerY,
          dragStart.x - centerX
        );

        // Current angle
        const currentAngle = Math.atan2(
          e.clientY - centerY,
          e.clientX - centerX
        );

        // Delta in degrees
        const deltaDegrees = (currentAngle - startAngle) * (180 / Math.PI);
        const newRotation = dragStartPos.rotation! + deltaDegrees;

        onPositionChange(dragElement, { rotation: newRotation });
      } else if (dragMode === "resize") {
        // Calculate distance from center for scale
        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = rect.left + elementCenter.x;
        const centerY = rect.top + elementCenter.y;

        // Starting distance
        const startDist = Math.sqrt(
          Math.pow(dragStart.x - centerX, 2) + Math.pow(dragStart.y - centerY, 2)
        );

        // Current distance
        const currentDist = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );

        // Scale ratio
        const scaleRatio = currentDist / startDist;
        const newScale = Math.max(0.3, Math.min(3, dragStartPos.scale! * scaleRatio));

        onPositionChange(dragElement, { scale: newScale });
      }
    };

    const handleMouseUp = () => {
      setDragMode(null);
      setDragElement(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragMode, dragElement, dragStart, dragStartPos, elementCenter, containerWidth, containerHeight, onPositionChange]);

  // Handle click on empty area to deselect
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onSelectElement(null);
      }
    },
    [onSelectElement]
  );

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "absolute",
      inset: 0,
      cursor: "default",
      zIndex: 10,
    },
    elementBox: {
      position: "absolute",
      borderRadius: "4px",
      cursor: "default",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    elementBoxSelected: {
      border: "2px solid #3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
    },
    elementLabel: {
      position: "absolute",
      top: "-24px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#3b82f6",
      color: "white",
      fontSize: "10px",
      fontWeight: 600,
      padding: "3px 8px",
      borderRadius: "4px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    },
    resizeHandle: {
      position: "absolute",
      width: "10px",
      height: "10px",
      backgroundColor: "#3b82f6",
      border: "2px solid white",
      borderRadius: "2px",
      cursor: "nwse-resize",
    },
    rotateHandle: {
      position: "absolute",
      top: "-40px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "20px",
      height: "20px",
      backgroundColor: "#10b981",
      border: "2px solid white",
      borderRadius: "50%",
      cursor: "grab",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    rotateLine: {
      position: "absolute",
      top: "-22px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "2px",
      height: "20px",
      backgroundColor: "#10b981",
      pointerEvents: "none",
    },
    scaleIndicator: {
      position: "absolute",
      bottom: "-20px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "9px",
      color: "#888",
      backgroundColor: "rgba(0,0,0,0.7)",
      padding: "2px 6px",
      borderRadius: "3px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
    },
  };

  return (
    <div ref={overlayRef} style={styles.overlay} onClick={handleOverlayClick}>
      {elements.map((element, index) => {
        const pos = positions[element.id];
        const isSelected = selectedElement === element.id;
        const rotation = pos.rotation || 0;
        const scale = pos.scale || 1;
        const dims = getScaledDimensions(element.id);

        // Calculate position
        let left: string;
        let top: string;

        if (element.id === "quoteMark") {
          left = `${pos.x}%`;
          top = `${pos.y}%`;
        } else {
          left = `${pos.x - dims.width / 2}%`;
          top = `${pos.y - dims.height / 2}%`;
        }

        // z-index: selected element on top, quoteMark above others when not selected
        const baseZIndex = element.id === "quoteMark" ? 5 : (2 - index);
        const zIndex = isSelected ? 10 : baseZIndex;

        return (
          <div
            key={element.id}
            style={{
              ...styles.elementBox,
              left,
              top,
              width: `${dims.width}%`,
              height: `${dims.height}%`,
              zIndex,
              ...(isSelected ? styles.elementBoxSelected : {}),
              cursor: isSelected
                ? dragMode === "move"
                  ? "grabbing"
                  : "move"
                : "pointer",
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center center",
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {/* Label */}
            {isSelected && (
              <span style={{
                ...styles.elementLabel,
                transform: `translateX(-50%) rotate(${-rotation}deg)`,
              }}>
                {element.label}
              </span>
            )}

            {/* Rotation handle */}
            {isSelected && (
              <>
                <div style={styles.rotateLine} />
                <div
                  style={{
                    ...styles.rotateHandle,
                    cursor: dragMode === "rotate" ? "grabbing" : "grab",
                  }}
                  onMouseDown={(e) => handleRotateStart(e, element.id)}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                </div>
              </>
            )}

            {/* Resize handles */}
            {isSelected && (
              <>
                <div
                  style={{ ...styles.resizeHandle, top: -6, left: -6, cursor: "nw-resize" }}
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                />
                <div
                  style={{ ...styles.resizeHandle, top: -6, right: -6, cursor: "ne-resize" }}
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                />
                <div
                  style={{ ...styles.resizeHandle, bottom: -6, left: -6, cursor: "sw-resize" }}
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                />
                <div
                  style={{ ...styles.resizeHandle, bottom: -6, right: -6, cursor: "se-resize" }}
                  onMouseDown={(e) => handleResizeStart(e, element.id)}
                />
              </>
            )}

            {/* Scale indicator */}
            {isSelected && (scale !== 1 || rotation !== 0) && (
              <span style={{
                ...styles.scaleIndicator,
                transform: `translateX(-50%) rotate(${-rotation}deg)`,
              }}>
                {Math.round(scale * 100)}% • {Math.round(rotation)}°
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PreviewOverlay;