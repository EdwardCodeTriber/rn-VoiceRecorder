import { Audio } from 'expo-av';
import { useState } from 'react';

export const useAudio = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const recording = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setRecording(recording);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setRecording(null);
    await recording.stopAndUnloadAsync();
    return recording.getURI();
  };

  const playSound = async (uri: string) => {
    if (isPlaying || !uri) return;
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    setIsPlaying(true);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate(status => {
      if (!status.isPlaying) {
        setIsPlaying(false);
        sound.unloadAsync();
      }
    });
  };

  return { startRecording, stopRecording, playSound, isPlaying };
};
