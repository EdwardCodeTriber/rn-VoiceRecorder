import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { useAudio } from "../context/AudioContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const audioPlayer = new AudioRecorderPlayer();


// Recorded Items 
const RecordingItem = ({ recording }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { deleteRecording } = useAudio();

  // Option to play and pause recorded/recording Item
  const onPlayPause = async () => {
    try {
      if (isPlaying) {
        await audioPlayer.stopPlayer();
        setIsPlaying(false);
      } else {
        await audioPlayer.startPlayer(recording.uri);
        audioPlayer.addPlayBackListener(() => {});
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
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
