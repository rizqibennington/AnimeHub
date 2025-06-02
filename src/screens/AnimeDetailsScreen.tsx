import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type AnimeDetailsScreenRouteProp = RouteProp<RootStackParamList, 'AnimeDetails'>;

interface Props {
  route: AnimeDetailsScreenRouteProp;
}

const AnimeDetailsScreen: React.FC<Props> = ({ route }) => {
  const { animeId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Anime Details Screen</Text>
      <Text style={styles.text}>Anime ID: {animeId}</Text>
      <Text style={styles.subText}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  subText: {
    color: '#999',
    fontSize: 14,
  },
});

export default AnimeDetailsScreen;
