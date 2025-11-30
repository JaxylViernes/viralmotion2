// ============================================================================
// COMPLETE index.ts WITH VIDEO SUPPORT
// ============================================================================

// Layout
// export { EditorLayout } from "./EditorLayout";
// export type { EditorLayoutProps } from "./EditorLayout";

// Icons
export { EditorIcons } from "./EditorIcons";

// Styles
// export { editorStyles } from "./editorStyles";

// Upload
// export { UploadArea } from "./UploadArea";
// export type { UploadAreaProps } from "./UploadArea";

// Timeline
export { Timeline } from "./Timeline";
export type { TimelineProps, TimelineTrack } from "./Timeline";

// Preview Panel
// export { PreviewPanel } from "./PreviewPanel";
// export type { PreviewPanelProps } from "./PreviewPanel";

// Preview Overlay (interactive)
export { PreviewOverlay } from "./PreviewOverlay";
// export type { ElementPosition, ElementPositions} from "./PreviewOverlay";
export type { PreviewOverlayProps, SelectableElement } from "./PreviewOverlay";

// Dynamic Preview Overlay (for layer-based editor)
export { DynamicPreviewOverlay } from "./DynamicPreviewOverlay";
export type { DynamicPreviewOverlayProps } from "./DynamicPreviewOverlay";

// Remotion Preview
export { RemotionPreview } from "./RemotionPreview";
export type { RemotionPreviewProps, RemotionPreviewHandle } from "./RemotionPreview";

// Main Editor
// export { QuoteTemplateEditor } from "../templates/QuoteTemplateEditor";

// Quote Composition
export { QuoteComposition, defaultPositions } from "../../remotion_compositions/QuoteTemplate";
export type { CompositionTracks, TrackData, ElementPositions, ElementPosition } from "../../remotion_compositions/QuoteTemplate";

// Dynamic Layer Composition - WITH VIDEO SUPPORT
export { DynamicLayerComposition } from "../../remotion_compositions/DynamicLayerComposition";
export type { 
  Layer, 
  TextLayer, 
  ImageLayer, 
  VideoLayer,
  AudioLayer,
  LayerBase,
  DynamicCompositionProps 
} from "../../remotion_compositions/DynamicLayerComposition";
export { 
  isTextLayer, 
  isImageLayer, 
  isVideoLayer, 
  isAudioLayer 
} from "../../remotion_compositions/DynamicLayerComposition";