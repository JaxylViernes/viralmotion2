// // ============================================================================
// // COMPLETE FIXED SimpleTemplateRegistry.ts
// // ✅ Fixed: Selection box positioning (centered correctly)
// // ✅ Fixed: All layers unlocked (can be deleted)
// // ============================================================================

// import React from 'react';
// import type { Layer } from '../components/remotion_compositions/DynamicLayerComposition';
// import { DynamicLayerComposition } from '../components/remotion_compositions/DynamicLayerComposition';
// import { KenBurnsCarousel2 } from '../components/editors/KenBurnsSwipeTemplate';

// export interface TemplateDefinition {
//   id: number;
//   name: string;
//   displayName: string;
//   description?: string;
//   category?: string;
//   thumbnailUrl?: string;
//   composition: React.FC<any>;
//   compositionId: string;
//   createDefaultLayers: () => Layer[];
//   layersToProps: (layers: Layer[]) => any;
//   calculateDuration?: (layers: Layer[]) => number;
// }

// export const TEMPLATES: Record<number, TemplateDefinition> = {
//   // ========================================
//   // TEMPLATE 1: QUOTE SPOTLIGHT
//   // ✅ FIXED: All positioning and delete issues resolved
//   // ========================================
//   1: {
//     id: 1,
//     name: 'quotetemplate',
//     displayName: 'Quote Spotlight',
//     description: 'Beautiful quote graphics - Fully Editable!',
//     category: 'Text',
//     thumbnailUrl: '/template_previews/QuoteSpotlight.mp4',
//     composition: DynamicLayerComposition,
//     compositionId: 'DynamicLayerComposition',
    
//     createDefaultLayers: () => [
//       // ========================================
//       // BACKGROUND IMAGE
//       // ========================================
//       {
//         id: 'background',
//         type: 'image',
//         name: 'Background',
//         startFrame: 0,
//         endFrame: 270,
//         visible: true,
//         locked: false,  // ✅ Background should be locked to prevent accidental deletion
//         src: 'https://res.cloudinary.com/dcu9xuof0/image/upload/v1764429657/OIP_fchw6q.png',
//         isBackground: true,
//         objectFit: 'cover',
//         filter: 'brightness(0.6)',
//         position: { x: 50, y: 50 },
//         size: { width: 100, height: 100 },
//         rotation: 0,
//         opacity: 1,
//         animation: { entrance: 'fade', entranceDuration: 60 },
//       },
      
//       // ========================================
//       // QUOTATION MARK
//       // ✅ FIXED: Position adjusted for CENTER positioning
//       // ✅ FIXED: Unlocked so it can be deleted
//       // ========================================
//       {
//         id: 'quote-mark',
//         type: 'text',
//         name: 'Quotation Mark',
//         startFrame: 30,
//         endFrame: 270,
//         visible: true,
//         locked: false,  // ✅ UNLOCKED - can be deleted/edited freely
        
//         content: '"',
//         fontFamily: 'Libre Baskerville, Baskerville, Georgia, serif',
//         fontStyle: 'italic',
//         fontSize: 8,
//         fontColor: '#FFFFFF',
//         fontWeight: '400',
//         textAlign: 'center',
//         lineHeight: 0.8,
//         letterSpacing: 0,
//         textTransform: 'none',
//         textOutline: false,
//         textShadow: false,
        
//         // ✅ CRITICAL FIX: Position represents CENTER of the box
//         // For a 5×5% box at top-left (15, 18), center is at (17.5, 20.5)
//         position: { x: 17.5, y: 20.5 },
//         size: { width: 5, height: 5 },
//         rotation: 0,
//         opacity: 1,
//         animation: { entrance: 'scale', entranceDuration: 45 },
//       },
      
//       // ========================================
//       // MAIN QUOTE TEXT
//       // ✅ FIXED: Unlocked so it can be deleted
//       // ========================================
//       {
//         id: 'quote-text',
//         type: 'text',
//         name: 'Quote',
//         startFrame: 30,
//         endFrame: 270,
//         visible: true,
//         locked: false,  // ✅ UNLOCKED - can be deleted/edited freely
        
