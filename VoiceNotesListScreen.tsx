// VoiceNotesListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { getRecordings, deleteRecording } from './database';
import { useAudio } from './useAudio';

const VoiceNotesListScreen = () => {
  const [recordings, setRecordings] = useState([]);
  const { playSound, isPlaying } = useAudio();

  useEffect(() => {
    getRecordings(setRecordings);
  }, []);

  const handleDelete = (id: number) => {
    deleteRecording(id);
    getRecordings(setRecordings); // Refresh list
  };

  return (
    <View>
      <FlatList
        data={recordings}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ margin: 10 }}>
            <Text>{item.title}</Text>
            <Text>{item.date}</Text>
            <Button title="Play" onPress={() => playSound(item.uri)} disabled={isPlaying} />
            <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
          </View>
        )}
      />
    </View>
  );
};

export default VoiceNotesListScreen;
