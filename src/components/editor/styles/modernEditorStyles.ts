/**
 * Modern Editor Styles
 * Compact, clean, professional design system for all editing panels
 */

export const modernEditorStyles = {
  // Container
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    height: "100%",
    overflow: "auto" as const,
    backgroundColor: "#0a0a0a",
  },

  // Sections - Compact padding
  section: {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },

  sectionCompact: {
    padding: "8px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },

  // Section Headers - Collapsible
  sectionHeader: {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: "8px",
    cursor: "pointer" as const,
    userSelect: "none" as const,
  },

  sectionTitle: {
    fontSize: "11px",
    fontWeight: "600" as const,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
  },

  collapseIcon: {
    fontSize: "10px",
    color: "#666",
    transition: "transform 0.2s",
  },

  // Form Elements - Compact
  formGroup: {
    marginBottom: "8px",
  },

  formGroupCompact: {
    marginBottom: "6px",
  },

  label: {
    display: "block" as const,
    fontSize: "10px",
    color: "#777",
    marginBottom: "4px",
    fontWeight: "500" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },

  // Inputs - Smaller, cleaner
  input: {
    width: "100%",
    padding: "6px 8px",
    backgroundColor: "#141414",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    color: "#e5e5e5",
    fontSize: "12px",
    height: "28px",
  },

  select: {
    width: "100%",
    padding: "6px 8px",
    backgroundColor: "#141414",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    color: "#e5e5e5",
    fontSize: "12px",
    cursor: "pointer" as const,
    height: "28px",
  },

  textarea: {
    width: "100%",
    minHeight: "60px",
    padding: "8px",
    backgroundColor: "#141414",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    color: "#e5e5e5",
    fontSize: "13px",
    fontFamily: "inherit",
    resize: "vertical" as const,
    lineHeight: "1.4",
  },

  // Checkbox - Modern toggle style
  checkbox: {
    accentColor: "#3b82f6",
    width: "16px",
    height: "16px",
    cursor: "pointer" as const,
  },

  checkboxLabel: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
    fontSize: "12px",
    color: "#ccc",
    cursor: "pointer" as const,
  },

  // Sliders - Compact
  sliderWrapper: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
  },

  slider: {
    flex: 1,
    height: "3px",
    accentColor: "#3b82f6",
    cursor: "pointer" as const,
  },

  sliderValue: {
    fontSize: "11px",
    color: "#888",
    minWidth: "32px",
    textAlign: "right" as const,
    fontWeight: "500" as const,
  },

  // Color Picker - Compact inline
  colorWrapper: {
    display: "flex" as const,
    gap: "8px",
    alignItems: "center" as const,
  },

  colorPreview: {
    width: "32px",
    height: "28px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer" as const,
    flexShrink: 0,
  },

  colorInput: {
    flex: 1,
    height: "28px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    cursor: "pointer" as const,
    backgroundColor: "#141414",
  },

  // Grid Layouts - Compact spacing
  grid2: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },

  grid3: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "6px",
  },

  grid4: {
    display: "grid" as const,
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "6px",
  },

  // Button Groups - Segmented control style
  buttonGroup: {
    display: "flex" as const,
    gap: "4px",
    backgroundColor: "#141414",
    padding: "3px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  toggleButton: {
    flex: 1,
    padding: "6px 8px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    color: "#888",
    fontSize: "11px",
    fontWeight: "600" as const,
    cursor: "pointer" as const,
    transition: "all 0.15s",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "4px",
  },

  toggleButtonActive: {
    backgroundColor: "#3b82f6",
    color: "white",
  },

  // Icon Buttons - Compact
  iconButton: {
    padding: "6px",
    backgroundColor: "#141414",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    color: "#888",
    cursor: "pointer" as const,
    transition: "all 0.15s",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    width: "32px",
    height: "28px",
  },

  iconButtonActive: {
    backgroundColor: "#3b82f6",
    color: "white",
    borderColor: "#3b82f6",
  },

  // Primary Button - Compact
  button: {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600" as const,
    cursor: "pointer" as const,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "6px",
    transition: "background-color 0.15s",
  },

  // Secondary Button
  buttonSecondary: {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "#1f1f1f",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    color: "#e5e5e5",
    fontSize: "12px",
    fontWeight: "600" as const,
    cursor: "pointer" as const,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "6px",
    transition: "all 0.15s",
  },

  // Danger Button - Compact
  deleteButton: {
    width: "100%",
    padding: "8px",
    backgroundColor: "#dc2626",
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600" as const,
    cursor: "pointer" as const,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "6px",
    marginTop: "8px",
  },

  // Property Row - Inline label/value
  propertyRow: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: "6px",
  },

  propertyLabel: {
    fontSize: "10px",
    color: "#888",
    fontWeight: "500" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },

  propertyValue: {
    fontSize: "11px",
    color: "#aaa",
    fontWeight: "600" as const,
  },

  // Cards/Presets - Compact grid
  cardGrid: {
    display: "grid" as const,
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "6px",
  },

  card: {
    padding: "10px 8px",
    backgroundColor: "#141414",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    cursor: "pointer" as const,
    transition: "all 0.15s",
    textAlign: "center" as const,
  },

  // Divider
  divider: {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.06)",
    margin: "12px 0",
  },

  // Badge
  badge: {
    display: "inline-flex" as const,
    alignItems: "center" as const,
    padding: "2px 6px",
    backgroundColor: "#3b82f6",
    borderRadius: "4px",
    fontSize: "9px",
    fontWeight: "600" as const,
    color: "white",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },

  // Info text
  helpText: {
    fontSize: "10px",
    color: "#666",
    fontStyle: "italic" as const,
    marginTop: "4px",
  },
};

// Hover effects helper
export const addHoverEffect = (element: HTMLElement, hoverColor: string, originalColor: string) => {
  element.addEventListener('mouseenter', () => {
    element.style.backgroundColor = hoverColor;
  });
  element.addEventListener('mouseleave', () => {
    element.style.backgroundColor = originalColor;
  });
};