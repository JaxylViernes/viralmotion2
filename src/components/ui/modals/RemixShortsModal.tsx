// import React, { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// interface RemixShortsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onGenerate: (remixes: RemixResult[]) => void;
//   currentVideo?: {
//     url: string;
//     duration: number;
//     thumbnail?: string;
//   } | null;
// }

// export interface RemixResult {
//   id: string;
//   url: string;
//   thumbnail: string;
//   style: string;
//   duration: number;
//   effects: string[];
//   title: string;
//   description: string;
// }

// const REMIX_STYLES = [
//   { id: "viral", name: "Viral", icon: "🔥", description: "Trending viral format" },
//   { id: "meme", name: "Meme", icon: "😂", description: "Meme-style remix" },
//   { id: "educational", name: "Educational", icon: "📚", description: "Clear and informative" },
//   { id: "cinematic", name: "Cinematic", icon: "🎬", description: "Professional look" },
//   { id: "funny", name: "Funny", icon: "🤣", description: "Comedy-focused" },
//   { id: "dramatic", name: "Dramatic", icon: "🎭", description: "Dramatic impact" },
// ];

// const EFFECTS = [
//   { id: "captions", name: "Auto Captions", icon: "💬" },
//   { id: "music", name: "Trending Music", icon: "🎵" },
//   { id: "transitions", name: "Dynamic Transitions", icon: "✨" },
//   { id: "zoom", name: "Auto Zoom", icon: "🔍" },
//   { id: "emoji", name: "Emoji Reactions", icon: "😊" },
//   { id: "sound", name: "Sound Effects", icon: "🔊" },
// ];

// export const RemixShortsModal: React.FC<RemixShortsModalProps> = ({
//   isOpen,
//   onClose,
//   onGenerate,
//   currentVideo,
// }) => {
//   const [selectedStyle, setSelectedStyle] = useState("viral");
//   const [duration, setDuration] = useState(30);
//   const [variations, setVariations] = useState(3);
//   const [selectedEffects, setSelectedEffects] = useState<string[]>(["captions", "music"]);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [currentStep, setCurrentStep] = useState("");

//   // Debug logging when modal opens or video changes
//   useEffect(() => {
//     if (isOpen) {
//       console.log("🎥 Modal opened with video:", currentVideo);
//       console.log("Video URL:", currentVideo?.url);
//       console.log("Video Duration:", currentVideo?.duration);
//       console.log("Video Thumbnail:", currentVideo?.thumbnail);
      
//       if (!currentVideo) {
//         console.warn("⚠️ No video provided to modal");
//       } else if (!currentVideo.url) {
//         console.warn("⚠️ Video URL is missing");
//       }
//     }
//   }, [isOpen, currentVideo]);

//   const toggleEffect = (effectId: string) => {
//     setSelectedEffects((prev) =>
//       prev.includes(effectId)
//         ? prev.filter((id) => id !== effectId)
//         : [...prev, effectId]
//     );
//   };

//   const handleGenerate = async () => {
//     console.log("🔍 Generate button clicked");
//     console.log("Current video:", currentVideo);

//     // Enhanced validation
//     if (!currentVideo) {
//       toast.error("No video selected. Please upload or select a video first.");
//       console.error("❌ currentVideo is null or undefined");
//       return;
//     }

//     if (!currentVideo.url) {
//       toast.error("Video URL is missing. Please try uploading again.");
//       console.error("❌ currentVideo.url is missing:", currentVideo);
//       return;
//     }

//     if (selectedEffects.length === 0) {
//       toast.error("Please select at least one effect");
//       return;
//     }

//     setIsGenerating(true);
//     setProgress(0);

//     const loadingToast = toast.loading("Starting remix generation...");

//     try {
//       console.log("🚀 Starting real video remix generation...");
//       console.log("📹 Video URL:", currentVideo.url);
//       console.log("🎨 Style:", selectedStyle);
//       console.log("⏱️ Duration:", duration);
//       console.log("🔢 Variations:", variations);
//       console.log("✨ Effects:", selectedEffects);

//       // ✅ Updated API URL - matches your backend
//       const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

//       const requestBody = {
//         videoUrl: currentVideo.url,
//         style: selectedStyle,
//         duration: duration,
//         variations: variations,
//         effects: selectedEffects,
//         originalDuration: currentVideo.duration,
//       };

//       console.log("📤 Sending request to:", `${API_URL}/api/remix-video`);
//       console.log("📦 Request body:", requestBody);

//       // Step 1: Upload/Prepare
//       setCurrentStep("Preparing video...");
//       setProgress(10);
//       toast.loading("Preparing video...", { id: loadingToast });

//       // Step 2: Send to backend
//       setCurrentStep("Processing with FFmpeg...");
//       setProgress(30);
//       toast.loading("Processing video with FFmpeg...", { id: loadingToast });

