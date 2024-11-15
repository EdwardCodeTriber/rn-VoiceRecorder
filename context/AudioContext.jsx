import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AudioContext = createContext();


// Audio provider
export const AudioProvider = ({ children }) => {
  const [recordings, setRecordings] = useState([]);
  const [settings, setSettings] = useState({
    quality: 'medium',
    playbackSpeed: 1.0,
  });

  // Save recording 
  const saveRecording = async (recording) => {
    try {
      const updatedRecordings = [...recordings, recording];
      setRecordings(updatedRecordings);
      await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
    } catch (error) {
      console.error('Error saving recording:', error);
    }
  };

  // Delete recoreded item
  const deleteRecording = async (id) => {
    try {
      const updatedRecordings = recordings.filter(rec => rec.id !== id);
      setRecordings(updatedRecordings);
      await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
    } catch (error) {
      console.error('Error deleting recording:', error);
    }
  };

  // Settings option
  const updateSettings = async (newSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <AudioContext.Provider value={{
      recordings,
      settings,
      saveRecording,
      deleteRecording,
      updateSettings,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
