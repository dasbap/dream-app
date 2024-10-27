import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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

export default function StatsScreen() {
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [stats, setStats] = useState({
        totalDreams: 0,
        averageIntensity: 0,
        averageClarity: 0,
        averageSleepQuality: 0,
        lucidDreams: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchDreams = async () => {
        setLoading(true);
        try {
            const storedDreams = await AsyncStorage.getItem('dreams');
            const dreamsArray: Dream[] = storedDreams ? JSON.parse(storedDreams) : [];
            setDreams(dreamsArray);
            calculateStats(dreamsArray);
        } catch (error) {
            console.error('Erreur lors de la récupération des rêves:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des rêves.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchDreams();
        }, [])
    );

    const calculateStats = (dreamsArray: Dream[]) => {
        const totalDreams = dreamsArray.length;
        const lucidDreams = dreamsArray.filter(dream => dream.isLucid).length;

        const totalIntensity = dreamsArray.reduce((acc, dream) => acc + dream.intensity, 0);
        const totalClarity = dreamsArray.reduce((acc, dream) => acc + dream.clarity, 0);
        const totalSleepQuality = dreamsArray.reduce((acc, dream) => acc + dream.sleepQuality, 0);

        setStats({
            totalDreams,
            averageIntensity: totalDreams ? totalIntensity / totalDreams : 0,
            averageClarity: totalDreams ? totalClarity / totalDreams : 0,
            averageSleepQuality: totalDreams ? totalSleepQuality / totalDreams : 0,
            lucidDreams,
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Chargement des rêves...</Text>
            </View>
        );
    }

    if (stats.totalDreams === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Aucun rêve à analyser.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Statistiques de mes rêves</Text>
            <View style={styles.card}>
                <Text style={styles.stat}>Nombre total de rêves : {stats.totalDreams}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.stat}>Rêves lucides : {stats.lucidDreams}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.stat}>Intensité moyenne : {stats.averageIntensity.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.stat}>Clarté moyenne : {stats.averageClarity.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.stat}>Qualité de sommeil moyenne : {stats.averageSleepQuality.toFixed(2)}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    stat: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        color: '#888',
    },
    card: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        elevation: 3,
        marginBottom: 15,
    },
});
