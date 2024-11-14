import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useAudio } from "../context/AudioContext";
import RecordingItem from "./RecordingItem";
import Icon from "react-native-vector-icons/MaterialIcons";


// Home Screens
const HomeScreen = ({ navigation }) => {
  const { recordings } = useAudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecordings, setFilteredRecordings] = useState([]);

  // Hook to filter recoreded Items
  useEffect(() => {
    const filtered = recordings.filter((recording) =>
      recording.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecordings(filtered);
  }, [searchQuery, recordings]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search voice notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredRecordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecordingItem recording={item} />}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Record")}
      >
        <Icon name="mic" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#2196F3",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});

export default HomeScreen;
