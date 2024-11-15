import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import { useAudio } from "../context/AudioContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const RecordingItem = ({ recording }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const { deleteRecording } = useAudio();

  // Clean up sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Option to play and pause recorded/recording Item
  const onPlayPause = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Load the sound first time
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recording.uri },
          { shouldPlay: true }
        );

        // Add status update listener
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });

        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Failed to play audio");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Recording",
      "Are you sure you want to delete this recording?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteRecording(recording.id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{recording.title}</Text>
        <Text style={styles.date}>
          {new Date(recording.date).toLocaleDateString()}
        </Text>
        <Text style={styles.duration}>{recording.duration}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onPlayPause}>
          <Icon
            name={isPlaying ? "pause" : "play-arrow"}
            size={24}
            color="#2196F3"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmDelete}>
          <Icon name="delete" size={24} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  duration: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});

export default RecordingItem;