//       const response = await fetch(`${API_URL}/api/remix-video`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });

//       console.log("📥 Response status:", response.status);
//       console.log("📥 Response OK:", response.ok);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("❌ Error response:", errorText);
        
//         let errorData;
//         try {
//           errorData = JSON.parse(errorText);
//         } catch {
//           errorData = { error: errorText || "Failed to process video" };
//         }
        
//         throw new Error(errorData.error || `Server error: ${response.status}`);
//       }

//       // Step 3: Parse response
//       setCurrentStep("Generating remixes...");
//       setProgress(60);
//       toast.loading("Creating remix variations...", { id: loadingToast });

//       const data = await response.json();
//       console.log("✅ Received response from backend:", data);

//       if (!data.success || !data.remixes || data.remixes.length === 0) {
//         throw new Error("No remixes generated");
//       }

//       // Step 4: Map and validate remixes
//       setCurrentStep("Finalizing videos...");
//       setProgress(90);
//       toast.loading("Finalizing your remixes...", { id: loadingToast });

//       const remixes: RemixResult[] = data.remixes.map((remix: any, index: number) => ({
//         id: remix.id || `remix-${Date.now()}-${index}`,
//         url: remix.url,
//         thumbnail: remix.thumbnail,
//         style: remix.style || selectedStyle,
//         duration: remix.duration || duration,
//         effects: remix.effects || selectedEffects,
//         title: remix.title || remix.caption || `${selectedStyle} Remix ${index + 1}`,
//         description: remix.description || `${selectedStyle} style remix with ${selectedEffects.join(', ')}`,
//       }));

//       // Verify all video URLs
//       console.log("🔍 Validating remix URLs...");
//       for (const remix of remixes) {
//         console.log("Checking remix URL:", remix.url);
//         if (!remix.url) {
//           throw new Error("Invalid video URL received from server");
//         }
//       }

//       setProgress(100);
//       toast.success(`✨ Generated ${variations} remix variations!`, { id: loadingToast });

//       console.log("✅ All remixes generated successfully:", remixes);

//       // Pass remixes to parent component
//       onGenerate(remixes);

//       // Show success summary
//       setTimeout(() => {
//         toast.success(
//           `🎉 ${variations} video${variations > 1 ? 's' : ''} ready! Each with ${selectedEffects.length} effect${selectedEffects.length > 1 ? 's' : ''}`,
//           { duration: 4000 }
//         );
//       }, 500);

//       // Close modal after short delay
//       setTimeout(() => {
//         onClose();
//         setProgress(0);
//         setCurrentStep("");
//       }, 1500);

//     } catch (error) {
//       console.error("❌ Error generating remix:", error);
      
//       let errorMessage = "Failed to generate remix. Please try again.";
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }
      
//       toast.error(errorMessage, { id: loadingToast, duration: 5000 });
//       setProgress(0);
//       setCurrentStep("");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   if (!isOpen) return null;

