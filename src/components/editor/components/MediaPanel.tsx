import React, { useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

export type MediaType = "image" | "video" | "audio";

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  thumbnail?: string;
  url: string;
  duration?: string;
  size?: string;
}

export interface MediaPanelProps {
  projectUploads: MediaItem[];
  cloudUploads: MediaItem[];
  onMediaSelect: (media: MediaItem) => void;
  onUploadClick: () => void;
}

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Play: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Music: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Image: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Cloud: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  Video: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
};

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    backgroundColor: "#0a0a0a",
  },
  tabsContainer: {
    display: "flex",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "#0a0a0a",
  },
  tab: {
    flex: 1,
    padding: "14px 16px",
    fontSize: "13px",
    fontWeight: "500" as const,
    color: "#888",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#3b82f6",
    borderBottomColor: "#3b82f6",
  },
  uploadSection: {
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  uploadButton: {
    width: "100%",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: "500" as const,
    color: "#e5e5e5",
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  content: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "16px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center" as const,
  },
  emptyIcon: {
    width: "72px",
    height: "72px",
    marginBottom: "16px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#444",
  },
  emptyTitle: {
    fontSize: "15px",
    fontWeight: "600" as const,
    color: "#e5e5e5",
    marginBottom: "8px",
  },
  emptyDescription: {
    fontSize: "12px",
    color: "#888",
    lineHeight: "1.5",
  },
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  mediaItem: {
    position: "relative" as const,
    aspectRatio: "1",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.08)",
    backgroundColor: "#1a1a1a",
    transition: "all 0.2s",
  },
  mediaItemHover: {
    transform: "translateY(-2px)",
    borderColor: "rgba(59, 130, 246, 0.5)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
  },
  mediaThumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  mediaOverlay: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: "10px",
    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)",
  },
  mediaName: {
    fontSize: "11px",
    fontWeight: "500" as const,
    color: "#fff",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "2px",
  },
  mediaDuration: {
    fontSize: "9px",
    color: "rgba(255,255,255,0.7)",
  },
  audioItem: {
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "all 0.2s",
  },
  audioItemHover: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(245, 158, 11, 0.4)",
    transform: "translateX(2px)",
  },
  audioContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  audioIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#f59e0b",
    flexShrink: 0,
  },
  audioInfo: {
    flex: 1,
    minWidth: 0,
  },
  audioName: {
    fontSize: "13px",
    fontWeight: "500" as const,
    color: "#e5e5e5",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "4px",
  },
  audioDuration: {
    fontSize: "11px",
    color: "#888",
  },
  playButton: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.75)",
    border: "2px solid rgba(255,255,255,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    opacity: 0,
    transition: "opacity 0.2s",
    paddingLeft: "3px", // Center the play icon visually
  },
  durationBadge: {
    position: "absolute" as const,
    top: "8px",
    right: "8px",
    padding: "3px 8px",
    fontSize: "10px",
    fontWeight: "700" as const,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: "4px",
    backdropFilter: "blur(4px)",
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "600" as const,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "12px",
    marginTop: "8px",
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export const MediaPanel: React.FC<MediaPanelProps> = ({
  projectUploads,
  cloudUploads,
  onMediaSelect,
  onUploadClick,
}) => {
  const [activeTab, setActiveTab] = useState<"project" | "cloud">("project");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const currentItems = activeTab === "project" ? projectUploads : cloudUploads;

  // Separate media by type
  const visualMedia = currentItems.filter((item) => item.type === "image" || item.type === "video");
  const audioMedia = currentItems.filter((item) => item.type === "audio");

  const renderVisualMedia = () => {
    if (visualMedia.length === 0) return null;

    const videos = visualMedia.filter(item => item.type === "video");
    const images = visualMedia.filter(item => item.type === "image");

    return (
      <>
        {videos.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={styles.sectionTitle}>Videos ({videos.length})</div>
            <div style={styles.mediaGrid}>
              {videos.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...styles.mediaItem,
                    ...(hoveredItem === item.id ? styles.mediaItemHover : {}),
                  }}
                  onClick={() => onMediaSelect(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      style={styles.mediaThumbnail}
                    />
                  )}
                  <div
                    style={{
                      ...styles.playButton,
                      ...(hoveredItem === item.id ? { opacity: 1 } : {}),
                    }}
                  >
                    <Icons.Play />
                  </div>
                  {item.duration && (
                    <div style={styles.durationBadge}>{item.duration}</div>
                  )}
                  <div style={styles.mediaOverlay}>
                    <div style={styles.mediaName}>{item.name}</div>
                    {item.duration && <div style={styles.mediaDuration}>{item.duration}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {images.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={styles.sectionTitle}>Images ({images.length})</div>
            <div style={styles.mediaGrid}>
              {images.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...styles.mediaItem,
                    ...(hoveredItem === item.id ? styles.mediaItemHover : {}),
                  }}
                  onClick={() => onMediaSelect(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      style={styles.mediaThumbnail}
                    />
                  )}
                  <div style={styles.mediaOverlay}>
                    <div style={styles.mediaName}>{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderAudioMedia = () => {
    if (audioMedia.length === 0) return null;

    return (
      <div>
        <div style={styles.sectionTitle}>Audio ({audioMedia.length})</div>
        {audioMedia.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.audioItem,
              ...(hoveredItem === item.id ? styles.audioItemHover : {}),
            }}
            onClick={() => onMediaSelect(item)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={styles.audioContent}>
              <div style={styles.audioIcon}>
                <Icons.Music />
              </div>
              <div style={styles.audioInfo}>
                <div style={styles.audioName}>{item.name}</div>
                {item.duration && <div style={styles.audioDuration}>{item.duration}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEmptyState = () => (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>
        <Icons.Cloud />
      </div>
      <div style={styles.emptyTitle}>
        {activeTab === "project" ? "No uploads yet" : "No cloud files"}
      </div>
      <div style={styles.emptyDescription}>
        {activeTab === "project"
          ? "Click to view or upload files"
          : "Connect your cloud storage to see files"}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "project" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("project")}
        >
          Project Uploads
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "cloud" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("cloud")}
        >
          Cloud Uploads
        </button>
      </div>

      {/* Upload Button */}
      <div style={styles.uploadSection}>
        <button
          style={styles.uploadButton}
          onClick={onUploadClick}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.22)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.12)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Icons.Cloud />
          Click to view or upload files
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {currentItems.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderVisualMedia()}
            {renderAudioMedia()}
          </>
        )}
      </div>

      <style>{`
        ${styles.content.toString().replace(/[{}]/g, '')} ::-webkit-scrollbar {
          width: 6px;
        }
        ${styles.content.toString().replace(/[{}]/g, '')} ::-webkit-scrollbar-track {
          background: transparent;
        }
        ${styles.content.toString().replace(/[{}]/g, '')} ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        ${styles.content.toString().replace(/[{}]/g, '')} ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default MediaPanel;