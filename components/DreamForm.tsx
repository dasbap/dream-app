import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import CalendarComponent from './CalendarComponent';
import { TextInput as RNTextInput } from 'react-native';

const { width } = Dimensions.get('window');

const tagsList = [
  { label: '🏞️ Aventure', value: '#Adventure🏞️' },
  { label: '✈️ Vol', value: '#Flight✈️' },
  { label: '😱 Cauchemar', value: '#Nightmare😱' },
  { label: '❤️ Amour', value: '#Love❤️' },
  { label: '🏃‍♂️ Poursuite', value: '#Chase' },
  { label: '🌌 Fantaisie', value: '#Fantasy' },
  { label: '👪 Famille', value: '#Family' },
  { label: '🔮 Avenir', value: '#Future' },
  { label: '🪄 Magie', value: '#Magic' },
  { label: '😨 Chute', value: '#Falling' },
  { label: '🏫 École', value: '#School' },
  { label: '💼 Travail', value: '#Work' },
  { label: '🐾 Animaux', value: '#Animals' },
  { label: '🌍 Voyage', value: '#Travel' },
  { label: '👤 Inconnu', value: '#Stranger' },
  { label: '🕵️‍♂️ Mystère', value: '#Mystery' },
  { label: '🔦 Exploration', value: '#Exploration' },
  { label: '🏰 Château', value: '#Castle' },
  { label: '🌅 Lever de soleil', value: '#Sunrise' },
  { label: '🌙 Nuit étoilée', value: '#StarryNight' },
  { label: '🚀 Espace', value: '#Space' },
  { label: '🎉 Fête', value: '#Party' },
  { label: '🎭 Performance', value: '#Performance' },
  { label: '🏖️ Plage', value: '#Beach' },
  { label: '🌲 Nature', value: '#Nature' },
  { label: '🔑 Secret', value: '#Secret' },
  { label: '🧩 Énigme', value: '#Puzzle' },
];

export default function DreamForm() {
  const textInputRef = useRef<RNTextInput>(null);
  const [dreamText, setDreamText] = useState('Voici mon rêve #tropbien');
  const [isLucidDream, setIsLucidDream] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [characters, setCharacters] = useState('');
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState('');
  const [clarity, setClarity] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const colorScheme = useColorScheme();

  const handleDreamSubmission = async () => {
    const dateToSave = selectedDate || new Date().toISOString().split('T')[0];
    const hashtags = dreamText.match(/#\w+/g) || [];

    const newDream = {
      id: Date.now(),
      text: dreamText,
      date: dateToSave,
      isLucid: isLucidDream,
      hashtags,
      tags: selectedTags,
      location,
      characters,
      emotion,
      intensity,
      clarity,
      sleepQuality,
    };

    try {
      const existingDreams = await AsyncStorage.getItem('dreams');
      const dreamsArray = existingDreams ? JSON.parse(existingDreams) : [];
      dreamsArray.push(newDream);
      await AsyncStorage.setItem('dreams', JSON.stringify(dreamsArray));
      console.log('Rêve sauvegardé:', newDream);
    } catch (error) {
      console.error('Erreur de sauvegarde du rêve:', error);
    }

    setDreamText('Voici mon rêve #tropbien');
    setIsLucidDream(false);
    setSelectedTags([]);
    setLocation('');
    setCharacters('');
    setEmotion('');
    setIntensity('');
    setClarity('');
    setSleepQuality('');
    resetCalendar();
  };

  const resetCalendar = () => {
    setSelectedDate(undefined);
  };

  const formatHashtags = (text: string) => {
    return (
      <Text>
        {text.split(/(#[a-zA-Z0-9_]+)/g).map((part, index) => (
          <Text key={index} style={part.startsWith('#') ? styles.hashtag : (colorScheme === 'dark' ? styles.normalTextDark : styles.normalText)}>
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  const handleFocus = () => {
    if (!isTyping) {
      setDreamText('');
    }
    setIsTyping(true);
  };

  const handleChangeText = (text: string) => {
    setDreamText(text);
    if (text.length === 0) {
      setIsTyping(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TouchableOpacity onPress={() => textInputRef.current?.focus()}>
          <View style={styles.fakeInput}>
            {formatHashtags(dreamText)}
          </View>
        </TouchableOpacity>
        <TextInput
          ref={textInputRef}
          value={dreamText}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          mode="outlined"
          multiline
          numberOfLines={6}
          style={[styles.hiddenInput, { color: colorScheme === 'dark' ? 'white' : 'black' }]} // Couleur du texte
          placeholder="Voici mon rêve #tropbien"
          placeholderTextColor={colorScheme === 'dark' ? 'lightgray' : 'gray'} // Couleur du placeholder
        />
        <CalendarComponent
          selectedDate={selectedDate}
          onDateSelect={(date) => setSelectedDate(date)}
        />
        <View style={styles.checkboxContainer}>
          <Checkbox.Item
            label="Rêve Lucide"
            status={isLucidDream ? 'checked' : 'unchecked'}
            onPress={() => setIsLucidDream(!isLucidDream)}
          />
        </View>
        <Text style={styles.label}>Lieu :</Text>
        <TextInput
          mode="outlined"
          value={location}
          onChangeText={setLocation}
          placeholder="Où a eu lieu le rêve ?"
          style={styles.input}
        />
        <Text style={styles.label}>Personnages :</Text>
        <TextInput
          mode="outlined"
          value={characters}
          onChangeText={setCharacters}
          placeholder="Qui était présent dans le rêve ?"
          style={styles.input}
        />
        <Text style={styles.label}>Émotion :</Text>
        <TextInput
          mode="outlined"
          value={emotion}
          onChangeText={setEmotion}
          placeholder="Quelle émotion avez-vous ressenti ?"
          style={styles.input}
        />
        <Text style={styles.label}>Intensité :</Text>
        <TextInput
          mode="outlined"
          value={intensity}
          onChangeText={setIntensity}
          placeholder="Quelle était l'intensité du rêve ?"
          style={styles.input}
        />
        <Text style={styles.label}>Clarté :</Text>
        <TextInput
          mode="outlined"
          value={clarity}
          onChangeText={setClarity}
          placeholder="Quelle était la clarté du rêve ?"
          style={styles.input}
        />
        <Text style={styles.label}>Qualité du sommeil :</Text>
        <TextInput
          mode="outlined"
          value={sleepQuality}
          onChangeText={setSleepQuality}
          placeholder="Comment était la qualité de votre sommeil ?"
          style={styles.input}
        />
        <Text style={styles.label}>Sélectionnez des thèmes :</Text>
        {tagsList.map((tag) => (
          <Checkbox.Item
            key={tag.value}
            label={tag.label}
            status={selectedTags.includes(tag.value) ? 'checked' : 'unchecked'}
            onPress={() => toggleTag(tag.value)}
          />
        ))}
        <Button mode="contained" onPress={handleDreamSubmission} style={styles.button}>
          Soumettre
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollViewContainer: {
    paddingBottom: 100,
  },
  fakeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    color: 'transparent',
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  label: {
    marginVertical: 8,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  normalText: {
    color: 'black',
  },
  normalTextDark: {
    color: 'black',
  },
  hashtag: {
    color: 'blue',
  },
});