//   const styles = {
//     overlay: {
//       position: "fixed" as const,
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: "rgba(0, 0, 0, 0.75)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//       overflowY: "auto" as const,
//       padding: "20px",
//     },
//     modal: {
//       backgroundColor: "#1a1a1a",
//       borderRadius: "12px",
//       padding: "24px",
//       width: "90%",
//       maxWidth: "700px",
//       maxHeight: "90vh",
//       overflowY: "auto" as const,
//       border: "1px solid rgba(255,255,255,0.1)",
//     },
//     header: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: "20px",
//     },
//     title: {
//       fontSize: "20px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//       display: "flex",
//       alignItems: "center",
//       gap: "10px",
//     },
//     closeButton: {
//       background: "none",
//       border: "none",
//       color: "#888",
//       fontSize: "24px",
//       cursor: "pointer",
//       padding: "4px",
//       width: "32px",
//       height: "32px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       borderRadius: "6px",
//       transition: "all 0.2s",
//     },
//     section: {
//       marginBottom: "24px",
//     },
//     label: {
//       display: "block",
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//       marginBottom: "12px",
//     },
//     styleGrid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(3, 1fr)",
//       gap: "12px",
//     },
//     styleCard: {
//       padding: "16px",
//       backgroundColor: "#0f0f0f",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "8px",
//       cursor: "pointer",
//       transition: "all 0.2s",
//       textAlign: "center" as const,
//     },
//     styleCardActive: {
//       backgroundColor: "rgba(59, 130, 246, 0.1)",
//       borderColor: "#3b82f6",
//       transform: "scale(1.02)",
//     },
//     styleIcon: {
//       fontSize: "32px",
//       marginBottom: "8px",
//     },
//     styleName: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//       marginBottom: "4px",
//     },
//     styleDescription: {
//       fontSize: "11px",
//       color: "#888",
//     },
//     sliderContainer: {
//       marginTop: "12px",
//     },
//     sliderLabel: {
//       display: "flex",
//       justifyContent: "space-between",
//       marginBottom: "8px",
//       fontSize: "13px",
//       color: "#888",
//     },
//     slider: {
//       width: "100%",
//       height: "4px",
//       borderRadius: "2px",
//       appearance: "none" as const,
//       backgroundColor: "rgba(255,255,255,0.1)",
//       outline: "none",
//     },
//     effectsGrid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(2, 1fr)",
//       gap: "12px",
//     },
//     effectCard: {
//       padding: "14px",
//       backgroundColor: "#0f0f0f",
//       border: "1px solid rgba(255,255,255,0.1)",
//       borderRadius: "8px",
//       cursor: "pointer",
//       transition: "all 0.2s",
//       display: "flex",
//       alignItems: "center",
//       gap: "12px",
//     },
//     effectCardActive: {
//       backgroundColor: "rgba(59, 130, 246, 0.1)",
//       borderColor: "#3b82f6",
//       transform: "scale(1.02)",
//     },
//     effectIcon: {
//       fontSize: "24px",
//     },
//     effectName: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#e5e5e5",
//     },
//     infoBox: {
//       padding: "16px",
//       backgroundColor: "rgba(59, 130, 246, 0.1)",
//       border: "1px solid rgba(59, 130, 246, 0.3)",
//       borderRadius: "8px",
//       marginBottom: "20px",
//     },
//     infoTitle: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#3b82f6",
//       marginBottom: "8px",
//     },
//     infoText: {
//       fontSize: "13px",
//       color: "#888",
//       lineHeight: "1.5",
//     },
//     warningBox: {
//       padding: "16px",
//       backgroundColor: "rgba(255, 107, 107, 0.1)",
//       border: "1px solid rgba(255, 107, 107, 0.3)",
//       borderRadius: "8px",
//       marginBottom: "20px",
//       display: "flex",
//       alignItems: "center",
//       gap: "12px",
//     },
//     warningIcon: {
//       fontSize: "24px",
//     },
//     warningContent: {
//       flex: 1,
//     },
//     warningTitle: {
//       fontSize: "14px",
//       fontWeight: "600",
//       color: "#ff6b6b",
//       marginBottom: "4px",
//     },
//     warningText: {
//       fontSize: "13px",
//       color: "#888",
//       lineHeight: "1.5",
//     },
//     progressContainer: {
//       marginBottom: "20px",
//     },
//     progressBar: {
//       width: "100%",
//       height: "6px",
//       backgroundColor: "rgba(255,255,255,0.1)",
//       borderRadius: "3px",
//       overflow: "hidden",
//     },
//     progressFill: {
//       height: "100%",
//       background: "linear-gradient(90deg, #3b82f6, #2563eb)",
//       transition: "width 0.3s ease",
//       borderRadius: "3px",
//     },
//     progressText: {
//       fontSize: "12px",
//       color: "#888",
//       marginTop: "8px",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     },
//     buttonGroup: {
//       display: "flex",
//       gap: "12px",
//       marginTop: "24px",
//     },
//     button: {
//       flex: 1,
//       padding: "12px 24px",
//       borderRadius: "8px",
//       fontSize: "14px",
//       fontWeight: "600",
//       cursor: "pointer",
//       transition: "all 0.2s",
//       border: "none",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       gap: "8px",
//     },
//     cancelButton: {
//       backgroundColor: "transparent",
//       border: "1px solid rgba(255,255,255,0.1)",
//       color: "#888",
//     },
//     generateButton: {
//       background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
//       color: "white",
//     },
//     generateButtonDisabled: {
//       background: "linear-gradient(135deg, #666 0%, #555 100%)",
//       cursor: "not-allowed",
//       opacity: 0.6,
//     },
//     videoPreview: {
//       width: "100%",
//       height: "150px",
//       backgroundColor: "#0f0f0f",
//       borderRadius: "8px",
//       border: "1px solid rgba(255,255,255,0.1)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       marginBottom: "20px",
//       overflow: "hidden",
//       position: "relative" as const,
//     },
//     videoThumbnail: {
//       width: "100%",
//       height: "100%",
//       objectFit: "cover" as const,
//     },
//     videoInfo: {
//       position: "absolute" as const,
//       bottom: "8px",
//       left: "8px",
//       right: "8px",
//       backgroundColor: "rgba(0, 0, 0, 0.8)",
//       padding: "8px 12px",
//       borderRadius: "6px",
//       fontSize: "13px",
//       color: "#e5e5e5",
//       display: "flex",
//       justifyContent: "space-between",
//       fontWeight: "600",
//     },
//     noVideoContainer: {
//       display: "flex",
//       flexDirection: "column" as const,
//       alignItems: "center",
//       justifyContent: "center",
//       height: "100%",
//       gap: "8px",
//     },
//     noVideoIcon: {
//       fontSize: "48px",
//       opacity: 0.3,
//     },
//     noVideoText: {
//       color: "#888",
//       fontSize: "14px",
//       fontWeight: "600",
//     },
//     noVideoHint: {
//       color: "#666",
//       fontSize: "12px",
//     },
//   };

