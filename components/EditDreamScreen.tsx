import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Alert, Switch, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Dream {
    id: string;
    text: string;
    date: string | undefined;
    isLucid: boolean;
    hashtags: string[];
    location: string;
    characters: string;
    emotion: string;
    intensity: number;
    clarity: number;
    sleepQuality: number;
}

const tagsList = [
    { label: '🏞️ Aventure', value: '#Adventure' },
    { label: '✈️ Vol', value: '#Flight' },
    { label: '😱 Cauchemar', value: '#Nightmare' },
    { label: '❤️ Amour', value: '#Love' },
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

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

export default function EditDreamScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    type RouteParams = {
        dream?: Dream;
    };

    const { dream }: RouteParams = route.params || {};

    if (!dream) {
        return (
            <Container>
                <Text style={styles.message}>Vous n'avez pas sélectionné de rêve.</Text>
                <Button title="Retour" onPress={() => navigation.goBack()} />
            </Container>
        );
    }

    const [dreamText, setDreamText] = useState(dream.text);
    const [dreamDate, setDreamDate] = useState(dream.date || '');
    const [isLucid, setIsLucid] = useState(dream.isLucid);
    const [selectedTags, setSelectedTags] = useState<string[]>(dream.hashtags);
    const [location, setLocation] = useState(dream.location);
    const [characters, setCharacters] = useState(dream.characters);
    const [emotion, setEmotion] = useState(dream.emotion);
    const [intensity, setIntensity] = useState(dream.intensity);
    const [clarity, setClarity] = useState(dream.clarity);
    const [sleepQuality, setSleepQuality] = useState(dream.sleepQuality);

    useEffect(() => {
        setDreamText(dream.text);
        setDreamDate(dream.date || '');
        setIsLucid(dream.isLucid);
        setSelectedTags(dream.hashtags);
        setLocation(dream.location);
        setCharacters(dream.characters);
        setEmotion(dream.emotion);
        setIntensity(dream.intensity);
        setClarity(dream.clarity);
        setSleepQuality(dream.sleepQuality);
    }, [dream]);

    const isValidDate = (dateString: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return dateString.match(regex) !== null;
    };

    const handleSave = async () => {
        if (!isValidDate(dreamDate)) {
            Alert.alert('Erreur', 'La date doit être au format YYYY-MM-DD.');
            return;
        }

        let updatedDream: Dream = {
            id: dream.id,
            text: dreamText,
            date: dreamDate,
            isLucid,
            hashtags: selectedTags,
            location,
            characters,
            emotion,
            intensity,
            clarity,
            sleepQuality,
        };

        try {
            const storedDreams = await AsyncStorage.getItem('dreams');
            const dreamsArray: Dream[] = storedDreams ? JSON.parse(storedDreams) : [];

            const updatedDreams = dreamsArray.map(d => (d.id === dream.id ? updatedDream : d));
            await AsyncStorage.setItem('dreams', JSON.stringify(updatedDreams));

            Alert.alert('Succès', 'Le rêve a été modifié avec succès.');
            navigation.goBack();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du rêve:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde du rêve.');
        }
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
        );
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Modifier le rêve"
                    value={dreamText}
                    onChangeText={setDreamText}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Date (YYYY-MM-DD)"
                    value={dreamDate}
                    onChangeText={setDreamDate}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Characters"
                    value={characters}
                    onChangeText={setCharacters}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Emotion"
                    value={emotion}
                    onChangeText={setEmotion}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Intensity (0-10)"
                    value={String(intensity)}
                    keyboardType="numeric"
                    onChangeText={text => setIntensity(Number(text))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Clarity (0-10)"
                    value={String(clarity)}
                    keyboardType="numeric"
                    onChangeText={text => setClarity(Number(text))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Sleep Quality (0-10)"
                    value={String(sleepQuality)}
                    keyboardType="numeric"
                    onChangeText={text => setSleepQuality(Number(text))}
                />
                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Lucide :</Text>
                    <Switch
                        value={isLucid}
                        onValueChange={setIsLucid}
                    />
                </View>
                <Text style={styles.label}>Tags :</Text>
                {tagsList.map(tag => (
                    <View key={tag.value} style={styles.checkboxContainer}>
                        <Switch
                            value={selectedTags.includes(tag.value)}
                            onValueChange={() => toggleTag(tag.value)}
                        />
                        <Text style={styles.label}>{tag.label}</Text>
                    </View>
                ))}
                <Button title="Sauvegarder" onPress={handleSave} />
            </ScrollView>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212', 
    },
    scrollContainer: {
        paddingBottom: 100,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#1E1E1E', 
        color: 'white', 
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: 'white', 
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        marginLeft: 10,
        color: 'white', 
    },
});
