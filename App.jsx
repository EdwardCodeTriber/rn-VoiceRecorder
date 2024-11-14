import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import RecordScreen from "./screens/RecordScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { AudioProvider } from "./context/AudioContext";

const Stack = createStackNavigator();

const App = () => {
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

export default App;