//   const hasVideo = currentVideo && currentVideo.url;

//   return (
//     <div style={styles.overlay} onClick={onClose}>
//       <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div style={styles.header}>
//           <div style={styles.title}>
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <polyline points="16 3 21 3 21 8" />
//               <line x1="4" y1="20" x2="21" y2="3" />
//               <polyline points="21 16 21 21 16 21" />
//               <line x1="15" y1="15" x2="21" y2="21" />
//               <line x1="4" y1="4" x2="9" y2="9" />
//             </svg>
//             Remix Shorts with AI
//           </div>
//           <button
//             style={styles.closeButton}
//             onClick={onClose}
//             disabled={isGenerating}
//             onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
//             onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
//           >
//             ×
//           </button>
//         </div>

//         {/* Video Preview */}
//         <div style={styles.videoPreview}>
//           {hasVideo ? (
//             <>
//               {currentVideo.thumbnail ? (
//                 <img 
//                   src={currentVideo.thumbnail} 
//                   alt="Video preview" 
//                   style={styles.videoThumbnail}
//                   onError={(e) => {
//                     console.error("Failed to load thumbnail");
//                     e.currentTarget.style.display = 'none';
//                   }}
//                 />
//               ) : (
//                 <video 
//                   src={currentVideo.url} 
//                   style={styles.videoThumbnail}
//                   muted
//                   onError={(e) => console.error("Failed to load video preview")}
//                 />
//               )}
//               <div style={styles.videoInfo}>
//                 <span>📹 Video Ready</span>
//                 <span>{currentVideo.duration}s</span>
//               </div>
//             </>
//           ) : (
//             <div style={styles.noVideoContainer}>
//               <div style={styles.noVideoIcon}>🎥</div>
//               <div style={styles.noVideoText}>No Video Selected</div>
//               <div style={styles.noVideoHint}>Upload a video to continue</div>
//             </div>
//           )}
//         </div>

//         {/* Warning if no video */}
//         {!hasVideo && (
//           <div style={styles.warningBox}>
//             <div style={styles.warningIcon}>⚠️</div>
//             <div style={styles.warningContent}>
//               <div style={styles.warningTitle}>No Video Selected</div>
//               <div style={styles.warningText}>
//                 Please close this modal and upload or select a video before generating remixes.
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Info box */}
//         {hasVideo && (
//           <div style={styles.infoBox}>
//             <div style={styles.infoTitle}>🤖 Real FFmpeg Processing</div>
//             <div style={styles.infoText}>
//               Your video will be processed with FFmpeg effects, filters, and optimizations. 
//               This may take 2-5 minutes per variation depending on video length.
//             </div>
//           </div>
//         )}

//         {/* Progress Bar */}
//         {isGenerating && (
//           <div style={styles.progressContainer}>
//             <div style={styles.progressBar}>
//               <div style={{ ...styles.progressFill, width: `${progress}%` }} />
//             </div>
//             <div style={styles.progressText}>
//               <span>{currentStep}</span>
//               <span>{progress}%</span>
//             </div>
//           </div>
//         )}

//         <div style={styles.section}>
//           <label style={styles.label}>Remix Style</label>
//           <div style={styles.styleGrid}>
//             {REMIX_STYLES.map((style) => (
//               <div
//                 key={style.id}
//                 style={{
//                   ...styles.styleCard,
//                   ...(selectedStyle === style.id ? styles.styleCardActive : {}),
//                   ...(isGenerating ? { opacity: 0.5, cursor: "not-allowed" } : {}),
//                 }}
//                 onClick={() => !isGenerating && setSelectedStyle(style.id)}
//               >
//                 <div style={styles.styleIcon}>{style.icon}</div>
//                 <div style={styles.styleName}>{style.name}</div>
//                 <div style={styles.styleDescription}>{style.description}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={styles.section}>
//           <label style={styles.label}>Target Duration: {duration}s</label>
//           <div style={styles.sliderContainer}>
//             <div style={styles.sliderLabel}>
//               <span>15s</span>
//               <span>Perfect for all platforms</span>
//               <span>60s</span>
//             </div>
//             <input
//               type="range"
//               min="15"
//               max="60"
//               step="5"
//               value={duration}
//               onChange={(e) => setDuration(parseInt(e.target.value))}
//               style={styles.slider}
//               disabled={isGenerating}
//             />
//           </div>
//         </div>

