import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import { useAudio } from "../context/AudioContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const RecordingItem = ({ recording }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const { deleteRecording } = useAudio();
  

  // Format time in milliseconds to mm:ss
  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );

        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Failed to play audio");
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
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
        <View style={styles.durationContainer}>
          <Text style={styles.duration}>
            {formatTime(position)} / {formatTime(duration || 0)}
          </Text>
          {/*progress bar of the audio */}
          {duration > 0 && (
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  { width: `${(position / duration) * 100}%` },
                ]}
              />
            </View>
          )}
        </View>
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
    backgroundColor: "#64748b",
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
    color: "#f8fafc",
    marginTop: 4,
  },
  durationContainer: {
    marginTop: 8,
  },
  duration: {
    fontSize: 12,
    color: "#f8fafc",
    marginBottom: 4,
  },
  progressBar: {
    height: 3,
    backgroundColor: "#E0E0E0",
    borderRadius: 1.5,
    overflow: "hidden",
    marginTop: 4,
  },
  progress: {
    height: "100%",
    backgroundColor: "#2196F3",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});

export default RecordingItem;
