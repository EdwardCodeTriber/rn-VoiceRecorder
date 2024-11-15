import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import RecordScreen from "./screens/RecordScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { AudioProvider } from "./context/AudioContext";
import { Audio } from 'expo-av';

const Stack = createStackNavigator();

async function configureAudio() {
  try {
    await Audio.setAudioModeAsync({
      // Changed to true since your app records audio
      allowsRecordingIOS: true, 
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      // Changed to true if you want recording to continue in background
      staysActiveInBackground: true, 
    });
  } catch (error) {
    console.error('Error configuring audio:', error);
  }
}

const App = () => {
  useEffect(() => {
    configureAudio();
  }, []);

  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Voice Notes" }}
          />
          <Stack.Screen
            name="Record"
            component={RecordScreen}
            options={{ title: "Record Note" }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
};

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: '#2196F3', // Primary color
//     elevation: 0, // Remove shadow 
//     shadowOpacity: 0, // Remove shadow 
//   },
//   headerTitle: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   headerButton: {
//     marginRight: 15,
//   },
//   cardStyle: {
//     backgroundColor: '#F5F5F5', // Light background for screens
//   },
// });

export default App;