//         content: 'Life is like riding a bicycle. To keep your balance, you must keep movin.',
//         fontFamily: 'Libre Baskerville, Baskerville, Georgia, serif',
//         fontSize: 4,
//         fontColor: '#ffffff',
//         fontWeight: '400',
//         fontStyle: 'italic',
//         textAlign: 'center',
//         lineHeight: 1.5,
//         letterSpacing: 0,
//         textTransform: 'none',
//         textOutline: false,
//         textShadow: true,
//         shadowColor: 'rgba(0, 0, 0, 0.9)',
//         shadowX: 2,
//         shadowY: 2,
//         shadowBlur: 10,
        
//         // Position is already centered (50, 45)
//         position: { x: 50, y: 45 },
//         size: { width: 60, height: 20 },
//         rotation: 0,
//         opacity: 1,
//        animation: { 
//     entrance: 'bounce',      // ✅ or 'zoomPunch'
//     entranceDuration: 60,
//   },
//       },
      
//       // ========================================
//       // AUTHOR NAME
//       // ✅ FIXED: Smaller size for better fit
//       // ✅ FIXED: Unlocked so it can be deleted
//       // ========================================
//       {
//         id: 'author-text',
//         type: 'text',
//         name: 'Author',
//         startFrame: 180,
//         endFrame: 270,
//         visible: true,
//         locked: false,  // ✅ UNLOCKED - can be deleted/edited freely
        
//         content: '— ALBERT EINSTEIN',
//         fontFamily: 'Libre Baskerville, Baskerville, Georgia, serif',
//         fontSize: 2.5,
//         fontColor: '#ffffff',
//         fontWeight: '400',
//         fontStyle: 'normal',
//         textAlign: 'center',
//         lineHeight: 1.2,
//         letterSpacing: 2.5,
//         textTransform: 'uppercase',
//         textOutline: false,
//         textShadow: true,
//         shadowColor: 'rgba(0, 0, 0, 0.7)',
//         shadowX: 1,
//         shadowY: 1,
//         shadowBlur: 4,
        
//         // Position is already centered (50, 83)
//         position: { x: 50, y: 83 },
//         size: { width: 30, height: 4 },
//         rotation: 0,
//         opacity: 1,
//         animation: { entrance: 'fade', entranceDuration: 45 },
//       }
//     ] as Layer[],
    
//     layersToProps: (layers) => ({ layers }),
//     calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
//   },

//   // ========================================
//   // TEMPLATE 2: TYPING ANIMATION
//   // ========================================
//   2: {
//     id: 2,
//     name: 'typinganimation',
//     displayName: 'Typing Animation',
//     description: 'Animated typing effect with cursor',
//     category: 'Text',
//     thumbnailUrl: '/template_previews/TypingAnimation.mp4',
//     composition: DynamicLayerComposition,
//     compositionId: 'DynamicLayerComposition',
    
//     createDefaultLayers: () => [
//       {
//         id: 'background',
//         type: 'image',
//         name: 'Background',
//         startFrame: 0,
//         endFrame: 270,
//         visible: true,
//         locked: false,
//         src: 'https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg',
//         isBackground: true,
//         objectFit: 'cover',
//         filter: 'brightness(0.4)',
//         position: { x: 50, y: 50 },
//         size: { width: 100, height: 100 },
//         rotation: 0,
//         opacity: 1,
//         animation: { entrance: 'fade', entranceDuration: 30 },
//       },
//       {
//         id: 'typing-text',
//         type: 'text',
//         name: 'Typing Text',
//         startFrame: 30,
//         endFrame: 270,
//         visible: true,
//         locked: false,
//         content: 'Your text appears here with typing animation',
//         fontFamily: 'Courier New, monospace',
//         fontSize: 42,
//         fontColor: '#00ff00',
//         fontWeight: 'normal',
//         fontStyle: 'normal',
//         textAlign: 'left',
//         lineHeight: 1.4,
//         letterSpacing: 0,
//         textTransform: 'none',
//         textOutline: false,
//         textShadow: true,
//         shadowColor: 'rgba(0, 255, 0, 0.5)',
//         shadowX: 0,
//         shadowY: 0,
//         shadowBlur: 10,
//         position: { x: 50, y: 50 },
//         size: { width: 80, height: 40 },
//         rotation: 0,
//         opacity: 1,
//         animation: { entrance: 'fade', entranceDuration: 30 },
//       },
//     ] as Layer[],
    
//     layersToProps: (layers) => ({ layers }),
//     calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
//   },

//   // ========================================
//   // TEMPLATE 8: KEN BURNS CAROUSEL
//   // ========================================
//   8: {
//     id: 8,
//     name: 'kenburnscarousel',
//     displayName: 'Ken Burns Carousel',
//     description: 'Cinematic carousel with Ken Burns effect - Edit via Carousel Panel',
//     category: 'Media',
//     thumbnailUrl: '/template_previews/KenBurnsCarousel.mp4',
    
