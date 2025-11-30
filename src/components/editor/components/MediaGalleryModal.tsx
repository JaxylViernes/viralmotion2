import React, { useState, useCallback, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface MediaGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'text' | 'audio' | 'media' | 'video';
  preselectedItem?: any;
  onConfirm: (selectedItem: any) => void;
}

type SidebarTab = 'home' | 'giphy' | 'viewFiles' | 'addMedia';

interface FilePreview {
  file: File;
  preview: string;
  name: string;
  type: string;
}

// ============================================================================
// MEDIA GALLERY MODAL COMPONENT
// ============================================================================

export const MediaGalleryModal: React.FC<MediaGalleryModalProps> = ({
  isOpen,
  onClose,
  activeTab = 'media',
  // preselectedItem,
  onConfirm,
}) => {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('addMedia');
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

  // ============================================================================
  // FILE UPLOAD HANDLING
  // ============================================================================

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Filter based on active tab
      if (activeTab === 'audio') {
        return file.type.startsWith('audio/');
      } else if (activeTab === 'video') {
        return file.type.startsWith('video/');
      } else if (activeTab === 'media') {
        return file.type.startsWith('image/');
      }
      return true;
    });
    
    // Create previews for each file
    const newFiles: FilePreview[] = validFiles.map(file => ({
      file,
      name: file.name,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, [activeTab]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => {
      const file = prev[index];
      if (file.preview.startsWith('blob:')) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleAddToProject = useCallback(() => {
    console.log('🚀 handleAddToProject called, selectedFiles:', selectedFiles.length);
    if (selectedFiles.length > 0) {
      // Convert files to base64 or handle upload
      let processedCount = 0;
      selectedFiles.forEach((filePreview, index) => {
        console.log(`📄 Processing file ${index + 1}/${selectedFiles.length}:`, filePreview.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (result) {
            console.log(`✅ File ${index + 1} converted to base64, length:`, (result as string).length);
            const mediaData = {
              name: filePreview.name,
              type: filePreview.type,
              data: result,
              file: filePreview.file,
              preview: filePreview.preview,
            };
            console.log('📤 Calling onConfirm with:', mediaData.name, mediaData.type);
            onConfirm(mediaData);
          }
          processedCount++;
          // Close modal after all files are processed
          if (processedCount === selectedFiles.length) {
            console.log('✅ All files processed, closing modal');
            onClose();
          }
        };
        reader.readAsDataURL(filePreview.file);
      });
    }
  }, [selectedFiles, onConfirm, onClose]);

  if (!isOpen) return null;

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(4px)',
    },
    modal: {
      width: '90%',
      maxWidth: '900px',
      height: '80vh',
      backgroundColor: '#0f0f0f',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    },
    header: {
      padding: '20px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    headerTitle: {
      fontSize: '18px',
      fontWeight: '600' as const,
      color: '#e5e5e5',
    },
    headerTab: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#888',
      fontSize: '13px',
      fontWeight: '500' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    headerTabActive: {
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      color: '#6366f1',
    },
    closeButton: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#888',
      fontSize: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    content: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden',
    },
    sidebar: {
      width: '200px',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '16px 0',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    sidebarButton: {
      padding: '12px 20px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#888',
      fontSize: '13px',
      fontWeight: '500' as const,
      cursor: 'pointer',
      textAlign: 'left' as const,
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    sidebarButtonActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#e5e5e5',
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    },
    uploadArea: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      overflowY: 'auto' as const,
    },
    uploadBox: {
      width: '100%',
      maxWidth: '500px',
      padding: '60px 40px',
      border: '2px dashed rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      textAlign: 'center' as const,
      transition: 'all 0.3s',
      cursor: 'pointer',
    },
    uploadBoxDragging: {
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
    },
    uploadIcon: {
      width: '48px',
      height: '48px',
      margin: '0 auto 16px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#888',
      fontSize: '24px',
    },
    uploadTitle: {
      fontSize: '16px',
      fontWeight: '600' as const,
      color: '#e5e5e5',
      marginBottom: '8px',
    },
    uploadSubtitle: {
      fontSize: '13px',
      color: '#888',
      marginBottom: '4px',
    },
    uploadFormats: {
      fontSize: '11px',
      color: '#666',
    },
    previewArea: {
      padding: '16px 24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      maxHeight: '300px',
      overflowY: 'auto' as const,
      flex: 1,
    },
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '12px',
    },
    previewCard: {
      position: 'relative' as const,
      aspectRatio: '1',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    previewName: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      padding: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#e5e5e5',
      fontSize: '10px',
      fontWeight: '500' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    removeButton: {
      position: 'absolute' as const,
      top: '4px',
      right: '4px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: 'none',
      color: '#fff',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    fileItem: {
      padding: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '13px',
      color: '#e5e5e5',
    },
    footer: {
      padding: '16px 24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    },
    fileCount: {
      fontSize: '13px',
      color: '#888',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
    },
    cancelButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: 'transparent',
      color: '#e5e5e5',
      fontSize: '13px',
      fontWeight: '500' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    addButton: {
      padding: '10px 24px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#6366f1',
      color: '#fff',
      fontSize: '13px',
      fontWeight: '500' as const,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    addButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  // const getFileTypeLabel = () => {
  //   switch (activeTab) {
  //     case 'audio': return 'audio';
  //     case 'video': return 'video';
  //     case 'media': return 'images';
  //     case 'text': return 'text';
  //     default: return 'files';
  //   }
  // };

  const getAcceptedFormats = () => {
    switch (activeTab) {
      case 'audio': return 'Supported: mp3, wav, ogg, m4a';
      case 'video': return 'Supported: mp4, webm, mov';
      case 'media': return 'Supported: jpg, png, gif, webp';
      default: return '';
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.headerTitle}>Media gallery</span>
            <button 
              style={{
                ...styles.headerTab,
                ...styles.headerTabActive
              }}
            >
              Add Media
            </button>
          </div>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'home' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('home')}
              onMouseOver={(e) => {
                if (sidebarTab !== 'home') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseOut={(e) => {
                if (sidebarTab !== 'home') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>🏠</span> Home
            </button>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'giphy' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('giphy')}
              onMouseOver={(e) => {
                if (sidebarTab !== 'giphy') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseOut={(e) => {
                if (sidebarTab !== 'giphy') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>🎬</span> Giphy library
            </button>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'viewFiles' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('viewFiles')}
              onMouseOver={(e) => {
                if (sidebarTab !== 'viewFiles') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseOut={(e) => {
                if (sidebarTab !== 'viewFiles') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>📂</span> View files
            </button>
            <button
              style={{
                ...styles.sidebarButton,
                ...(sidebarTab === 'addMedia' ? styles.sidebarButtonActive : {}),
              }}
              onClick={() => setSidebarTab('addMedia')}
              onMouseOver={(e) => {
                if (sidebarTab !== 'addMedia') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseOut={(e) => {
                if (sidebarTab !== 'addMedia') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>➕</span> Add media
            </button>
          </div>

          {/* Main Area */}
          <div style={styles.mainArea}>
            {sidebarTab === 'addMedia' ? (
              <>
                {selectedFiles.length === 0 ? (
                  <div style={styles.uploadArea}>
                    <label htmlFor="file-upload">
                      <div
                        style={{
                          ...styles.uploadBox,
                          ...(isDragging ? styles.uploadBoxDragging : {}),
                        }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        <div style={styles.uploadIcon}>☁️</div>
                        <div style={styles.uploadTitle}>Upload files</div>
                        <div style={styles.uploadSubtitle}>
                          Drag and drop or click to browse
                        </div>
                        <div style={styles.uploadFormats}>
                          {getAcceptedFormats()}
                        </div>
                      </div>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept={
                        activeTab === 'audio' ? 'audio/*' :
                        activeTab === 'video' ? 'video/*' :
                        activeTab === 'media' ? 'image/*' : '*'
                      }
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </div>
                ) : (
                  <div style={styles.previewArea}>
                    {/* Image Previews Grid */}
                    {activeTab === 'media' ? (
                      <div style={styles.previewGrid}>
                        {selectedFiles.map((filePreview, index) => (
                          <div
                            key={index}
                            style={styles.previewCard}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <img
                              src={filePreview.preview}
                              alt={filePreview.name}
                              style={styles.previewImage}
                            />
                            <div style={styles.previewName}>
                              {filePreview.name}
                            </div>
                            <button
                              style={styles.removeButton}
                              onClick={() => handleRemoveFile(index)}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#dc2626';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {/* Add more button */}
                        <label htmlFor="file-upload-more">
                          <div
                            style={{
                              ...styles.previewCard,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px dashed rgba(255, 255, 255, 0.2)',
                              backgroundColor: 'transparent',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = '#3b82f6';
                              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <div style={{ textAlign: 'center', color: '#888' }}>
                              <div style={{ fontSize: '24px', marginBottom: '4px' }}>+</div>
                              <div style={{ fontSize: '10px' }}>Add more</div>
                            </div>
                          </div>
                        </label>
                        <input
                          id="file-upload-more"
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileSelect(e.target.files)}
                        />
                      </div>
                    ) : (
                      // Audio/Video file list
                      <div>
                        {selectedFiles.map((filePreview, index) => (
                          <div key={index} style={styles.fileItem}>
                            <span>{filePreview.name}</span>
                            <button
                              style={styles.removeButton}
                              onClick={() => handleRemoveFile(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div style={styles.uploadArea}>
                <div style={{ textAlign: 'center', color: '#888' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    {sidebarTab === 'home' && '🏠'}
                    {sidebarTab === 'giphy' && '🎬'}
                    {sidebarTab === 'viewFiles' && '📂'}
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    {sidebarTab === 'home' && 'Home content coming soon'}
                    {sidebarTab === 'giphy' && 'Giphy library coming soon'}
                    {sidebarTab === 'viewFiles' && 'Your files will appear here'}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            {selectedFiles.length > 0 && (
              <div style={styles.footer}>
                <div style={styles.fileCount}>
                  {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    style={styles.cancelButton}
                    onClick={onClose}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      ...styles.addButton,
                      ...(selectedFiles.length === 0 ? styles.addButtonDisabled : {}),
                    }}
                    onClick={handleAddToProject}
                    disabled={selectedFiles.length === 0}
                    onMouseOver={(e) => {
                      if (selectedFiles.length > 0) {
                        e.currentTarget.style.backgroundColor = '#5558e3';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedFiles.length > 0) {
                        e.currentTarget.style.backgroundColor = '#6366f1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    Add {selectedFiles.length} to project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaGalleryModal;