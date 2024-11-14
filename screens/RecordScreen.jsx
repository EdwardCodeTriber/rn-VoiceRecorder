import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { useAudio } from "../context/AudioContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const audioRecorderPlayer = new AudioRecorderPlayer();

// Recording Screen
const RecordScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState("00:00");
  const [title, setTitle] = useState("");
  const { saveRecording } = useAudio();

  // hook for permission state
  useEffect(() => {
    requestPermissions();
    return () => {
      audioRecorderPlayer.stopRecorder();
    };
  }, []);

  // Platform based permissions
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        return Object.values(granted).every(
          (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const onStartRecord = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your recording");
      return;
    }

    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(
          audioRecorderPlayer.mmssss(Math.floor(e.currentPosition))
        );
      });
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);

      const newRecording = {
        id: Date.now().toString(),
        title: title,
        uri: result,
        date: new Date().toISOString(),
        duration: recordTime,
      };

      await saveRecording(newRecording);
      navigation.goBack();
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter recording title"
        value={title}
        onChangeText={setTitle}
        editable={!isRecording}
      />
      <Text style={styles.timer}>{recordTime}</Text>
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recording]}
        onPress={isRecording ? onStopRecord : onStartRecord}
      >
        <Icon name={isRecording ? "stop" : "mic"} size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  timer: {
    fontSize: 48,
    marginBottom: 30,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
  },
  recording: {
    backgroundColor: "#f44336",
  },
});

export default RecordScreen;
