import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Anime, RootStackParamList } from '../types';
import { AnimeService } from '../services/animeService';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2.5; // Horizontal scroll cards

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load different anime categories sequentially to respect rate limits
      const topResponse = await AnimeService.getTopAnime(1);
      setTopAnime(topResponse.data.slice(0, 10));

      const popularResponse = await AnimeService.getAnimeByRanking(1, 'bypopularity');
      setPopularAnime(popularResponse.data.slice(0, 10));

      const seasonalResponse = await AnimeService.getSeasonalAnime(1);
      setSeasonalAnime(seasonalResponse.data.slice(0, 10));
    } catch (err: any) {
      console.error('Error loading home data:', err);
      setError(err.message || 'Failed to load anime content');
    } finally {
      setLoading(false);
    }
  };

  const navigateToAnimeDetails = (animeId: number) => {
    navigation.navigate('AnimeDetails', { animeId });
  };

  const navigateToAnimeList = (category: string) => {
    navigation.navigate('AnimeList', { category });
  };

  const renderAnimeCard = ({ item }: { item: Anime }) => (
    <AnimeCard
      item={item}
      onPress={() => navigateToAnimeDetails(item.mal_id)}
      width={cardWidth}
    />
  );

  if (loading) {
    return <LoadingSpinner message="Loading amazing anime..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadHomeData}
      />
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Anime Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Rated Anime</Text>
          <TouchableOpacity onPress={() => navigateToAnimeList('top_rated')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={topAnime}
          renderItem={renderAnimeCard}
          keyExtractor={(item) => `top-anime-${item.mal_id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>

      {/* Popular Anime Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Most Popular</Text>
          <TouchableOpacity onPress={() => navigateToAnimeList('popular')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={popularAnime}
          renderItem={renderAnimeCard}
          keyExtractor={(item) => `popular-anime-${item.mal_id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>

      {/* Seasonal Anime Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>This Season</Text>
          <TouchableOpacity onPress={() => navigateToAnimeList('seasonal')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={seasonalAnime}
          renderItem={renderAnimeCard}
          keyExtractor={(item) => `seasonal-anime-${item.mal_id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>

      {/* Quick Access Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
        </View>
        <View style={styles.categoriesGrid}>
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToAnimeList('airing')}
          >
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryEmoji}>📺</Text>
            </View>
            <Text style={styles.categoryText}>Currently Airing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToAnimeList('upcoming')}
          >
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryEmoji}>🔜</Text>
            </View>
            <Text style={styles.categoryText}>Upcoming Anime</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToAnimeList('movie')}
          >
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryEmoji}>🎬</Text>
            </View>
            <Text style={styles.categoryText}>Anime Movies</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Genres')}
          >
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryEmoji}>🏷️</Text>
            </View>
            <Text style={styles.categoryText}>Browse by Genre</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  categoryIcon: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default HomeScreen;
