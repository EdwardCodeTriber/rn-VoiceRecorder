import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { useAudio } from '../context/AudioContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RecordScreen = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [title, setTitle] = useState('');
  const { saveRecording } = useAudio();

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your recording');
      return;
    }

    try {
      // Request permissions
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);

      // Update recording time
      const interval = setInterval(() => {
        setRecordTime(prev => {
          const [minutes, seconds] = prev.split(':').map(Number);
          const newSeconds = seconds + 1;
          if (newSeconds === 60) {
            return `${String(minutes + 1).padStart(2, '0')}:00`;
          }
          return `${String(minutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
        });
      }, 1000);

      recording.setOnRecordingStatusUpdate(status => {
        if (!status.isRecording) {
          clearInterval(interval);
        }
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      const newRecording = {
        id: Date.now().toString(),
        title: title,
        uri: uri,
        date: new Date().toISOString(),
        duration: recordTime,
      };

      await saveRecording(newRecording);
      navigation.goBack();
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter recording title"
        value={title}
        onChangeText={setTitle}
        editable={!isRecording}
      />
      <Text style={styles.timer}>{recordTime}</Text>
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recording]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Icon
          name={isRecording ? 'stop' : 'mic'}
          size={32}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  timer: {
    fontSize: 48,
    marginBottom: 30,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recording: {
    backgroundColor: '#f44336',
  },
});

export default RecordScreen;