//     composition: KenBurnsCarousel2,
//     compositionId: 'KenBurnsCarousel2',
    
//     createDefaultLayers: () => [
//       {
//         id: 'carousel-image-1',
//         type: 'image',
//         name: 'Image 1',
//         startFrame: 0,
//         endFrame: 360,
//         visible: true,
//         locked: false,
//         src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80',
//         isBackground: false,
//         objectFit: 'cover',
//         position: { x: 50, y: 50 },
//         size: { width: 80, height: 80 },
//         rotation: 0,
//         opacity: 1,
//       },
//       {
//         id: 'carousel-image-2',
//         type: 'image',
//         name: 'Image 2',
//         startFrame: 0,
//         endFrame: 360,
//         visible: true,
//         locked: false,
//         src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&q=80',
//         isBackground: false,
//         objectFit: 'cover',
//         position: { x: 50, y: 50 },
//         size: { width: 80, height: 80 },
//         rotation: 0,
//         opacity: 1,
//       },
//       {
//         id: 'carousel-image-3',
//         type: 'image',
//         name: 'Image 3',
//         startFrame: 0,
//         endFrame: 360,
//         visible: true,
//         locked: false,
//         src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&q=80',
//         isBackground: false,
//         objectFit: 'cover',
//         position: { x: 50, y: 50 },
//         size: { width: 80, height: 80 },
//         rotation: 0,
//         opacity: 1,
//       },
//       {
//         id: 'carousel-image-4',
//         type: 'image',
//         name: 'Image 4',
//         startFrame: 0,
//         endFrame: 360,
//         visible: true,
//         locked: false,
//         src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&q=80',
//         isBackground: false,
//         objectFit: 'cover',
//         position: { x: 50, y: 50 },
//         size: { width: 80, height: 80 },
//         rotation: 0,
//         opacity: 1,
//       },
//     ] as Layer[],
    
//     layersToProps: (layers) => {
//       const imageLayers = layers.filter((l: any) => l.type === 'image');
//       const images = imageLayers.map((l: any) => l.src);
      
//       return {
//         images: images.length > 0 ? images : [
//           'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80'
//         ],
//         cardWidthRatio: 0.75,
//         cardHeightRatio: 0.75,
//         blurBgOpacity: 0.0,
//       };
//     },
    
//     calculateDuration: (layers) => {
//       const imageCount = layers.filter((l: any) => l.type === 'image').length;
//       return imageCount * 90;
//     }
//   },
// };

// // Helper functions
// export const getTemplate = (id: number): TemplateDefinition | undefined => {
//   return TEMPLATES[id];
// };

// export const getAllTemplates = (): TemplateDefinition[] => {
//   return Object.values(TEMPLATES);
// };

// export const getTemplatesByCategory = (category: string): TemplateDefinition[] => {
//   return Object.values(TEMPLATES).filter(t => t.category === category);
// };

// // Map template names to IDs
// export const TEMPLATE_NAME_TO_ID: Record<string, number> = {
//   'Quote Spotlight': 1,
//   'Typing Animation': 2,
//   'Bar Graph Analytics': 3,
//   'Kpi Flip Cards': 4,
//   'Curve Line Trend': 5,
//   'Split Screen': 6,
//   'Fact Cards': 7,
//   'Ken Burns Carousel': 8,
//   'Fake Text Conversation': 9,
//   'Reddit Post Narration': 10,
//   'Ai Story Narration': 11,
//   'Kinetic Typography': 12,
//   'Neon Flicker': 13,
//   'Heat Map': 14,
//   'Flip Cards': 15,
//   'Logo Animation': 16,
//   'Neon Lights Text': 17,
//   'Retro Neon Text': 18,
// };

// // Reverse mapping
// export const TEMPLATE_ID_TO_NAME: Record<number, string> = Object.fromEntries(
//   Object.entries(TEMPLATE_NAME_TO_ID).map(([name, id]) => [id, name])
// );


// ============================================================================
// COMPLETE FIXED SimpleTemplateRegistry.ts
// ✅ Fixed: Box sizes increased to fit text content + line height
// ✅ Fixed: Selection box positioning (centered correctly)
// ✅ Fixed: All layers unlocked (can be deleted)
// ============================================================================