//         <div style={styles.section}>
//           <label style={styles.label}>Variations: {variations}</label>
//           <div style={styles.sliderContainer}>
//             <div style={styles.sliderLabel}>
//               <span>1</span>
//               <span>Each variation is unique</span>
//               <span>5</span>
//             </div>
//             <input
//               type="range"
//               min="1"
//               max="5"
//               step="1"
//               value={variations}
//               onChange={(e) => setVariations(parseInt(e.target.value))}
//               style={styles.slider}
//               disabled={isGenerating}
//             />
//           </div>
//         </div>

//         <div style={styles.section}>
//           <label style={styles.label}>
//             Effects to Include ({selectedEffects.length} selected)
//           </label>
//           <div style={styles.effectsGrid}>
//             {EFFECTS.map((effect) => (
//               <div
//                 key={effect.id}
//                 style={{
//                   ...styles.effectCard,
//                   ...(selectedEffects.includes(effect.id) ? styles.effectCardActive : {}),
//                   ...(isGenerating ? { opacity: 0.5, cursor: "not-allowed" } : {}),
//                 }}
//                 onClick={() => !isGenerating && toggleEffect(effect.id)}
//               >
//                 <div style={styles.effectIcon}>{effect.icon}</div>
//                 <div style={styles.effectName}>{effect.name}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={styles.buttonGroup}>
//           <button
//             style={{ ...styles.button, ...styles.cancelButton }}
//             onClick={onClose}
//             disabled={isGenerating}
//             onMouseOver={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
//             onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
//           >
//             Cancel
//           </button>
//           <button
//             style={{
//               ...styles.button,
//               ...(isGenerating || !hasVideo ? styles.generateButtonDisabled : styles.generateButton),
//             }}
//             onClick={handleGenerate}
//             disabled={isGenerating || !hasVideo}
//             onMouseOver={(e) => {
//               if (!isGenerating && hasVideo) {
//                 e.currentTarget.style.transform = "translateY(-2px)";
//                 e.currentTarget.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.3)";
//               }
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = "translateY(0)";
//               e.currentTarget.style.boxShadow = "none";
//             }}
//           >
//             {isGenerating ? (
//               <>
//                 <span style={{
//                   width: "16px",
//                   height: "16px",
//                   border: "2px solid rgba(255,255,255,0.3)",
//                   borderTopColor: "white",
//                   borderRadius: "50%",
//                   animation: "spin 0.8s linear infinite",
//                   display: "inline-block",
//                 }} />
//                 Processing...
//               </>
//             ) : !hasVideo ? (
//               <>🚫 No Video Selected</>
//             ) : (
//               <>✨ Generate {variations} Remix{variations > 1 ? "es" : ""}</>
//             )}
//           </button>
//         </div>
//       </div>
//       <style>{`
//         input[type="range"]::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           appearance: none;
//           width: 16px;
//           height: 16px;
//           background: #3b82f6;
//           border-radius: 50%;
//           cursor: pointer;
//         }
//         input[type="range"]::-moz-range-thumb {
//           width: 16px;
//           height: 16px;
//           background: #3b82f6;
//           border-radius: 50%;
//           cursor: pointer;
//           border: none;
//         }
//         input[type="range"]:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };



import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface RemixShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (remixes: RemixResult[]) => void;
  currentVideo?: {
    url: string;
    duration: number;
    thumbnail?: string;
  } | null;
}

export interface RemixResult {
  id: string;
  url: string;
  thumbnail: string;
  style: string;
  duration: number;
  effects: string[];
  title: string;
  description: string;
}

const REMIX_STYLES = [
  { id: "viral", name: "Viral", icon: "🔥", description: "Trending viral format" },
  { id: "meme", name: "Meme", icon: "😂", description: "Meme-style remix" },
  { id: "educational", name: "Educational", icon: "📚", description: "Clear and informative" },
  { id: "cinematic", name: "Cinematic", icon: "🎬", description: "Professional look" },
  { id: "funny", name: "Funny", icon: "🤣", description: "Comedy-focused" },
  { id: "dramatic", name: "Dramatic", icon: "🎭", description: "Dramatic impact" },
];

const EFFECTS = [
  { id: "captions", name: "Auto Captions", icon: "💬" },
  { id: "transitions", name: "Dynamic Transitions", icon: "✨" },
  { id: "zoom", name: "Auto Zoom", icon: "🔍" },
  { id: "speedup", name: "Speed Variations", icon: "⚡" },
  { id: "vignette", name: "Vignette Effect", icon: "🎭" },
  { id: "mirror", name: "Mirror Effect", icon: "🪞" },
];

