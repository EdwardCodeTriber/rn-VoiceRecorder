// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VoiceNotesListScreen from './VoiceNotesListScreen';
import RecordingScreen from './RecordingScreen';
import { createTable } from './database';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    createTable(); // Initialize database table
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="VoiceNotesList" component={VoiceNotesListScreen} options={{ title: 'Voice Notes' }} />
        <Stack.Screen name="RecordingScreen" component={RecordingScreen} options={{ title: 'New Recording' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
