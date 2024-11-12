
import React, { useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { useAudio } from './useAudio';
import { addRecording } from './database';

const RecordingScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const { startRecording, stopRecording } = useAudio();

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = async () => {
    const uri = await stopRecording();
    if (uri && title) {
      const date = new Date().toISOString();
      addRecording(title, uri, date);
      setTitle('');
      navigation.navigate('VoiceNotesList');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Start Recording" onPress={handleStartRecording} />
      <Button title="Stop Recording" onPress={handleStopRecording} />
    </View>
  );
};

export default RecordingScreen;
