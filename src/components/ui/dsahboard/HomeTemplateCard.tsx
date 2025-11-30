import { Box, Card, Typography } from "@mui/material";

export const HomeTemplateCard: React.FC<{
  label: string;
  description: string;
  onTry: (template: string, description: string) => void;
  hoverOverlay?: boolean;
  size?: string;
}> = ({ label, description, hoverOverlay = false, size = "small" }) => {

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 10px 30px rgba(12, 18, 30, 0.12)",
        },
      }}
    >
      {/* Video Preview */}
      <Box
        sx={{
          position: "relative",
          height: size === "large" ? 240 : 160,
        }}
      >
        <img
          alt={`${label} preview`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={`/template_previews/${(label ?? "").replace(/\s+/g, "")}.mp4`}
        />

        {/* Hover Overlay with Text */}
        {hoverOverlay && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.55)",
              opacity: 0,
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              px: 2,
              textAlign: "center",
              transition: "opacity 0.2s",
              "&:hover": { opacity: 1 },
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {label}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, maxHeight: 60, overflow: "hidden" }}
            >
              {description}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};
