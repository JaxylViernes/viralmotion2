import { Box, Button, Card, CardContent, Typography } from "@mui/material";

export const ModalTemplateCard: React.FC<{
  label: string;
  description: string;
  onSelect: (template: string, description: string) => void;
  url: string;
}> = ({ label, description, onSelect, url }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        },
        bgcolor: "background.paper",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Smaller Video Preview */}
      <Box sx={{ position: "relative", height: 120 }}>

        <img
          alt={`${label} preview`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={`${url}`} 
        />
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{ lineHeight: 1.3 }}
        >
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "32px",
          }}
        >
          {description}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => onSelect(label, description)}
          sx={{
            mt: 1,
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          Select
        </Button>
      </CardContent>
    </Card>
  );
};