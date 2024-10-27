import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContext } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

// Définition de l'interface Dream
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

const DreamList: React.FC = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [emotionFilter, setEmotionFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [charactersFilter, setCharactersFilter] = useState('');
  const [isLucidFilter, setIsLucidFilter] = useState<boolean | undefined>(undefined);
  const [intensityFilter, setIntensityFilter] = useState<number | undefined>(undefined);
  const [clarityFilter, setClarityFilter] = useState<number | undefined>(undefined);
  const [sleepQualityFilter, setSleepQualityFilter] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const navigation = useContext(NavigationContext); // Utilisation correcte du context de navigation

  useEffect(() => {
    const loadDreams = async () => {
      try {
        const storedDreams = await AsyncStorage.getItem('dreams');
        const dreamsData: Dream[] = storedDreams ? JSON.parse(storedDreams) : [];
        setDreams(dreamsData);
        setFilteredDreams(dreamsData);
      } catch (error) {
        console.error('Erreur lors du chargement des rêves:', error);
      }
    };
    loadDreams();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loadDreams = async () => {
        try {
          const storedDreams = await AsyncStorage.getItem('dreams');
          const dreamsData: Dream[] = storedDreams ? JSON.parse(storedDreams) : [];
          setDreams(dreamsData);
          setFilteredDreams(dreamsData);
        } catch (error) {
          console.error('Erreur lors du chargement des rêves:', error);
        }
      };
      loadDreams();
    }, [])
  );

  const applyFilters = () => {
    let updatedDreams = [...dreams];

    if (emotionFilter) {
      updatedDreams = updatedDreams.filter(dream => dream.emotion.toLowerCase() === emotionFilter.toLowerCase());
    }
    if (locationFilter) {
      updatedDreams = updatedDreams.filter(dream => dream.location.toLowerCase() === locationFilter.toLowerCase());
    }
    if (charactersFilter) {
      updatedDreams = updatedDreams.filter(dream => dream.characters.toLowerCase() === charactersFilter.toLowerCase());
    }
    if (isLucidFilter !== undefined) {
      updatedDreams = updatedDreams.filter(dream => dream.isLucid === isLucidFilter);
    }
    if (intensityFilter !== undefined) {
      updatedDreams = updatedDreams.filter(dream => dream.intensity === intensityFilter);
    }
    if (clarityFilter !== undefined) {
      updatedDreams = updatedDreams.filter(dream => dream.clarity === clarityFilter);
    }
    if (sleepQualityFilter !== undefined) {
      updatedDreams = updatedDreams.filter(dream => dream.sleepQuality === sleepQualityFilter);
    }

    updatedDreams.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

    setFilteredDreams(updatedDreams);
    setFilterModalVisible(false);
  };

  const confirmDelete = (dream: Dream) => {
    Alert.alert(
      'Supprimer le rêve',
      'Êtes-vous sûr de vouloir supprimer ce rêve ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: async () => {
            const updatedDreams = dreams.filter(d => d.id !== dream.id);
            await AsyncStorage.setItem('dreams', JSON.stringify(updatedDreams));
            setDreams(updatedDreams);
            setFilteredDreams(updatedDreams);
          }
        }
      ],
      { cancelable: true }
    );
  };

  const showActionAlert = (dream: Dream) => {
    Alert.alert(
      'Sélectionnez une action',
      'Que voulez-vous faire avec ce rêve ?',
      [
        { text: 'Modifier', onPress: () => editDream(dream) },
        { text: 'Supprimer', onPress: () => confirmDelete(dream) },
        { text: 'Annuler', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const editDream = (dream: Dream) => {
    if (navigation) {
      navigation.navigate('three', { dream });
    } else {
      console.error("Navigation context is undefined.");
    }
  };

  const renderDreamItem = ({ item }: { item: Dream }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>{item.text}</Text>
        <Text style={styles.itemDetail}>{`Émotion: ${item.emotion}`}</Text>
        <Text style={styles.itemDetail}>{`Lieu: ${item.location}`}</Text>
        <Text style={styles.itemDetail}>{`Personnages: ${item.characters}`}</Text>
        <Text style={styles.itemDetail}>{`Date: ${item.date}`}</Text>
        <Text style={styles.itemDetail}>{`Lucide: ${item.isLucid ? 'Oui' : 'Non'}`}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Actions" onPress={() => showActionAlert(item)} color="#ffa500" />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Filtrer" onPress={() => setFilterModalVisible(true)} color="#ffa500" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filtrer</Text>
            <Text style={styles.modalLabel}>Émotion:</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez une émotion"
              value={emotionFilter}
              onChangeText={setEmotionFilter}
              placeholderTextColor="#ccc"
            />
            <Text style={styles.modalLabel}>Lieu:</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez un lieu"
              value={locationFilter}
              onChangeText={setLocationFilter}
              placeholderTextColor="#ccc"
            />
            <Text style={styles.modalLabel}>Personnages:</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez des personnages"
              value={charactersFilter}
              onChangeText={setCharactersFilter}
              placeholderTextColor="#ccc"
            />
            <Text style={styles.modalLabel}>Lucide:</Text>
            <TouchableOpacity onPress={() => setIsLucidFilter(isLucidFilter === true ? undefined : true)}>
              <Text style={[styles.button, isLucidFilter === true && styles.buttonActive]}>Oui</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsLucidFilter(isLucidFilter === false ? undefined : false)}>
              <Text style={[styles.button, isLucidFilter === false && styles.buttonActive]}>Non</Text>
            </TouchableOpacity>
            <Text style={styles.modalLabel}>Intensité:</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez une intensité"
              keyboardType="numeric"
              value={intensityFilter?.toString()}
              onChangeText={text => setIntensityFilter(text ? parseInt(text) : undefined)}
              placeholderTextColor="#ccc"
            />
            <Text style={styles.modalLabel}>Clarté:</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez une clarté"
              keyboardType="numeric"
              value={clarityFilter?.toString()}
              onChangeText={text => setClarityFilter(text ? parseInt(text) : undefined)}
              placeholderTextColor="#ccc"
            />
            <Text style={styles.modalLabel}>Qualité de sommeil:</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez une qualité de sommeil"
              keyboardType="numeric"
              value={sleepQualityFilter?.toString()}
              onChangeText={text => setSleepQualityFilter(text ? parseInt(text) : undefined)}
              placeholderTextColor="#ccc"
            />
            <View style={styles.buttonContainer}>
              <Button title="Appliquer" onPress={applyFilters} color="#ffa500" />
              <Button title="Annuler" onPress={() => setFilterModalVisible(false)} color="#ff0000" />
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={filteredDreams}
        renderItem={renderDreamItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 100,
  },
  item: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 14,
    marginVertical: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#ffa500',
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonActive: {
    backgroundColor: '#ff4500',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default DreamList;
