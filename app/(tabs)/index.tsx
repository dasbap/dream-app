// app/(tabs)/index.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import DreamForm from '@/components/DreamForm'; // Assurez-vous que le chemin est correct

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <DreamForm />

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
});
