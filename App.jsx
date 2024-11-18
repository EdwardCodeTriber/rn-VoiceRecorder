import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import RecordScreen from "./screens/RecordScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { AudioProvider } from "./context/AudioContext";
import { Audio } from "expo-av";

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
    console.error("Error configuring audio:", error);
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
            style={styles.header}
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
            style={styles.headerButton}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#020617", // Primary color
    elevation: 0, 
    shadowOpacity: 0, 
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerButton: {
    marginRight: 15,
  },
  cardStyle: {
    backgroundColor: "#F5F5F5", // Light background for screens
  },
});

export default App;
