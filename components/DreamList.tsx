import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Modal, TextInput, Switch, Alert } from 'react-native';
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

  const navigation = useContext(NavigationContext);

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
        <Text style={[styles.itemDetail, item.isLucid ? styles.lucid : styles.nonLucid]}>
          {item.isLucid ? '🔮 Lucide' : '😴 Non lucide'}
        </Text>
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
            <Switch
              value={isLucidFilter === true}
              onValueChange={(value) => setIsLucidFilter(value ? true : undefined)}
            />
            <Text style={styles.modalLabel}>{isLucidFilter === true ? 'Oui' : 'Non'}</Text>
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
            <View style={styles.modalButtonContainer}>
              <Button title="Appliquer" onPress={applyFilters} color="#ffa500" />
              <Button title="Annuler" onPress={() => setFilterModalVisible(false)} color="#d9534f" />
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={filteredDreams}
        renderItem={renderDreamItem}
        keyExtractor={item => item.id}
        style={styles.list} // Ajoutez cette ligne pour éviter l'erreur
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    marginVertical: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 16,
  },
  lucid: {
    color: 'green',
    fontWeight: 'bold',
  },
  nonLucid: {
    color: 'red',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  list: { 
    marginTop: 10,
  },
});

export default DreamList;
