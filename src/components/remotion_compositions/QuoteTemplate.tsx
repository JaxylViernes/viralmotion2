import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/CormorantGaramond";

const { fontFamily: defaultFontFamily } = loadFont();

// Track data interface
export interface TrackData {
  id: string;
  startFrame: number;
  endFrame: number;
  visible: boolean;
}

export interface CompositionTracks {
  background?: TrackData;
  image?: TrackData;
  quote?: TrackData;
  author?: TrackData;
}

// Position interface for elements
export interface ElementPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation?: number; // degrees
  scale?: number; // 1 = 100%
}

export interface ElementPositions {
  quote: ElementPosition;
  author: ElementPosition;
  quoteMark: ElementPosition;
}

export const defaultPositions: ElementPositions = {
  quoteMark: { x: 10, y: 12, rotation: 0, scale: 1 },
  quote: { x: 50, y: 40, rotation: 0, scale: 1 },
  author: { x: 50, y: 80, rotation: 0, scale: 1 },
};

export const QuoteComposition: React.FC<{
  quote: string;
  author: string;
  backgroundImage: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  tracks?: CompositionTracks;
  positions?: ElementPositions;
}> = ({
  quote,
  author,
  backgroundImage,
  fontFamily = defaultFontFamily,
  fontSize = 1,
  fontColor = "white",
  tracks,
  positions = defaultPositions,
}) => {
  const frame = useCurrentFrame();
  const { fps, height, durationInFrames } = useVideoConfig();

  // Default tracks if not provided
  const defaultTracks: CompositionTracks = {
    background: { id: "bg", startFrame: 0, endFrame: durationInFrames, visible: true },
    image: { id: "img", startFrame: 0, endFrame: durationInFrames, visible: true },
    quote: { id: "quote", startFrame: Math.round(durationInFrames * 0.1), endFrame: durationInFrames, visible: true },
    author: { id: "author", startFrame: Math.round(durationInFrames * 0.6), endFrame: durationInFrames, visible: true },
  };

  const t = tracks || defaultTracks;
  const pos = positions;

  // Helper to check if element should render
  const shouldShow = (track: TrackData | undefined): boolean => {
    if (!track) return false;
    if (!track.visible) return false;
    return frame >= track.startFrame && frame <= track.endFrame;
  };

  // Get relative frame for animations
  const getRelativeFrame = (track: TrackData | undefined): number => {
    if (!track) return 0;
    return Math.max(0, frame - track.startFrame);
  };

  // Check visibility
  const showImage = shouldShow(t.image);
  const showQuote = shouldShow(t.quote);
  const showAuthor = shouldShow(t.author);

  // Relative frames for animations
  const imageRelativeFrame = getRelativeFrame(t.image);
  const quoteRelativeFrame = getRelativeFrame(t.quote);
  const authorRelativeFrame = getRelativeFrame(t.author);

  // Animation parameters
  const quoteMarkScale = spring({
    frame: quoteRelativeFrame * 0.7,
    fps,
    config: { damping: 15, stiffness: 120 },
    durationInFrames: 45,
  });

  const quoteMarkOpacity = interpolate(quoteRelativeFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const bgOpacity = interpolate(imageRelativeFrame, [0, 60], [0, 0.7], {
    extrapolateRight: "clamp",
  });

  const textPush = spring({
    frame: quoteRelativeFrame,
    fps,
    config: { damping: 15, stiffness: 50 },
    durationInFrames: 90,
  });

  const wordAppear = (index: number) => {
    return interpolate(quoteRelativeFrame - index * 5, [0, 30], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
  };

  const authorAppear = spring({
    frame: authorRelativeFrame,
    fps,
    config: { damping: 15, stiffness: 80 },
    durationInFrames: 45,
  });

  const words = quote.split(" ");

  // Scale fonts relative to height
  const baseFontSize = height * 0.05 * fontSize;
  const quoteMarkFontSize = height * 0.1 * fontSize;
  const authorFontSize = baseFontSize * 0.75;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background Image */}
      {showImage && (
        <AbsoluteFill style={{ opacity: bgOpacity }}>
          <Img
            src={backgroundImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.6)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Quotation mark */}
      {showQuote && (
        <div
          style={{
            position: "absolute",
            fontSize: quoteMarkFontSize,
            fontFamily,
            color: fontColor,
            fontStyle: "italic",
            opacity: quoteMarkOpacity,
            transform: `scale(${quoteMarkScale * (pos.quoteMark.scale || 1)}) rotate(${pos.quoteMark.rotation || 0}deg)`,
            top: `${pos.quoteMark.y}%`,
            left: `${pos.quoteMark.x}%`,
            lineHeight: 0.8,
            zIndex: 1,
            transformOrigin: "center center",
          }}
        >
          "
        </div>
      )}

      {/* Main quote text */}
      {showQuote && (
        <div
          style={{
            position: "absolute",
            fontFamily,
            color: fontColor,
            fontSize: baseFontSize * (pos.quote.scale || 1),
            fontWeight: 400,
            lineHeight: 1.6,
            textAlign: "center",
            zIndex: 2,
            width: "80%",
            left: `${pos.quote.x - 40}%`,
            top: `${pos.quote.y}%`,
            transform: `translateY(${interpolate(textPush, [0, 1], [50, 0])}px) rotate(${pos.quote.rotation || 0}deg)`,
            transformOrigin: "center center",
          }}
        >
          {words.map((word, i) => {
            const opacity = wordAppear(i);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginLeft: 12,
                  opacity,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}

      {/* Author */}
      {showAuthor && (
        <div
          style={{
            position: "absolute",
            fontFamily,
            color: fontColor,
            fontSize: authorFontSize * (pos.author.scale || 1),
            fontWeight: 600,
            top: `${pos.author.y}%`,
            left: `${pos.author.x - 40}%`,
            width: "80%",
            opacity: authorAppear,
            transform: `translateY(${interpolate(authorAppear, [0, 1], [40, 0])}px) rotate(${pos.author.rotation || 0}deg)`,
            transformOrigin: "center center",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          — {author}
        </div>
      )}
    </AbsoluteFill>
  );
};

export default QuoteComposition;