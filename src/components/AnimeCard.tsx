import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { Anime, AnimeCardProps } from '../types';
import {
  getAnimeTitle,
  getAnimeYear,
  getAnimeRating,
  getAnimeImageUrl,
  truncateText,
} from '../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');
const defaultCardWidth = (screenWidth - 60) / 2; // 2 cards per row with margins

const AnimeCard: React.FC<AnimeCardProps> = ({
  item,
  onPress,
  width = defaultCardWidth
}) => {
  const imageUrl = getAnimeImageUrl(item, 'medium');
  const title = getAnimeTitle(item);
  const year = getAnimeYear(item);
  const rating = getAnimeRating(item);

  return (
    <TouchableOpacity 
      style={[styles.container, { width }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            placeholder={require('../../assets/icon.png')}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="image-outline" size={40} color="#666" />
          </View>
        )}
        
        {/* Rating Badge */}
        {rating !== 'N/A' && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        )}

        {/* Episode Count Badge */}
        {item.episodes && (
          <View style={styles.episodeBadge}>
            <Text style={styles.episodeText}>{item.episodes} eps</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {truncateText(title, 40)}
        </Text>
        <Text style={styles.year}>{year}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 2/3, // Standard poster aspect ratio
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  episodeBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  episodeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  year: {
    color: '#999',
    fontSize: 12,
    marginBottom: 2,
  },
  type: {
    color: '#666',
    fontSize: 11,
    textTransform: 'uppercase',
  },
});

export default AnimeCard;
