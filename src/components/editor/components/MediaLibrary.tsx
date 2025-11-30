import React from "react";
import { CLOUDINARY_VIDEOS, AUDIO_LIBRARY, CLOUD_UPLOADS } from "../constants";

interface MediaLibraryProps {
  activeTab: "text" | "media" | "audio" | "video";
  projectAssets: any[];
  onAddLayer: (media: any) => void;
  onOpenGallery: (tab: string) => void;
  onAddText: () => void;
  currentFrame: number;
  totalFrames: number;
}

/**
 * MediaLibrary Component with Upload Buttons
 */
export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  activeTab,
  onAddLayer,
  onOpenGallery,
  onAddText,
}) => {
  const handlePredefinedClick = (item: any, mediaType: "audio" | "video" | "image") => {
    const mediaObject = {
      id: item.id,
      name: item.name,
      type: mediaType,
      url: item.url,
      duration: item.duration,
      thumbnail: item.thumbnail,
    };
    
    console.log('📤 MediaLibrary passing:', mediaObject);
    onAddLayer(mediaObject);
  };

  const cardStyle: React.CSSProperties = {
    padding: "12px",
    marginBottom: "8px",
    background: "#1a1a1a",
    borderRadius: "6px",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.2s",
  };

  const uploadButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "13px",
    transition: "all 0.2s",
    marginBottom: "16px",
  };

  // ============================================================================
  // AUDIO TAB
  // ============================================================================
  if (activeTab === "audio") {
    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        {/* Upload Button */}
        <button
          onClick={() => onOpenGallery("audio")}
          style={uploadButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          📤 Upload Audio File
        </button>

        {/* Stock Music */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ 
            color: "#888", 
            marginBottom: "12px", 
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            Stock Music
          </h3>
          
          {AUDIO_LIBRARY.stockMusic.map((audio) => (
            <div
              key={audio.id}
              onClick={() => handlePredefinedClick(audio, "audio")}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#252525";
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1a1a1a";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <div style={{ color: "#e5e5e5", fontWeight: 500, fontSize: "13px", marginBottom: "4px" }}>
                🎵 {audio.name}
              </div>
              <div style={{ color: "#666", fontSize: "11px" }}>
                {audio.duration}
              </div>
            </div>
          ))}
        </div>

        {/* Sound Effects */}
        <div>
          <h3 style={{ 
            color: "#888", 
            marginBottom: "12px", 
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            Sound Effects
          </h3>
          
          {AUDIO_LIBRARY.soundEffects.map((sfx) => (
            <div
              key={sfx.id}
              onClick={() => handlePredefinedClick(sfx, "audio")}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#252525";
                e.currentTarget.style.borderColor = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1a1a1a";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <div style={{ color: "#e5e5e5", fontWeight: 500, fontSize: "13px", marginBottom: "4px" }}>
                🔊 {sfx.name}
              </div>
              <div style={{ color: "#666", fontSize: "11px" }}>
                {sfx.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIDEO TAB
  // ============================================================================
  if (activeTab === "video") {
    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        {/* Upload Button */}
        <button
          onClick={() => onOpenGallery("video")}
          style={uploadButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          📤 Upload Video File
        </button>

        <h3 style={{ 
          color: "#888", 
          marginBottom: "12px", 
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          Background Videos
        </h3>
        
        {CLOUDINARY_VIDEOS.backgroundVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => handlePredefinedClick(video, "video")}
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#252525";
              e.currentTarget.style.borderColor = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1a1a1a";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            {video.thumbnail && (
              <img 
                src={video.thumbnail} 
                alt={video.name}
                style={{ 
                  width: "60px", 
                  height: "40px", 
                  objectFit: "cover", 
                  borderRadius: "4px",
                  backgroundColor: "#000"
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ color: "#e5e5e5", fontWeight: 500, fontSize: "13px", marginBottom: "2px" }}>
                📹 {video.name}
              </div>
              <div style={{ color: "#666", fontSize: "11px" }}>
                {video.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ============================================================================
  // MEDIA (IMAGES) TAB
  // ============================================================================
  if (activeTab === "media") {
    return (
      <div style={{ padding: "16px", overflowY: "auto", height: "100%" }}>
        {/* Upload Button */}
        <button
          onClick={() => onOpenGallery("media")}
          style={uploadButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          📤 Upload Image File
        </button>

        <h3 style={{ 
          color: "#888", 
          marginBottom: "12px", 
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          Stock Images
        </h3>
        
        {CLOUD_UPLOADS.filter(item => item.type === "image").map((image) => (
          <div
            key={image.id}
            onClick={() => handlePredefinedClick(image, "image")}
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#252525";
              e.currentTarget.style.borderColor = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1a1a1a";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            {image.thumbnail && (
              <img 
                src={image.thumbnail} 
                alt={image.name}
                style={{ 
                  width: "60px", 
                  height: "60px", 
                  objectFit: "cover", 
                  borderRadius: "4px",
                  backgroundColor: "#000"
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ color: "#e5e5e5", fontWeight: 500, fontSize: "13px" }}>
                🖼️ {image.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ============================================================================
  // TEXT TAB
  // ============================================================================
  if (activeTab === "text") {
    return (
      <div style={{ padding: "16px" }}>
        <h3 style={{ 
          color: "#888", 
          marginBottom: "12px", 
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          Add Text Layer
        </h3>
        
        <button
          onClick={onAddText}
          style={{
            width: "100%",
            padding: "14px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "13px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          ➕ Add Text Layer
        </button>

        <div style={{ 
          marginTop: "16px", 
          padding: "12px", 
          background: "#1a1a1a", 
          borderRadius: "6px",
          fontSize: "11px",
          color: "#666"
        }}>
          💡 Click to add a new text layer
        </div>
      </div>
    );
  }

  return null;
};

export default MediaLibrary;