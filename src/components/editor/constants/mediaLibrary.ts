// ============================================================================
// MEDIA LIBRARY CONSTANTS
// ============================================================================

export const CLOUDINARY_VIDEOS = {
  backgroundVideos: [
    {
      id: "bg_video_1",
      name: "City Sunset",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/dog.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
      duration: "3m 0s",
    },
    {
      id: "bg_video_2",
      name: "Ocean Waves",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/sea_turtle.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
      duration: "1m 0s",
    },
    {
      id: "bg_video_3",
      name: "Forest Path",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/docs/folder_preview.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/docs/walking_talking.mp4",
      duration: "8m 0s",
    },
    {
      id: "bg_video_4",
      name: "Mountain View",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/cld-sample-video.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/cld-sample-video.mp4",
      duration: "2m 30s",
    },
  ],
  visualEffects: [
    {
      id: "vfx_video_1",
      name: "Glitch Effect",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/dog.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
      duration: "15s",
    },
    {
      id: "vfx_video_2",
      name: "Text Overlay",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/sea_turtle.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
      duration: "30s",
    },
    {
      id: "vfx_video_3",
      name: "Transition",
      thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/cld-sample-video.jpg",
      url: "https://res.cloudinary.com/demo/video/upload/cld-sample-video.mp4",
      duration: "10s",
    },
  ],
};

export const PROJECT_UPLOADS = [
  {
    id: "upload_1",
    name: "script-voiceover",
    type: "audio" as const,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "2m 18s",
  },
  {
    id: "upload_2",
    name: "intro-voiceover",
    type: "audio" as const,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "6s",
  },
  {
    id: "upload_3",
    name: "City Scene",
    type: "video" as const,
    thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/dog.jpg",
    url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    duration: "3:58",
  },
];

export const CLOUD_UPLOADS = [
  {
    id: "cloud_1",
    name: "script-voiceover",
    type: "audio" as const,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "2m 17s",
  },
  {
    id: "cloud_2",
    name: "intro-voiceover",
    type: "audio" as const,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "6s",
  },
  {
    id: "cloud_3",
    name: "script-voiceover",
    type: "audio" as const,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: "2m 18s",
  },
  {
    id: "cloud_4",
    name: "Sunset Video",
    type: "video" as const,
    thumbnail: "https://res.cloudinary.com/demo/video/upload/so_0/sea_turtle.jpg",
    url: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
    duration: "3:58",
  },
  {
    id: "cloud_5",
    name: "Dance Scene",
    type: "video" as const,
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    url: "https://res.cloudinary.com/demo/video/upload/cld-sample-video.mp4",
    duration: "3:58",
  },
  {
    id: "cloud_6",
    name: "Concert",
    type: "video" as const,
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    duration: "3:58",
  },
  {
    id: "cloud_7",
    name: "Night Club",
    type: "video" as const,
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    url: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
    duration: "3:58",
  },
  {
    id: "cloud_8",
    name: "Abstract Image",
    type: "image" as const,
    thumbnail: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400",
    url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1080",
  },
  {
    id: "cloud_9",
    name: "Landscape",
    type: "image" as const,
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080",
  },
];

export const TEXT_PRESETS = [
  { id: "heading", name: "Add Heading", type: "heading" },
  { id: "paragraph", name: "Add Paragraph", type: "paragraph" },
  { id: "quote", name: "Add Quote", type: "quote" },
];

export const AUDIO_LIBRARY = {
  stockMusic: [
    { id: "audio_1", name: "External Love", duration: "3m 53s", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: "audio_2", name: "Time House Tale", duration: "1m 58s", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: "audio_3", name: "Strangely Wise", duration: "1m 38s", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  ],
  soundEffects: [
    { id: "sfx_1", name: "Why Did You Redeem I...", duration: "8s", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: "sfx_2", name: "Neck Break", duration: "9s", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: "sfx_3", name: "Moonor Cocktail", duration: "3s", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  ],
};