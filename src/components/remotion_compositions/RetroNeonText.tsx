// import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

// Enhanced color schemes
const colorSchemes = {
  electric: {
    primary: '#00ff88',
    secondary: '#44ff99',
    accent: '#88ffaa',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0d1421 50%, #1a1a1a 75%, #0a0a0a 100%)'
  },
  sunset: {
    primary: '#ff6b35',
    secondary: '#f7931e',
    accent: '#ffcc02',
    bg: 'linear-gradient(135deg, #1a0f0a 0%, #2a1a1a 25%, #211408 50%, #2a1a1a 75%, #1a0f0a 100%)'
  },
  ocean: {
    primary: '#00d4ff',
    secondary: '#0099cc',
    accent: '#66e0ff',
    bg: 'linear-gradient(135deg, #0a1a1a 0%, #1a2a2a 25%, #081421 50%, #1a2a2a 75%, #0a1a1a 100%)'
  },
  cosmic: {
    primary: '#8a2be2',
    secondary: '#da70d6',
    accent: '#e6e6fa',
    bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 25%, #120821 50%, #1a0a2a 75%, #0a0a1a 100%)'
  },
  monochrome: {
    primary: '#ffffff',
    secondary: '#cccccc',
    accent: '#888888',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #111111 50%, #1a1a1a 75%, #0a0a0a 100%)'
  },
  rainbow: {
    primary: '#ff0080',
    secondary: '#00ff80',
    accent: '#8000ff',
    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 25%, #0a1a0a 50%, #1a0a1a 75%, #0a0a0a 100%)'
  }
};

type ColorSchemeKey = keyof typeof colorSchemes;

