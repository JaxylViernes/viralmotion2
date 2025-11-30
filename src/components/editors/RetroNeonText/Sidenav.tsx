import type React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PaletteIcon from '@mui/icons-material/Palette';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FlareIcon from '@mui/icons-material/Flare';
import PublicIcon from '@mui/icons-material/Public';

const dynamictextnavs = [
  { key: 'text_split', label: 'Text & Format', icon: <TextFieldsIcon /> },
  { key: 'style_color', label: 'Style & Color', icon: <PaletteIcon /> },
  { key: 'animation', label: 'Animation', icon: <PlayArrowIcon /> },
  { key: 'core_effects', label: 'Core Effects', icon: <FlareIcon /> },
  { key: 'advanced', label: 'Advanced VFX', icon: <PublicIcon /> },
];

interface SidenavProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  setActiveSection: React.Dispatch<
    React.SetStateAction<'text_split' | 'style_color' | 'animation' | 'core_effects' | 'advanced'>
  >;
  isMobile: boolean; 
}

export const DynamicTextSidenav: React.FC<SidenavProps> = ({
  collapsed,
  setCollapsed,
  activeSection,
  setActiveSection,
  isMobile,
}) => {
  const isVisuallyCollapsed = isMobile || collapsed;

  return (
    <div
      style={{
        width: isVisuallyCollapsed ? '60px' : '180px',
        background: '#fff',
        borderRight: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0, 
      }}
    >

      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            padding: '0.75rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </button>
      )}
      
      {/* Spacer on mobile to push icons down */}
      {isMobile && <div style={{height: '1rem'}} />}

      {/* Nav Items */}
      {dynamictextnavs.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => setActiveSection(key as any)}
          style={{
            padding: '1rem',
            textAlign: 'left',
            border: 'none',
            background: activeSection === key ? '#f5f5f5' : 'transparent',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: isVisuallyCollapsed ? '0' : '0.5rem',
            justifyContent: isVisuallyCollapsed ? 'center' : 'flex-start',
          }}
        >
          {icon}
          {!isVisuallyCollapsed && label}
        </button>
      ))}
    </div>
  );
};