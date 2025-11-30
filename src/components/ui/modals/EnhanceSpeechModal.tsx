import React, { useState } from "react";
import toast from "react-hot-toast";
import { enhanceAudio } from "../../../services/audioApi";

interface EnhanceSpeechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnhance: (data: {
    audioUrl: string;
    denoiseLevel: number;
    enhanceClarity: boolean;
    removeEcho: boolean;
    transcript?: string;
    confidence?: number;
  }) => void;
  selectedLayerId: string | null;
  currentAudioUrl?: string;
}

export const EnhanceSpeechModal: React.FC<EnhanceSpeechModalProps> = ({
  isOpen,
  onClose,
  onEnhance,
  selectedLayerId,
  currentAudioUrl,
}) => {
  const [denoiseLevel, setDenoiseLevel] = useState(7);
  const [enhanceClarity, setEnhanceClarity] = useState(true);
  const [removeEcho, setRemoveEcho] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "16px",
      width: "100%",
      maxWidth: "480px",
      maxHeight: "90vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    header: {
      padding: "24px 24px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#e5e5e5",
      margin: "0 0 8px 0",
    },
    subtitle: {
      fontSize: "13px",
      color: "#888",
      margin: 0,
    },
    content: {
      padding: "24px",
      overflowY: "auto" as const,
      flex: 1,
    },
    section: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "8px",
    },
    warning: {
      padding: "12px 16px",
      backgroundColor: "rgba(20, 184, 166, 0.1)",
      border: "1px solid rgba(20, 184, 166, 0.3)",
      borderRadius: "8px",
      color: "#14b8a6",
      fontSize: "13px",
      marginBottom: "20px",
    },
    infoBox: {
      padding: "12px 16px",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "8px",
      color: "#3b82f6",
      fontSize: "12px",
      marginBottom: "20px",
      lineHeight: "1.5",
    },
    progressContainer: {
      marginBottom: "20px",
      padding: "16px",
      backgroundColor: "#0f0f0f",
      borderRadius: "8px",
    },
    progressBar: {
      width: "100%",
      height: "8px",
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: "4px",
      overflow: "hidden",
      marginBottom: "8px",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      transition: "width 0.3s ease",
    },
    progressText: {
      fontSize: "13px",
      color: "#888",
      textAlign: "center" as const,
      margin: 0,
    },
    sliderContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    slider: {
      flex: 1,
      height: "4px",
      borderRadius: "2px",
      appearance: "none" as const,
      backgroundColor: "rgba(255,255,255,0.1)",
      cursor: "pointer",
      outline: "none",
    },
    sliderValue: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#14b8a6",
      minWidth: "30px",
      textAlign: "center" as const,
    },
    hint: {
      fontSize: "12px",
      color: "#888",
      marginTop: "8px",
      margin: "8px 0 0 0",
    },
    toggleContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      backgroundColor: "#0f0f0f",
      borderRadius: "8px",
      marginBottom: "12px",
    },
    toggleLabel: {
      fontSize: "14px",
      color: "#e5e5e5",
    },
    toggle: {
      width: "44px",
      height: "24px",
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.1)",
      border: "none",
      cursor: "pointer",
      position: "relative" as const,
      transition: "background-color 0.2s",
    },
    toggleActive: {
      backgroundColor: "#14b8a6",
    },
    toggleKnob: {
      position: "absolute" as const,
      top: "2px",
      left: "2px",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "white",
      transition: "transform 0.2s",
    },
    toggleKnobActive: {
      transform: "translateX(20px)",
    },
    footer: {
      padding: "16px 24px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    button: {
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      outline: "none",
    },
    cancelButton: {
      backgroundColor: "transparent",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#888",
    },
    enhanceButton: {
      background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      color: "white",
    },
    enhancingButton: {
      background: "linear-gradient(135deg, #666 0%, #555 100%)",
      cursor: "not-allowed",
      opacity: 0.6,
    },
  };

  const handleEnhance = async () => {
    if (!selectedLayerId) {
      toast.error("Please select an audio layer first");
      return;
    }

    if (!currentAudioUrl) {
      toast.error("No audio file found for this layer");
      return;
    }

    setIsEnhancing(true);
    setProgress(0);

    try {
      // Step 1: Download audio
      setStatusMessage("📥 Preparing audio...");
      setProgress(10);

      const audioBlob = await fetch(currentAudioUrl).then((r) => r.blob());

      // Step 2: Upload to Auphonic
      setStatusMessage("📤 Uploading to Auphonic...");
      setProgress(20);

      // Step 3: Creating production
      setStatusMessage("📋 Creating enhancement job...");
      setProgress(30);

      // Step 4: Processing (this takes longest)
      setStatusMessage("🎙️ Auphonic is processing your audio...");
      setProgress(40);

      const result = await enhanceAudio(audioBlob, {
        denoiseLevel,
        enhanceClarity,
        removeEcho,
      });

      // Step 5: Finalizing
      setStatusMessage("✨ Downloading enhanced audio...");
      setProgress(90);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress(100);

      onEnhance({
        audioUrl: result.audioUrl,
        denoiseLevel,
        enhanceClarity,
        removeEcho,
      });

      toast.success(
        "✅ Audio enhanced successfully!\n🎵 Noise removed & clarity improved",
        { duration: 4000 }
      );

      onClose();
    } catch (error: any) {
      console.error("Enhancement error:", error);
      
      // Better error messages
      let errorMessage = "Failed to enhance speech";
      
      if (error.message.includes('Cannot connect')) {
        errorMessage = "Backend server not responding. Check if it's running.";
      } else if (error.message.includes('credits')) {
        errorMessage = "Out of Auphonic credits. Upgrade or wait for monthly reset.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "Enhancement timeout. Try with a shorter audio file.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsEnhancing(false);
      setProgress(0);
      setStatusMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>🎙️ Enhance Speech with AI</h2>
          <p style={styles.subtitle}>
            Powered by Auphonic - Professional audio enhancement
          </p>
        </div>

        <div style={styles.content}>
          {!selectedLayerId && (
            <div style={styles.warning}>
              ⚠️ Please select an audio layer before using this tool
            </div>
          )}

          {/* Info about Auphonic */}
          {!isEnhancing && (
            <div style={styles.infoBox}>
              ℹ️ <strong>What happens:</strong> Your audio will be processed with professional-grade 
              noise reduction, loudness normalization, and clarity enhancement.
              <br />
              ⏱️ Processing takes 20-60 seconds depending on file length.
            </div>
          )}

          {isEnhancing && (
            <div style={styles.progressContainer}>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${progress}%`,
                  }}
                />
              </div>
              <p style={styles.progressText}>
                {statusMessage} {progress}%
              </p>
            </div>
          )}

          <div style={styles.section}>
            <label style={styles.label}>Noise Reduction Intensity</label>
            <div style={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="10"
                value={denoiseLevel}
                onChange={(e) => setDenoiseLevel(Number(e.target.value))}
                style={styles.slider}
                disabled={isEnhancing || !selectedLayerId}
              />
              <span style={styles.sliderValue}>{denoiseLevel}</span>
            </div>
            <p style={styles.hint}>
              {denoiseLevel < 3 && "🟢 Light - Subtle noise removal"}
              {denoiseLevel >= 3 &&
                denoiseLevel < 7 &&
                "🟡 Medium - Balanced enhancement"}
              {denoiseLevel >= 7 && "🔴 Strong - Aggressive noise removal"}
            </p>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Enhancement Options</label>

            <div style={styles.toggleContainer}>
              <div>
                <span style={styles.toggleLabel}>🎤 Loudness Normalization</span>
                <p style={{ fontSize: "11px", color: "#666", margin: "2px 0 0 0" }}>
                  Auto-balance volume levels for consistency
                </p>
              </div>
              <button
                style={{
                  ...styles.toggle,
                  ...(enhanceClarity ? styles.toggleActive : {}),
                }}
                onClick={() => setEnhanceClarity(!enhanceClarity)}
                disabled={isEnhancing || !selectedLayerId}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    ...(enhanceClarity ? styles.toggleKnobActive : {}),
                  }}
                />
              </button>
            </div>

            <div style={styles.toggleContainer}>
              <div>
                <span style={styles.toggleLabel}>🔊 Audio Filtering</span>
                <p style={{ fontSize: "11px", color: "#666", margin: "2px 0 0 0" }}>
                  Remove echo, reverb, and room reflections
                </p>
              </div>
              <button
                style={{
                  ...styles.toggle,
                  ...(removeEcho ? styles.toggleActive : {}),
                }}
                onClick={() => setRemoveEcho(!removeEcho)}
                disabled={isEnhancing || !selectedLayerId}
              >
                <div
                  style={{
                    ...styles.toggleKnob,
                    ...(removeEcho ? styles.toggleKnobActive : {}),
                  }}
                />
              </button>
            </div>
          </div>

          {/* Credit Usage Info */}
          {!isEnhancing && (
            <div style={{
              padding: "10px 12px",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "6px",
              fontSize: "11px",
              color: "#f59e0b",
            }}>
              💳 Using Auphonic free tier (2 hours/month)
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            disabled={isEnhancing}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...(isEnhancing || !selectedLayerId
                ? styles.enhancingButton
                : styles.enhanceButton),
            }}
            onClick={handleEnhance}
            disabled={isEnhancing || !selectedLayerId}
          >
            {isEnhancing ? `⏳ ${progress}%` : "🚀 Enhance Audio"}
          </button>
        </div>
      </div>
    </div>
  );
};