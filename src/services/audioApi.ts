//src/services
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// interface EnhanceAudioRequest {
//   audioBlob: Blob;
//   denoiseLevel: number;
//   enhanceClarity: boolean;
//   removeEcho: boolean;
// }

interface EnhanceAudioResponse {
  success: boolean;
  audioUrl: string;
  transcript?: string;
  confidence?: number;
}

export async function enhanceAudio(
  audioBlob: Blob,
  options: {
    denoiseLevel: number;
    enhanceClarity: boolean;
    removeEcho: boolean;
  }
): Promise<EnhanceAudioResponse> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.mp3');
  formData.append('denoiseLevel', options.denoiseLevel.toString());
  formData.append('enhanceClarity', options.enhanceClarity.toString());
  formData.append('removeEcho', options.removeEcho.toString());

  try {
    const url = `${API_BASE_URL}/api/enhance-speech`;
    console.log('🎙️ Sending request to:', url);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Enhancement successful');

    return data;
  } catch (error: any) {
    console.error('❌ API Error:', error);

    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to backend. Make sure it\'s running on http://localhost:3000');
    }

    throw new Error(error.message || 'Audio enhancement failed');
  }
}