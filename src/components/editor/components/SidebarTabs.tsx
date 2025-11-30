import React from "react";
import { editorStyles } from "../styles/editorStyles";
import { EditorIcons } from "./EditorIcons";
import { type SidebarTab } from "../types";

// Custom Layout Icon (if not in EditorIcons)
const LayoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

interface SidebarTabsProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onPanelToggle: (open: boolean) => void;
  showLayoutTab?: boolean; // 👈 New prop to control visibility
}

export const SidebarTabs: React.FC<SidebarTabsProps> = ({
  activeTab,
  onTabChange,
  onPanelToggle,
  showLayoutTab = false,
}) => {
  const handleTabClick = (tab: SidebarTab) => {
    if (activeTab === tab) {
      onTabChange(null);
      onPanelToggle(false); // Close panel if clicking active tab
    } else {
      onTabChange(tab);
      onPanelToggle(true);  // Open panel
    }
  };

  const renderButton = (tab: SidebarTab, label: string, Icon: React.FC<any>) => (
    <button
      style={{
        ...editorStyles.sidebarButton,
        ...(activeTab === tab ? editorStyles.sidebarButtonActive : {}),
      }}
      onClick={() => handleTabClick(tab)}
      onMouseOver={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "#888";
        }
      }}
      onMouseOut={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#666";
        }
      }}
      title={label}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );

  return (
    <div style={editorStyles.leftSidebar}>
      {renderButton("text", "Text", EditorIcons.Type)}
      {renderButton("media", "Media", EditorIcons.Image)}
      {renderButton("audio", "Audio", EditorIcons.Volume || EditorIcons.Music)}
      {renderButton("video", "Video", EditorIcons.Video)}
      {renderButton("tools", "Tools", EditorIcons.Tools)}

      {/* Conditionally render Layout Tab */}
      {showLayoutTab && renderButton("layout", "Layout", LayoutIcon)}
    </div>
  );
};