export const RemixShortsModal: React.FC<RemixShortsModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  currentVideo,
}) => {
  const [selectedStyle, setSelectedStyle] = useState("viral");
  const [duration, setDuration] = useState(30);
  const [variations, setVariations] = useState(3);
  const [selectedEffects, setSelectedEffects] = useState<string[]>(["transitions", "zoom"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  // Debug logging when modal opens or video changes
  useEffect(() => {
    if (isOpen) {
      console.log("🎥 Modal opened with video:", currentVideo);
      console.log("Video URL:", currentVideo?.url);
      console.log("Video Duration:", currentVideo?.duration);
      console.log("Video Thumbnail:", currentVideo?.thumbnail);
      
      if (!currentVideo) {
        console.warn("⚠️ No video provided to modal");
      } else if (!currentVideo.url) {
        console.warn("⚠️ Video URL is missing");
      }
    }
  }, [isOpen, currentVideo]);

  const toggleEffect = (effectId: string) => {
    setSelectedEffects((prev) =>
      prev.includes(effectId)
        ? prev.filter((id) => id !== effectId)
        : [...prev, effectId]
    );
  };

  const handleGenerate = async () => {
    console.log("🔍 Generate button clicked");
    console.log("Current video:", currentVideo);

    // Enhanced validation
    if (!currentVideo) {
      toast.error("No video selected. Please upload or select a video first.");
      console.error("❌ currentVideo is null or undefined");
      return;
    }

    if (!currentVideo.url) {
      toast.error("Video URL is missing. Please try uploading again.");
      console.error("❌ currentVideo.url is missing:", currentVideo);
      return;
    }

    if (selectedEffects.length === 0) {
      toast.error("Please select at least one effect");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    const loadingToast = toast.loading("Starting remix generation...");

    try {
      console.log("🚀 Starting real video remix generation...");
      console.log("📹 Video URL:", currentVideo.url);
      console.log("🎨 Style:", selectedStyle);
      console.log("⏱️ Duration:", duration);
      console.log("🔢 Variations:", variations);
      console.log("✨ Effects:", selectedEffects);

      // ✅ FIXED: For Next.js, use relative path
      const API_URL = '/api/remix-video';

      const requestBody = {
        videoUrl: currentVideo.url,
        style: selectedStyle,
        duration: duration,
        variations: variations,
        effects: selectedEffects,
        originalDuration: currentVideo.duration,
      };

      console.log("📤 Sending request to:", API_URL);
      console.log("📦 Request body:", requestBody);

      // Step 1: Upload/Prepare
      setCurrentStep("Preparing video...");
      setProgress(10);
      toast.loading("Preparing video...", { id: loadingToast });

      // Step 2: Send to backend
      setCurrentStep("Processing with FFmpeg...");
      setProgress(30);
      toast.loading("Processing video with FFmpeg...", { id: loadingToast });

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response OK:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || "Failed to process video" };
        }
        
        throw new Error(errorData.error || errorData.details || `Server error: ${response.status}`);
      }

      // Step 3: Parse response
      setCurrentStep("Generating remixes...");
      setProgress(60);
      toast.loading("Creating remix variations...", { id: loadingToast });

      const data = await response.json();
      console.log("✅ Received response from backend:", data);

      if (!data.success || !data.remixes || data.remixes.length === 0) {
        throw new Error("No remixes generated");
      }

      // Step 4: Map and validate remixes
      setCurrentStep("Finalizing videos...");
      setProgress(90);
      toast.loading("Finalizing your remixes...", { id: loadingToast });

      const remixes: RemixResult[] = data.remixes.map((remix: any, index: number) => ({
        id: remix.id || `remix-${Date.now()}-${index}`,
        url: remix.url,
        thumbnail: remix.thumbnail || '',
        style: remix.style || selectedStyle,
        duration: remix.duration || duration,
        effects: remix.effects || selectedEffects,
        title: remix.title || remix.caption || `${selectedStyle} Remix ${index + 1}`,
        description: remix.description || `${selectedStyle} style remix with ${selectedEffects.join(', ')}`,
      }));

      // Verify all video URLs
      console.log("🔍 Validating remix URLs...");
      for (const remix of remixes) {
        console.log("✅ Remix URL:", remix.url);
        if (!remix.url) {
          throw new Error("Invalid video URL received from server");
        }
      }

      setProgress(100);
      toast.success(`✨ Generated ${variations} remix variations!`, { id: loadingToast });
      console.log("✅ All remixes generated successfully:", remixes);

      // Pass remixes to parent component
      onGenerate(remixes);

      // Show detailed success summary
      setTimeout(() => {
        const effectsList = selectedEffects.join(', ');
        toast.success(
          `🎉 Created ${variations} unique ${selectedStyle} remix${variations > 1 ? 'es' : ''} with ${effectsList}!`,
          { duration: 5000 }
        );
      }, 500);

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setProgress(0);
        setCurrentStep("");
      }, 1500);

    } catch (error) {
      console.error("❌ Error generating remix:", error);
      
      let errorMessage = "Failed to generate remix. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { id: loadingToast, duration: 5000 });
      setProgress(0);
      setCurrentStep("");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      overflowY: "auto" as const,
      padding: "20px",
      backdropFilter: "blur(4px)",
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "16px",
      padding: "28px",
      width: "90%",
      maxWidth: "750px",
      maxHeight: "90vh",
      overflowY: "auto" as const,
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
      paddingBottom: "16px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    title: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#e5e5e5",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#888",
      fontSize: "28px",
      cursor: "pointer",
      padding: "4px",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      transition: "all 0.2s",
    },
    section: {
      marginBottom: "28px",
    },
    label: {
      display: "block",
      fontSize: "15px",
      fontWeight: "700",
      color: "#e5e5e5",
      marginBottom: "14px",
      letterSpacing: "0.3px",
    },
    styleGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "14px",
    },
    styleCard: {
      padding: "18px",
      backgroundColor: "#0f0f0f",
      border: "2px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center" as const,
    },
    styleCardActive: {
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      borderColor: "#3b82f6",
      transform: "scale(1.03)",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },
    styleIcon: {
      fontSize: "36px",
      marginBottom: "10px",
    },
    styleName: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#e5e5e5",
      marginBottom: "4px",
    },
    styleDescription: {
      fontSize: "12px",
      color: "#999",
    },
    sliderContainer: {
      marginTop: "12px",
    },
    sliderLabel: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      fontSize: "13px",
      color: "#999",
    },
    slider: {
      width: "100%",
      height: "6px",
      borderRadius: "3px",
      appearance: "none" as const,
      backgroundColor: "rgba(255,255,255,0.15)",
      outline: "none",
    },
    effectsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "14px",
    },
    effectCard: {
      padding: "16px",
      backgroundColor: "#0f0f0f",
      border: "2px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },
    effectCardActive: {
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      borderColor: "#3b82f6",
      transform: "scale(1.03)",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },
    effectIcon: {
      fontSize: "28px",
    },
    effectName: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#e5e5e5",
    },
    infoBox: {
      padding: "18px",
      backgroundColor: "rgba(59, 130, 246, 0.12)",
      border: "1px solid rgba(59, 130, 246, 0.35)",
      borderRadius: "10px",
      marginBottom: "24px",
    },
    infoTitle: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#3b82f6",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    infoText: {
      fontSize: "13px",
      color: "#999",
      lineHeight: "1.6",
    },
    warningBox: {
      padding: "18px",
      backgroundColor: "rgba(255, 107, 107, 0.12)",
      border: "1px solid rgba(255, 107, 107, 0.35)",
      borderRadius: "10px",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },
    warningIcon: {
      fontSize: "28px",
    },
    warningContent: {
      flex: 1,
    },
    warningTitle: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#ff6b6b",
      marginBottom: "6px",
    },
    warningText: {
      fontSize: "13px",
      color: "#999",
      lineHeight: "1.6",
    },
    progressContainer: {
      marginBottom: "24px",
      padding: "16px",
      backgroundColor: "#0f0f0f",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    progressBar: {
      width: "100%",
      height: "8px",
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: "4px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #3b82f6, #2563eb, #1d4ed8)",
      transition: "width 0.3s ease",
      borderRadius: "4px",
      boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
    },
    progressText: {
      fontSize: "13px",
      color: "#999",
      marginTop: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    buttonGroup: {
      display: "flex",
      gap: "14px",
      marginTop: "28px",
    },
    button: {
      flex: 1,
      padding: "14px 28px",
      borderRadius: "10px",
      fontSize: "15px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    cancelButton: {
      backgroundColor: "transparent",
      border: "2px solid rgba(255,255,255,0.15)",
      color: "#999",
    },
    generateButton: {
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },
    generateButtonDisabled: {
      background: "linear-gradient(135deg, #666 0%, #555 100%)",
      cursor: "not-allowed",
      opacity: 0.5,
      boxShadow: "none",
    },
    videoPreview: {
      width: "100%",
      height: "180px",
      backgroundColor: "#0f0f0f",
      borderRadius: "10px",
      border: "2px solid rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
      overflow: "hidden",
      position: "relative" as const,
    },
    videoThumbnail: {
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
    },
    videoInfo: {
      position: "absolute" as const,
      bottom: "10px",
      left: "10px",
      right: "10px",
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      padding: "10px 14px",
      borderRadius: "8px",
      fontSize: "14px",
      color: "#e5e5e5",
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "700",
      backdropFilter: "blur(4px)",
    },
    noVideoContainer: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: "10px",
    },
    noVideoIcon: {
      fontSize: "56px",
      opacity: 0.3,
    },
    noVideoText: {
      color: "#999",
      fontSize: "16px",
      fontWeight: "700",
    },
    noVideoHint: {
      color: "#666",
      fontSize: "13px",
    },
  };

  const hasVideo = currentVideo && currentVideo.url;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
            Remix Shorts with AI
          </div>
          <button
            style={styles.closeButton}
            onClick={onClose}
            disabled={isGenerating}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ×
          </button>
        </div>

        {/* Video Preview */}
        <div style={styles.videoPreview}>
          {hasVideo ? (
            <>
              {currentVideo.thumbnail ? (
                <img 
                  src={currentVideo.thumbnail} 
                  alt="Video preview" 
                  style={styles.videoThumbnail}
                  onError={(e) => {
                    console.error("Failed to load thumbnail");
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <video 
                  src={currentVideo.url} 
                  style={styles.videoThumbnail}
                  muted
                  // onError={(e) => console.error("Failed to load video preview")}
                />
              )}
              <div style={styles.videoInfo}>
                <span>📹 Video Ready</span>
                <span>{currentVideo.duration}s</span>
              </div>
            </>
          ) : (
            <div style={styles.noVideoContainer}>
              <div style={styles.noVideoIcon}>🎥</div>
              <div style={styles.noVideoText}>No Video Selected</div>
              <div style={styles.noVideoHint}>Upload a video to continue</div>
            </div>
          )}
        </div>

        {/* Warning if no video */}
        {!hasVideo && (
          <div style={styles.warningBox}>
            <div style={styles.warningIcon}>⚠️</div>
            <div style={styles.warningContent}>
              <div style={styles.warningTitle}>No Video Selected</div>
              <div style={styles.warningText}>
                Please close this modal and upload or select a video before generating remixes.
              </div>
            </div>
          </div>
        )}

        {/* Info box */}
        {hasVideo && (
          <div style={styles.infoBox}>
            <div style={styles.infoTitle}>
              <span>🤖</span>
              Real FFmpeg Processing
            </div>
            <div style={styles.infoText}>
              Each variation will be uniquely processed with different zoom levels, speeds, transitions, and color grading.
              Processing time: ~1-3 minutes per variation.
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isGenerating && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
            <div style={styles.progressText}>
              <span>{currentStep}</span>
              <span><strong>{progress}%</strong></span>
            </div>
          </div>
        )}

        <div style={styles.section}>
          <label style={styles.label}>Remix Style</label>
          <div style={styles.styleGrid}>
            {REMIX_STYLES.map((style) => (
              <div
                key={style.id}
                style={{
                  ...styles.styleCard,
                  ...(selectedStyle === style.id ? styles.styleCardActive : {}),
                  ...(isGenerating ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                }}
                onClick={() => !isGenerating && setSelectedStyle(style.id)}
              >
                <div style={styles.styleIcon}>{style.icon}</div>
                <div style={styles.styleName}>{style.name}</div>
                <div style={styles.styleDescription}>{style.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Target Duration: {duration}s</label>
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>15s (Quick)</span>
              <span>Perfect for TikTok & Reels</span>
              <span>60s (Full)</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              style={styles.slider}
              disabled={isGenerating}
            />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Variations: {variations}</label>
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              <span>1 (Single)</span>
              <span>Each variation is visually unique</span>
              <span>5 (Max)</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={variations}
              onChange={(e) => setVariations(parseInt(e.target.value))}
              style={styles.slider}
              disabled={isGenerating}
            />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>
            Effects to Include ({selectedEffects.length} selected)
          </label>
          <div style={styles.effectsGrid}>
            {EFFECTS.map((effect) => (
              <div
                key={effect.id}
                style={{
                  ...styles.effectCard,
                  ...(selectedEffects.includes(effect.id) ? styles.effectCardActive : {}),
                  ...(isGenerating ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                }}
                onClick={() => !isGenerating && toggleEffect(effect.id)}
              >
                <div style={styles.effectIcon}>{effect.icon}</div>
                <div style={styles.effectName}>{effect.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            disabled={isGenerating}
            onMouseOver={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...(isGenerating || !hasVideo ? styles.generateButtonDisabled : styles.generateButton),
            }}
            onClick={handleGenerate}
            disabled={isGenerating || !hasVideo}
            onMouseOver={(e) => {
              if (!isGenerating && hasVideo) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
            }}
          >
            {isGenerating ? (
              <>
                <span style={{
                  width: "18px",
                  height: "18px",
                  border: "3px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  display: "inline-block",
                }} />
                Processing...
              </>
            ) : !hasVideo ? (
              <>🚫 No Video Selected</>
            ) : (
              <>✨ Generate {variations} Unique Remix{variations > 1 ? "es" : ""}</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
        }

        input[type="range"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        input[type="range"]:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
        }

        input[type="range"]:disabled::-moz-range-thumb {
          cursor: not-allowed;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};