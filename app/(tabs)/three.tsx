import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import EditDreamScreen from '@/components/EditDreamScreen'; 

export default function ThreeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modifier le Rêve</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <EditDreamScreen />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', 
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20, 
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