import React from 'react';
import type { Layer } from '../components/remotion_compositions/DynamicLayerComposition';
import { DynamicLayerComposition } from '../components/remotion_compositions/DynamicLayerComposition';

export interface TemplateDefinition {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
  composition: React.FC<any>;
  compositionId: string;
  createDefaultLayers: () => Layer[];
  layersToProps: (layers: Layer[]) => any;
  calculateDuration?: (layers: Layer[]) => number;
}

export const TEMPLATES: Record<number, TemplateDefinition> = {
  // ========================================
  // TEMPLATE 1: QUOTE SPOTLIGHT
  // ========================================
  1: {
    id: 1,
    name: 'quotetemplate',
    displayName: 'Quote Spotlight',
    description: 'Beautiful quote graphics - Fully Editable!',
    category: 'Text',
    thumbnailUrl: '/template_previews/QuoteSpotlight.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    
    createDefaultLayers: () => [
      // ========================================
      // BACKGROUND IMAGE
      // ========================================
      {
        id: 'background',
        type: 'image',
        name: 'Background',
        startFrame: 0,
        endFrame: 270,
        visible: true,
        locked: false,
        src: 'https://res.cloudinary.com/dcu9xuof0/image/upload/v1764429657/OIP_fchw6q.png',
        isBackground: true,
        objectFit: 'cover',
        filter: 'brightness(0.6)',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'fade', entranceDuration: 60 },
      },
      
      // ========================================
      // QUOTATION MARK
      // ✅ FIXED: Height increased to 15% to fit size 8 font
      // ========================================
      {
        id: 'quote-mark',
        type: 'text',
        name: 'Quotation Mark',
        startFrame: 30,
        endFrame: 270,
        visible: true,
        locked: false,
        
        content: '"',
        fontFamily: 'Libre Baskerville, Baskerville, Georgia, serif',
        fontStyle: 'italic',
        fontSize: 8,
        fontColor: '#FFFFFF',
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: 0.8,
        letterSpacing: 0,
        textTransform: 'none',
        textOutline: false,
        textShadow: false,
        
        position: { x: 50, y: 22 }, 
        size: { width: 15, height: 15 }, 
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'scale', entranceDuration: 45 },
      },
      
      // ========================================
      // MAIN QUOTE TEXT
      // ========================================
      {
        id: 'quote-text',
        type: 'text',
        name: 'Quote',
        startFrame: 30,
        endFrame: 270,
        visible: true,
        locked: false,
        
        content: 'Life is like riding a bicycle. To keep your balance, you must keep movin.',
        fontFamily: 'Libre Baskerville, Baskerville, Georgia, serif',
        fontSize: 4,
        fontColor: '#ffffff',
        fontWeight: '400',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 1.5,
        letterSpacing: 0,
        textTransform: 'none',
        textOutline: false,
        textShadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.9)',
        shadowX: 2,
        shadowY: 2,
        shadowBlur: 10,
        
        position: { x: 50, y: 45 },
        size: { width: 70, height: 30 }, 
        rotation: 0,
        opacity: 1,
        animation: { 
          entrance: 'bounce',
          entranceDuration: 60,
        },
      },
      
      // ========================================
      // AUTHOR NAME
      // ✅ FIXED: Height increased to 8% to fit size 2.5 font
      // ========================================
      {
        id: 'author-text',
        type: 'text',
        name: 'Author',
        startFrame: 180,
        endFrame: 270,
        visible: true,
        locked: false,
        
        content: '— ALBERT EINSTEIN',
        fontFamily: 'Libre Baskerville, Baskerville, Georgia, serif',
        fontSize: 2.5,
        fontColor: '#ffffff',
        fontWeight: '400',
        fontStyle: 'normal',
        textAlign: 'center',
        lineHeight: 1.2,
        letterSpacing: 2.5,
        textTransform: 'uppercase',
        textOutline: false,
        textShadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.7)',
        shadowX: 1,
        shadowY: 1,
        shadowBlur: 4,
        
        position: { x: 50, y: 80 },
        size: { width: 60, height: 8 }, 
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'fade', entranceDuration: 45 },
      }
    ] as Layer[],
    
    layersToProps: (layers) => ({ layers }),
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },

  // ========================================
  // TEMPLATE 2: TYPING ANIMATION
  // ========================================
  2: {
    id: 2,
    name: 'typinganimation',
    displayName: 'Typing Animation',
    description: 'Animated typing effect with cursor',
    category: 'Text',
    thumbnailUrl: '/template_previews/TypingAnimation.mp4',
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    
    createDefaultLayers: () => [
      {
        id: 'background',
        type: 'image',
        name: 'Background',
        startFrame: 0,
        endFrame: 270,
        visible: true,
        locked: false,
        src: 'https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg',
        isBackground: true,
        objectFit: 'cover',
        filter: 'brightness(0.4)',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'fade', entranceDuration: 30 },
      },
      {
        id: 'typing-text',
        type: 'text',
        name: 'Typing Text',
        startFrame: 30,
        endFrame: 270,
        visible: true,
        locked: false,
        content: 'Your text appears here with typing animation',
        fontFamily: 'Courier New, monospace',
        fontSize: 42,
        fontColor: '#00ff00',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        lineHeight: 1.4,
        letterSpacing: 0,
        textTransform: 'none',
        textOutline: false,
        textShadow: true,
        shadowColor: 'rgba(0, 255, 0, 0.5)',
        shadowX: 0,
        shadowY: 0,
        shadowBlur: 10,
        position: { x: 50, y: 50 },
        size: { width: 80, height: 40 },
        rotation: 0,
        opacity: 1,
        animation: { entrance: 'fade', entranceDuration: 30 },
      },
    ] as Layer[],
    
    layersToProps: (layers) => ({ layers }),
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },

 6: {
  id: 6,
  name: 'splitscreen',
  displayName: 'Split Screen',
  description: 'Upper/Lower split screen - Fully editable',
  category: 'Media',
  thumbnailUrl: '/template_previews/SplitScreen.mp4',
  
  // ✅ USE EXISTING COMPOSITION
  composition: DynamicLayerComposition,
  compositionId: 'DynamicLayerComposition',
  
  createDefaultLayers: () => [
    // ========================================
    // UPPER PANEL (TOP HALF)
    // ========================================
    {
      id: 'upper-panel',
      type: 'video',
      name: 'Upper Panel',
      startFrame: 0,
      endFrame: 600,  // ✅ Longer duration
      visible: true,
      locked: false,
      
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      
      position: { x: 50, y: 25 },  // Top half
      size: { width: 100, height: 50 },
      rotation: 0,
      opacity: 1,
      
      volume: 0.5,
      loop: true,
      playbackRate: 1,
      objectFit: 'cover',
      filter: '',
      fadeIn: 0,
      fadeOut: 0,
      
      // ✅ NO animation - prevents black screen
      animation: {
        entrance: 'none',
        entranceDuration: 0,
      },
    },
    
    // ========================================
    // LOWER PANEL (BOTTOM HALF)
    // ========================================
    {
      id: 'lower-panel',
      type: 'video',
      name: 'Lower Panel',
      startFrame: 0,
      endFrame: 600,  // ✅ Longer duration
      visible: true,
      locked: false,
      
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      
      position: { x: 50, y: 75 },  // Bottom half
      size: { width: 100, height: 50 },
      rotation: 0,
      opacity: 1,
      
      volume: 0.5,
      loop: true,
      playbackRate: 1,
      objectFit: 'cover',
      filter: '',
      fadeIn: 0,
      fadeOut: 0,
      
      // ✅ NO animation - prevents black screen
      animation: {
        entrance: 'none',
        entranceDuration: 0,
      },
    },
    
    // ========================================
    // HORIZONTAL DIVIDER LINE
    // ========================================
    {
      id: 'divider',
      type: 'image',
      name: 'Divider',
      startFrame: 0,
      endFrame: 600,
      visible: true,
      locked: false,
      
      src: 'data:image/svg+xml,%3Csvg width="1080" height="10" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="1080" height="10" fill="white"/%3E%3C/svg%3E',
      
      position: { x: 50, y: 50 },
      size: { width: 100, height: 0.5 },
      rotation: 0,
      opacity: 0.8,
      objectFit: 'fill',
      isBackground: false,
      
      animation: {
        entrance: 'none',
        entranceDuration: 0,
      },
    },
    
    // ========================================
    // UPPER LABEL
    // ========================================
    {
      id: 'upper-label',
      type: 'text',
      name: 'Upper Label',
      startFrame: 0,
      endFrame: 600,
      visible: true,
      locked: false,
      
      content: 'BEFORE',
      fontFamily: 'Montserrat, Arial, sans-serif',
      fontSize: 3.5,
      fontColor: '#ffffff',
      fontWeight: '700',
      fontStyle: 'normal',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 3,
      textTransform: 'uppercase',
      
      textOutline: true,
      outlineColor: '#000000',
      textShadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.8)',
      shadowX: 2,
      shadowY: 2,
      shadowBlur: 8,
      
      position: { x: 50, y: 12 },
      size: { width: 40, height: 8 },
      rotation: 0,
      opacity: 1,
      
      animation: {
        entrance: 'none',
        entranceDuration: 0,
      },
    },
    
    // ========================================
    // LOWER LABEL
    // ========================================
    {
      id: 'lower-label',
      type: 'text',
      name: 'Lower Label',
      startFrame: 0,
      endFrame: 600,
      visible: true,
      locked: false,
      
      content: 'AFTER',
      fontFamily: 'Montserrat, Arial, sans-serif',
      fontSize: 3.5,
      fontColor: '#ffffff',
      fontWeight: '700',
      fontStyle: 'normal',
      textAlign: 'center',
      lineHeight: 1.2,
      letterSpacing: 3,
      textTransform: 'uppercase',
      
      textOutline: true,
      outlineColor: '#000000',
      textShadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.8)',
      shadowX: 2,
      shadowY: 2,
      shadowBlur: 8,
      
      position: { x: 50, y: 62 },
      size: { width: 40, height: 8 },
      rotation: 0,
      opacity: 1,
      
      animation: {
        entrance: 'none',
        entranceDuration: 0,
      },
    },
  ] as Layer[],
  
  layersToProps: (layers) => ({ layers }),
  calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
},


  // ========================================
  // TEMPLATE 8: KEN BURNS CAROUSEL
  // ========================================
 // ========================================
  // TEMPLATE 8: BLURRED BACKGROUND VIDEO
  // ========================================
  8: {
    id: 8,
    name: 'kenburnscarousel',
    displayName: 'Blurred Background Video',
    description: 'Vertical video with auto-generated blurred background',
    category: 'Media',
    thumbnailUrl: '/template_previews/KenBurnsCarousel.mp4',
    
    composition: DynamicLayerComposition,
    compositionId: 'DynamicLayerComposition',
    
    createDefaultLayers: () => [
      // Video 1
      {
        id: 'video-1',
        type: 'video',
        name: 'Video Clip 1',
        startFrame: 0,
        endFrame: 150,
        visible: true,
        locked: false,
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
        objectFit: 'cover',
        // Center the foreground video (leaving space for blur behind it)
        position: { x: 50, y: 50 },
        size: { width: 50, height: 70 }, // Vertical aspect ratio
        rotation: 0,
        opacity: 1,
        volume: 1,
        playbackRate: 1,
        loop: false,
        animation: { entrance: 'fade', entranceDuration: 30 },
      },
    ] as Layer[],
    
    // ✅ CRITICAL: This ensures the Composition triggers the "Ken Burns" logic
    layersToProps: (layers) => ({ 
      layers,
      templateId: 8 
    }),
    
    calculateDuration: (layers) => Math.max(...layers.map(l => l.endFrame)),
  },
};
// Helper functions
export const getTemplate = (id: number): TemplateDefinition | undefined => {
  return TEMPLATES[id];
};

export const getAllTemplates = (): TemplateDefinition[] => {
  return Object.values(TEMPLATES);
};

export const getTemplatesByCategory = (category: string): TemplateDefinition[] => {
  return Object.values(TEMPLATES).filter(t => t.category === category);
};

// Map template names to IDs
export const TEMPLATE_NAME_TO_ID: Record<string, number> = {
  'Quote Spotlight': 1,
  'Typing Animation': 2,
  'Bar Graph Analytics': 3,
  'Kpi Flip Cards': 4,
  'Curve Line Trend': 5,
  'Split Screen': 6,
  'Fact Cards': 7,
  'Ken Burns Carousel': 8,
  'Fake Text Conversation': 9,
  'Reddit Post Narration': 10,
  'Ai Story Narration': 11,
  'Kinetic Typography': 12,
  'Neon Flicker': 13,
  'Heat Map': 14,
  'Flip Cards': 15,
  'Logo Animation': 16,
  'Neon Lights Text': 17,
  'Retro Neon Text': 18,
};

// Reverse mapping
export const TEMPLATE_ID_TO_NAME: Record<number, string> = Object.fromEntries(
  Object.entries(TEMPLATE_NAME_TO_ID).map(([name, id]) => [id, name])
);