export const DynamicTextTemplate = ({
  text = "YOUR TEXT",
  style = "neon",
  colorScheme = "electric" as ColorSchemeKey,
  animationType = "typewriter",
  fontSize = 100,
  fontWeight = "900",
  spacing = "normal",
  effects = true,
  splitBy = "word",
  environmentalEffects = true,
  audioReactive = false,
  advancedEffects = true
}) => {
  const frame = useCurrentFrame();
  const {width, height } = useVideoConfig();
  
  const isPortrait = height > width;
  
  const colors = colorSchemes[colorScheme];
  
  // Text processing
  const processText = () => {
    if (splitBy === "word") {
      return text.split(' ').map(word => word.split(''));
    } else if (splitBy === "letter") {
      return [text.split('')];
    } else {
      return text.split('\n').map(line => line.split(''));
    }
  };

  const textParts = processText();
  
  // Letter spacing
  const getLetterSpacing = () => {
    if (isPortrait) {
      switch(spacing) {
        case "tight": return '1px';
        case "wide": return '6px';
        default: return '3px';
      }
    }

    switch(spacing) {
      case "tight": return '2px';
      case "wide": return '12px';
      default: return '6px';
    }
  };

  // Enhanced simulated audio reactivity with multiple frequency bands
  const bassLevel = audioReactive ? 
    Math.sin(frame * 0.08) * 0.4 + 0.6 : 1;
  const midLevel = audioReactive ? 
    Math.sin(frame * 0.15) * 0.3 + 0.7 : 1;
  const trebleLevel = audioReactive ? 
    Math.sin(frame * 0.25) * 0.5 + 0.5 : 1;
  const audioLevel = audioReactive ? 
    (bassLevel * 0.5 + midLevel * 0.3 + trebleLevel * 0.2) : 1;
  
  // Audio beat simulation
  const beatTrigger = audioReactive ? 
    Math.sin(frame * 0.12) > 0.7 ? 1.5 : 1 : 1;

  // Animation helpers
  const getLetterDelay = (partIndex: number, letterIndex: number) => {
    const baseDelay = splitBy === "word" ? partIndex * 30 : 0;
    return baseDelay + letterIndex * 8;
  };

  const getOpacity = (partIndex: number, letterIndex: number) => {
    const delay = getLetterDelay(partIndex, letterIndex);
    
    switch(animationType) {
      case "typewriter":
        return frame >= delay ? 1 : 0;
      case "fade": {
        return interpolate(frame, [delay, delay + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.ease)
        });
      }
      case "slide": {
        return interpolate(frame, [delay, delay + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(2))
        });
      }
      case "glitch": {
        if (frame < delay) return 0;
        
        const flickerDuration = 120;
        const stabilizeFrame = delay + flickerDuration;
        
        const flickerPhase1 = Math.sin(frame * 0.8 + letterIndex * 2) * 0.5 + 0.5;
        const flickerPhase2 = Math.sin(frame * 1.2 + letterIndex * 1.5) * 0.3 + 0.7;
        const flickerPhase3 = Math.sin(frame * 2.1 + letterIndex * 0.8) * 0.4 + 0.6;
        const flickerPhase4 = Math.sin(frame * 0.4 + letterIndex * 3) * 0.2 + 0.8;
        const randomFlicker = (flickerPhase1 * flickerPhase2 * flickerPhase3 * flickerPhase4);
        
        const blackoutChance = Math.sin(frame * 0.3 + letterIndex) < -0.7 ? 0 : 1;
        const strongBlackout = Math.sin(frame * 0.15 + letterIndex * 2) < -0.85 ? 0 : 1;
        const blackoutMultiplier = blackoutChance * strongBlackout;
        
        if (frame < stabilizeFrame) {
          return randomFlicker * blackoutMultiplier;
        } else {
          return interpolate(
            frame,
            [stabilizeFrame, stabilizeFrame + 30],
            [randomFlicker * blackoutMultiplier, 1],
            { easing: Easing.out(Easing.ease) }
          );
        }
      }
      case "lightning": {
        if (frame < delay) return 0;
        const lightningFlash = Math.sin(frame * 3 + letterIndex * 5) > 0.8 ? 1 : 0.7;
        const lightningBurst = Math.random() > 0.95 ? 1.5 : 1;
        return Math.min(1, lightningFlash * lightningBurst);
      }
      case "morph": {
        const morphCycle = (frame + letterIndex * 10) % 180;
        return interpolate(morphCycle, [0, 45, 90, 135, 180], [0, 1, 0.8, 1, 0], {
          easing: Easing.inOut(Easing.ease)
        });
      }
      case "audioReactive": {
        if (frame < delay) return 0;
        
        const baseOpacity = 0.8 + audioLevel * 0.2;
        const beatBoost = beatTrigger > 1 ? 0.1 : 0;
        return Math.min(1, baseOpacity + beatBoost);
      }
      case "matrix": {
        const matrixDelay = delay + Math.random() * 60;
        const matrixOpacity = frame >= matrixDelay ? 1 : 0;
        return matrixOpacity * (0.6 + Math.sin(frame * 0.1 + letterIndex) * 0.4);
      }
      case "wave": {
        const waveDelay = delay + Math.sin(letterIndex * 0.5) * 10;
        return interpolate(frame, [waveDelay, waveDelay + 25], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.elastic(1)
        });
      }
      default:
        return 1;
    }
  };

  const getTransform = (partIndex: number, letterIndex: number) => {
    const delay = getLetterDelay(partIndex, letterIndex);
    const opacity = getOpacity(partIndex, letterIndex);
    
    switch(animationType) {
      case "slide": {
        const slideY = interpolate(frame, [delay, delay + 20], [50, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(2))
        });
        return `translateY(${slideY}px)`;
      }
      case "glitch": {
        if (frame < delay) return 'none';
        
        const flickerDuration = 120;
        const stabilizeFrame = delay + flickerDuration;
        
        if (frame < stabilizeFrame) {
          const glitchX = (Math.random() - 0.5) * 6;
          const glitchY = (Math.random() - 0.5) * 3;
          const scale = 0.98 + Math.random() * 0.04;
          const rotate = (Math.random() - 0.5) * 2;
          return `translate(${glitchX}px, ${glitchY}px) scale(${scale}) rotate(${rotate}deg)`;
        } else {
          const breathe = 0.98 + opacity * 0.02 + Math.sin(frame * 0.05) * 0.005;
          return `scale(${breathe})`;
        }
      }
      case "lightning": {
        const lightningShake = Math.sin(frame * 20 + letterIndex) * 2;
        const lightningScale = 1 + Math.sin(frame * 0.5 + letterIndex) * 0.1;
        return `translate(${lightningShake}px, 0) scale(${lightningScale})`;
      }
      case "morph": {
        const morphX = Math.sin(frame * 0.1 + letterIndex) * 10;
        const morphY = Math.cos(frame * 0.15 + letterIndex) * 5;
        const morphScale = 0.9 + Math.sin(frame * 0.08 + letterIndex) * 0.2;
        return `translate(${morphX}px, ${morphY}px) scale(${morphScale})`;
      }
      case "audioReactive": {
        const audioScale = 0.8 + audioLevel * 0.4;
        const audioShake = (audioLevel - 0.5) * 3;
        return `scale(${audioScale}) translateY(${audioShake}px)`;
      }
      case "matrix": {
        const matrixFall = Math.sin(frame * 0.02 + letterIndex) * 3;
        return `translateY(${matrixFall}px)`;
      }
      case "wave": {
        const waveOffset = Math.sin((frame - delay) * 0.1 + letterIndex * 0.5) * 2;
        return `translateY(${waveOffset}px)`;
      }
      default:
        return 'none';
    }
  };

  // Enhanced style generators
  const getTextShadow = (opacity: number, letterIndex: number) => {
    const intensity = opacity * 20;
    const innerGlow = opacity * 10;
    
    switch(style) {
      case "neon":
        return `
          0 0 ${innerGlow}px ${colors.primary},
          0 0 ${intensity}px ${colors.primary},
          0 0 ${intensity * 1.5}px ${colors.primary},
          0 0 ${intensity * 2}px ${colors.secondary}
        `;
      case "cyber":
        return `
          0 0 ${innerGlow}px ${colors.primary},
          0 2px ${intensity}px ${colors.primary},
          0 0 ${intensity * 2}px ${colors.accent},
          2px 2px 0px ${colors.secondary}
        `;
      case "holographic": {
        const holoPulse = Math.sin(frame * 0.1 + letterIndex) * 0.5 + 0.5;
        return `
          0 0 ${innerGlow * holoPulse}px ${colors.primary},
          0 0 ${intensity * holoPulse}px ${colors.secondary},
          0 0 ${intensity * 2 * holoPulse}px ${colors.accent},
          ${holoPulse * 3}px ${holoPulse * 3}px ${intensity}px rgba(255,255,255,0.3)
        `;
      }
      case "liquid":
        return `
          0 0 ${innerGlow}px ${colors.primary},
          0 ${intensity * 0.3}px ${intensity * 0.8}px ${colors.primary},
          0 0 ${intensity * 2}px ${colors.secondary}40
        `;
      case "electric": {
        const electricFlash = Math.random() > 0.97 ? intensity * 2 : intensity;
        return `
          0 0 ${innerGlow}px ${colors.primary},
          0 0 ${electricFlash}px ${colors.primary},
          0 0 ${electricFlash * 1.5}px ${colors.accent},
          ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px ${electricFlash}px ${colors.secondary}
        `;
      }
      case "matrix":
        return `
          0 0 ${innerGlow}px #00ff00,
          0 2px ${intensity}px #00ff00,
          0 0 ${intensity * 2}px #008800
        `;
      case "gradient":
        return `
          0 2px 4px rgba(0,0,0,0.3),
          0 0 ${intensity}px ${colors.primary}
        `;
      case "glass":
        return `
          0 8px 32px rgba(255,255,255,0.1),
          0 2px 8px rgba(255,255,255,0.2),
          inset 0 1px 0px rgba(255,255,255,0.2)
        `;
      default:
        return `0 0 ${intensity}px ${colors.primary}`;
    }
  };

  const getTextStyle = (opacity: number, partIndex: number, letterIndex: number) => {
    const delay = getLetterDelay(partIndex, letterIndex);
    const flickerDuration = 120;
    const stabilizeFrame = delay + flickerDuration;
    
    let filter = '';
    // let background = '';
    let color = colors.primary;
    
    // Style-specific filters and effects
    if (animationType === 'glitch' && frame >= delay) {
      if (frame < stabilizeFrame) {
        const blurAmount = opacity < 0.3 ? '2px' : opacity < 0.6 ? '1px' : '0px';
        const brightness = 0.8 + opacity * 0.4 + Math.sin(frame * 0.1 + letterIndex) * 0.1;
        const contrast = 0.9 + opacity * 0.2;
        filter = `blur(${blurAmount}) brightness(${brightness}) contrast(${contrast})`;
      } else {
        const brightness = 0.95 + Math.sin(frame * 0.02) * 0.05;
        filter = `brightness(${brightness})`;
      }
    }

    // Holographic chromatic aberration
    if (style === 'holographic') {
      const aberration = Math.sin(frame * 0.05 + letterIndex) * 2;
      filter += ` drop-shadow(${aberration}px 0 ${colors.primary}) drop-shadow(-${aberration}px 0 ${colors.accent})`;
    }

    // Audio reactive effects - subtle and readable
    if (animationType === 'audioReactive') {
      const audioHue = (frame * 1 + letterIndex * 10) % 360;
      const audioSat = 0.7 + audioLevel * 0.3;
      const audioBright = 0.9 + audioLevel * 0.2;
      const audioContrast = 1 + audioLevel * 0.2;
      filter += ` hue-rotate(${audioHue}deg) saturate(${audioSat}) brightness(${audioBright}) contrast(${audioContrast})`;
      
      if (beatTrigger > 1) {
        filter += ` drop-shadow(0 0 ${beatTrigger * 5}px ${colors.primary}40)`;
      }
    }

    // Matrix style
    if (style === 'matrix') {
      color = '#00ff00';
      filter += ` drop-shadow(0 0 10px #00ff00)`;
    }
    
    const baseStyle = {
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: getLetterSpacing(),
      opacity,
      textShadow: getTextShadow(opacity, letterIndex),
      filter: filter || 'none',
      transition: frame > stabilizeFrame && animationType === 'glitch' ? 'all 0.1s ease' : 'none',
    };

    switch(style) {
      case "gradient":
        return {
          ...baseStyle,
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        };
      case "holographic": {
        const holoHue = (frame * 2 + letterIndex * 20) % 360;
        return {
          ...baseStyle,
          background: `linear-gradient(45deg, 
            hsl(${holoHue}, 80%, 60%), 
            hsl(${holoHue + 60}, 80%, 60%), 
            hsl(${holoHue + 120}, 80%, 60%))`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        };
      }
      case "liquid": {
        const liquidAngle = (frame * 2 + letterIndex * 20) % 360;
        const liquidFlow = Math.sin(frame * 0.03 + letterIndex * 0.15) * 0.3 + 0.7;
        const liquidDistort = Math.cos(frame * 0.05 + letterIndex * 0.1) * 10;
        return {
          ...baseStyle,
          background: `
            linear-gradient(${liquidAngle}deg, 
              ${colors.primary} 0%, 
              ${colors.secondary} ${40 + liquidFlow * 20}%, 
              ${colors.accent} ${60 + liquidFlow * 20}%, 
              ${colors.primary} 100%),
            linear-gradient(90deg,
              ${colors.primary}E0 0%,
              ${colors.secondary}F0 50%,
              ${colors.primary}E0 100%)
          `,
          backgroundSize: `150% 150%, 100% 100%`,
          backgroundPosition: `${liquidDistort}% center, center center`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          filter: `blur(${Math.abs(Math.sin(frame * 0.08 + letterIndex)) * 0.3}px)`,
          textShadow: `
            0 0 10px ${colors.primary}60,
            0 0 20px ${colors.secondary}40,
            0 2px 4px ${colors.primary}80
          `,
        };
      }
      case "glass":
        return {
          ...baseStyle,
          color: 'rgba(255,255,255,0.9)',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '4px 8px',
        };
      default:
        return {
          ...baseStyle,
          color,
        };
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: style === 'matrix' ? '"Courier New", monospace' : '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      {(() => {
        const gradientX1 = 50 + Math.sin(frame * 0.01) * 20;
        const gradientY1 = 50 + Math.cos(frame * 0.015) * 20;
        const gradientX2 = 30 + Math.cos(frame * 0.012) * 30;
        const gradientY2 = 70 + Math.sin(frame * 0.018) * 20;
        
        return (
          <>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: advancedEffects ? `
                radial-gradient(circle at ${gradientX1}% ${gradientY1}%, 
                ${colors.primary}20 0%, transparent 70%),
                radial-gradient(circle at ${gradientX2}% ${gradientY2}%, 
                ${colors.secondary}15 0%, transparent 60%),
                conic-gradient(from ${frame}deg at 50% 50%, 
                ${colors.accent}10, transparent 20%, ${colors.primary}05, transparent 40%)
              ` : `
                radial-gradient(circle at ${gradientX1}% ${gradientY1}%, 
                ${colors.primary}20 0%, transparent 70%)
              `,
              opacity: 0.3,
            }} />
            
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `repeating-linear-gradient(
                0deg, 
                transparent 0px, 
                transparent 2px, 
                ${colors.primary}08 2px, 
                ${colors.primary}08 4px
              )`,
              pointerEvents: 'none',
            }} />
            
            {advancedEffects && [...Array(8)].map((_, i) => {
              const rotationAngle = frame * (0.5 + i * 0.1) + i * 45;
              const scaleValue = 0.5 + Math.sin(frame * 0.02 + i) * 0.3;
              const shapeType = i % 4;
              
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${15 + (i % 3) * 25}%`,
                    top: `${20 + Math.floor(i / 3) * 20}%`,
                    width: `${20 + i * 5}px`,
                    height: `${20 + i * 5}px`,
                    border: `2px solid ${i % 2 === 0 ? colors.secondary : colors.accent}30`,
                    borderRadius: shapeType === 0 ? '50%' : shapeType === 1 ? '0%' : shapeType === 2 ? '20%' : '10px',
                    transform: `rotate(${rotationAngle}deg) scale(${scaleValue})`,
                    opacity: 0.15 + Math.sin(frame * 0.03 + i) * 0.1,
                    background: i % 3 === 0 ? `${colors.primary}10` : 'transparent',
                  }}
                />
              );
            })}
          </>
        );
      })()}

      {effects && (
        <>
          {[...Array(25)].map((_, i) => {
            const particleX = interpolate(
              frame + i * 15,
              [0, 800],
              [Math.random() * width, Math.random() * width],
              { extrapolateRight: 'wrap' }
            );
            const particleY = interpolate(
              frame + i * 20,
              [0, 600],
              [Math.random() * height, Math.random() * height],
              { extrapolateRight: 'wrap' }
            );
            const particleSize = 1 + Math.sin(i) * 2;
            const particleOpacity = 0.3 + Math.sin(frame * 0.02 + i) * 0.2;
            
            return (
              <div
                key={`particle-${i}`}
                style={{
                  position: 'absolute',
                  left: particleX,
                  top: particleY,
                  width: `${particleSize}px`,
                  height: `${particleSize}px`,
                  background: colors.accent,
                  borderRadius: '50%',
                  opacity: particleOpacity,
                  filter: 'blur(0.5px)',
                  boxShadow: `0 0 8px ${colors.accent}`,
                }}
              />
            );
          })}

          {advancedEffects && animationType === 'lightning' && [...Array(5)].map((_, i) => {
            const lightningX = Math.random() * width;
            const lightningY = Math.random() * height;
            const lightningIntensity = Math.random() > 0.9 ? 1 : 0;
            
            return (
              <div
                key={`lightning-${i}`}
                style={{
                  position: 'absolute',
                  left: lightningX,
                  top: lightningY,
                  width: '2px',
                  height: `${10 + Math.random() * 20}px`,
                  background: colors.primary,
                  opacity: lightningIntensity,
                  filter: 'blur(1px)',
                  boxShadow: `0 0 20px ${colors.primary}`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            );
          })}

          {(style === 'liquid' || animationType === 'morph') && advancedEffects && [...Array(8)].map((_, i) => {
            const dropletX = interpolate(
              frame + i * 25,
              [0, 400],
              [Math.random() * width, Math.random() * width],
              { extrapolateRight: 'wrap' }
            );
            const dropletY = interpolate(
              frame + i * 30,
              [0, 300],
              [0, height + 50],
              { extrapolateRight: 'wrap' }
            );
            const dropletSize = 3 + Math.sin(i + frame * 0.02) * 2;
            const dropletOpacity = 0.2 + Math.sin(frame * 0.03 + i) * 0.2;
            
            return (
              <div
                key={`droplet-${i}`}
                style={{
                  position: 'absolute',
                  left: dropletX,
                  top: dropletY,
                  width: `${dropletSize}px`,
                  height: `${dropletSize * 1.2}px`,
                  background: `radial-gradient(ellipse, ${colors.primary}80 0%, ${colors.secondary}40 70%, transparent 100%)`,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  opacity: dropletOpacity,
                  filter: 'blur(0.5px)',
                  transform: `rotate(${Math.sin(frame * 0.01 + i) * 10}deg)`,
                }}
              />
            );
          })}

          {animationType === 'audioReactive' && audioReactive && [...Array(15)].map((_, i) => {
            const audioParticleScale = 0.5 + audioLevel * 1.5 + (beatTrigger - 1) * 0.8;
            const audioParticleX = interpolate(
              frame + i * 20,
              [0, 500],
              [Math.random() * width, Math.random() * width],
              { extrapolateRight: 'wrap' }
            );
            const audioParticleY = interpolate(
              frame + i * 25,
              [0, 400],
              [Math.random() * height, Math.random() * height],
              { extrapolateRight: 'wrap' }
            );
            
            return (
              <div
                key={`audio-particle-${i}`}
                style={{
                  position: 'absolute',
                  left: audioParticleX,
                  top: audioParticleY,
                  width: `${audioParticleScale * 4}px`,
                  height: `${audioParticleScale * 4}px`,
                  background: beatTrigger > 1 ? colors.primary : colors.accent,
                  borderRadius: '50%',
                  opacity: 0.3 + audioLevel * 0.5,
                  filter: `blur(${audioParticleScale * 0.5}px)`,
                  boxShadow: `0 0 ${audioParticleScale * 8}px ${beatTrigger > 1 ? colors.primary : colors.accent}`,
                  transform: `scale(${audioParticleScale})`,
                }}
              />
            );
          })}
        </>
      )}

      {(style === 'matrix' || animationType === 'matrix') && advancedEffects && (
        <>
          {[...Array(20)].map((_, i) => {
            const matrixX = (i * width / 20) + Math.sin(frame * 0.01 + i) * 20;
            const matrixY = (frame * 2 + i * 30) % (height + 100);
            const matrixChar = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
            
            return (
              <div
                key={`matrix-${i}`}
                style={{
                  position: 'absolute',
                  left: matrixX,
                  top: matrixY,
                  color: '#00ff0060',
                  fontSize: '14px',
                  fontFamily: '"Courier New", monospace',
                  textShadow: '0 0 10px #00ff00',
                  zIndex: 1,
                }}
              >
                {matrixChar}
              </div>
            );
          })}
        </>
      )}

      {environmentalEffects && advancedEffects && (
        <>
          {[...Array(15)].map((_, i) => {
            const rainX = (frame * 3 + i * 50) % (width + 50);
            const rainY = (frame * 8 + i * 80) % (height + 100);
            
            return (
              <div
                key={`rain-${i}`}
                style={{
                  position: 'absolute',
                  left: rainX,
                  top: rainY,
                  width: '1px',
                  height: '20px',
                  background: `linear-gradient(transparent, ${colors.primary}30, transparent)`,
                  opacity: 0.4,
                  transform: 'rotate(10deg)',
                }}
              />
            );
          })}

          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(ellipse at ${30 + Math.sin(frame * 0.01) * 40}% ${70 + Math.cos(frame * 0.008) * 30}%, 
              rgba(255,255,255,0.05) 0%, transparent 60%)`,
            opacity: 0.6,
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }} />
        </>
      )}

      {animationType === 'glitch' && (
        <>
          {[...Array(3)].map((_, i) => {
            const barHeight = 2 + Math.random() * 4;
            const barY = Math.random() * height;
            const barOpacity = Math.sin(frame * 0.3 + i * 2) * 0.3 + 0.4;
            const barColor = i === 0 ? colors.primary : i === 1 ? colors.secondary : colors.accent;
            
            return (
              <div
                key={`glitch-bar-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: barY,
                  width: '100%',
                  height: `${barHeight}px`,
                  background: barColor,
                  opacity: barOpacity * 0.3,
                  mixBlendMode: 'screen',
                  transform: `translateX(${Math.sin(frame * 0.1 + i) * 5}px)`,
                }}
              />
            );
          })}
          
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='glitchNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23glitchNoise)'/%3E%3C/svg%3E")`,
            opacity: 0.08 + Math.sin(frame * 0.2) * 0.04,
            mixBlendMode: 'overlay',
          }} />
          
          <div style={{
            position: 'absolute',
            top: `${(frame * 3) % height}px`,
            left: 0,
            width: '100%',
            height: '8px',
            background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
            filter: 'blur(2px)',
            opacity: Math.sin(frame * 0.1) * 0.5 + 0.5,
          }} />
        </>
      )}

      {(animationType === 'lightning' || style === 'electric') && advancedEffects && (
        <>
          {[...Array(3)].map((_, i) => {
            const shouldShow = Math.random() > 0.9;
            if (!shouldShow) return null;
            
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            const endX = startX + (Math.random() - 0.5) * 200;
            const endY = startY + (Math.random() - 0.5) * 200;
            
            return (
              <svg
                key={`lightning-${i}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              >
                <path
                  d={`M ${startX} ${startY} Q ${startX + (endX - startX) / 2 + Math.random() * 50 - 25} ${startY + (endY - startY) / 2 + Math.random() * 50 - 25} ${endX} ${endY}`}
                  stroke={colors.primary}
                  strokeWidth="2"
                  fill="none"
                  filter={`drop-shadow(0 0 10px ${colors.primary})`}
                  opacity="0.8"
                />
              </svg>
            );
          })}
        </>
      )}
      
      {/* Text content */}
      <div style={{
        display: 'flex',
        flexDirection: splitBy === "line" ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isPortrait ? (splitBy === "word" ? '10px' : splitBy === "line" ? '10px' : '0px') : (splitBy === "word" ? '20px' : splitBy === "line" ? '15px' : '0px'),
        flexWrap: 'wrap',
        zIndex: 10,
        maxWidth: '90%', // Ensures content doesn't hit the side edges
        padding: '0 5%', // Ensures text has space from the edges
        boxSizing: 'border-box',
      }}>
        {textParts.map((part, partIndex) => (
          <div
            key={partIndex}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: splitBy === "letter" ? (isPortrait ? '1px' : getLetterSpacing()) : '2px',
            }}
          >
            {part.map((letter, letterIndex) => {
              const opacity = getOpacity(partIndex, letterIndex);
              const transform = getTransform(partIndex, letterIndex);
              
              return (
                <span
                  key={`${partIndex}-${letterIndex}`}
                  style={{
                    ...getTextStyle(opacity, partIndex, letterIndex),
                    transform,
                    display: 'inline-block',
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '70%',
        background: advancedEffects ? 
          `radial-gradient(ellipse, ${colors.primary}25 0%, ${colors.secondary}15 30%, ${colors.accent}08 60%, transparent 100%)` :
          `radial-gradient(ellipse, ${colors.primary}20 0%, ${colors.secondary}10 50%, transparent 100%)`,
        filter: 'blur(60px)',
        opacity: interpolate(
          frame, 
          [60, 120], 
          [0, 0.8], 
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        ),
        pointerEvents: 'none',
      }} />

      {advancedEffects && (
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '80%',
          width: '100px',
          height: '100px',
          background: `radial-gradient(circle, ${colors.accent}30 0%, transparent 70%)`,
          filter: 'blur(10px)',
          opacity: 0.4 + Math.sin(frame * 0.02) * 0.2,
          transform: `scale(${0.8 + Math.sin(frame * 0.03) * 0.3})`,
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
};

// Enhanced example configurations
export const ElectricLightning = () => (
  <DynamicTextTemplate
    text="THUNDER STRIKE"
    style="electric"
    colorScheme="electric"
    animationType="lightning"
    fontSize={120}
    spacing="wide"
    advancedEffects={true}
  />
);

export const HolographicMorph = () => (
  <DynamicTextTemplate
    text="FUTURE TECH"
    style="holographic"
    colorScheme="cosmic"
    animationType="morph"
    fontSize={110}
    spacing="normal"
    splitBy="letter"
    advancedEffects={true}
  />
);

export const MatrixRain = () => (
  <DynamicTextTemplate
    text="ENTER THE MATRIX"
    style="matrix"
    colorScheme="electric"
    animationType="matrix"
    fontSize={100}
    spacing="normal"
    splitBy="word"
    advancedEffects={true}
  />
);



export const AudioReactiveDemo = () => (
  <DynamicTextTemplate
    text="BEAT DROP"
    style="neon"
    colorScheme="rainbow"
    animationType="audioReactive"
    fontSize={140}
    spacing="normal"
    splitBy="letter"
    audioReactive={true}
    advancedEffects={true}
    effects={true}
  />
);

export const LiquidFlow = () => (
  <DynamicTextTemplate
    text="LIQUID FLOW"
    style="liquid"
    colorScheme="ocean"
    animationType="morph"
    fontSize={115}
    spacing="wide"
    splitBy="letter"
    advancedEffects={true}
    environmentalEffects={true}
  />
);

export default DynamicTextTemplate;