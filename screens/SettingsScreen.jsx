// screens/SettingsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useAudio } from "../context/AudioContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const SettingsScreen = () => {
  const { settings, updateSettings } = useAudio();
  const [localSettings, setLocalSettings] = useState({
    ...settings,
    darkMode: false,
    autoSave: true,
    compressionEnabled: true,
    recordingQuality: "medium", // low, medium, high
    playbackSpeed: 1.0,
    notificationsEnabled: true,
    autoDeleteAfter: "never", // never, 30days, 90days
  });

  const qualityOptions = [
    { label: "Low (32 kbps)", value: "low" },
    { label: "Medium (128 kbps)", value: "medium" },
    { label: "High (256 kbps)", value: "high" },
  ];

  const playbackSpeedOptions = [
    { label: "0.5x", value: 0.5 },
    { label: "1.0x", value: 1.0 },
    { label: "1.5x", value: 1.5 },
    { label: "2.0x", value: 2.0 },
  ];

  const autoDeleteOptions = [
    { label: "Never", value: "never" },
    { label: "After 30 days", value: "30days" },
    { label: "After 90 days", value: "90days" },
  ];

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    await updateSettings(newSettings);
  };

  const clearAllData = async () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all recordings and settings? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Success", "All data has been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderSwitch = (title, key, description = "") => (
    <View style={styles.settingItem}>
      <View style={styles.settingHeader}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Switch
          value={localSettings[key]}
          onValueChange={(value) => handleSettingChange(key, value)}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={localSettings[key] ? "#2196F3" : "#f4f3f4"}
        />
      </View>
      {description ? (
        <Text style={styles.settingDescription}>{description}</Text>
      ) : null}
    </View>
  );

  const renderOptionSelector = (options, selectedValue, onSelect) => (
    <View style={styles.optionsContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            selectedValue === option.value && styles.selectedOption,
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text
            style={[
              styles.optionText,
              selectedValue === option.value && styles.selectedOptionText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderSection(
        "Recording Settings",
        <>
          {renderSwitch(
            "Compression",
            "compressionEnabled",
            "Reduce file size with minimal quality loss"
          )}
          <Text style={styles.settingLabel}>Recording Quality</Text>
          {renderOptionSelector(
            qualityOptions,
            localSettings.recordingQuality,
            (value) => handleSettingChange("recordingQuality", value)
          )}
        </>
      )}

      {renderSection(
        "Playback Settings",
        <>
          <Text style={styles.settingLabel}>Playback Speed</Text>
          {renderOptionSelector(
            playbackSpeedOptions,
            localSettings.playbackSpeed,
            (value) => handleSettingChange("playbackSpeed", value)
          )}
        </>
      )}

      {renderSection(
        "Storage Settings",
        <>
          {renderSwitch(
            "Auto Save",
            "autoSave",
            "Automatically save recordings when stopped"
          )}
          <Text style={styles.settingLabel}>Auto Delete Recordings</Text>
          {renderOptionSelector(
            autoDeleteOptions,
            localSettings.autoDeleteAfter,
            (value) => handleSettingChange("autoDeleteAfter", value)
          )}
        </>
      )}

      {renderSection(
        "App Settings",
        <>
          {renderSwitch(
            "Dark Mode",
            "darkMode",
            "Enable dark theme for the app"
          )}
          {renderSwitch(
            "Notifications",
            "notificationsEnabled",
            "Receive recording reminders and updates"
          )}
        </>
      )}

      {renderSection(
        "Data Management",
        <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
          <Icon name="delete-forever" size={24} color="#fff" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "#fff",
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2196F3",
  },
  settingItem: {
    marginBottom: 16,
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  selectedOption: {
    backgroundColor: "#2196F3",
  },
  optionText: {
    color: "#2196F3",
  },
  selectedOptionText: {
    color: "#fff",
  },
  dangerButton: {
    backgroundColor: "#f44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  dangerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  version: {
    textAlign: "center",
    color: "#666",
  },
});

export default SettingsScreen;
