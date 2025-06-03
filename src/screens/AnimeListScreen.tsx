import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Anime } from '../types';
import { AnimeService } from '../services/animeService';
import AnimeCard from '../components/AnimeCard';
import ErrorMessage from '../components/ErrorMessage';

type AnimeListScreenRouteProp = RouteProp<RootStackParamList, 'AnimeList'>;
type AnimeListScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  route: AnimeListScreenRouteProp;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2; // 2 columns with padding

const AnimeListScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<AnimeListScreenNavigationProp>();
  const { category } = route.params;

  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, [category]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchAnimeByCategory(1);
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      setError(err.message || 'Failed to load anime');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimeByCategory = async (page: number = 1) => {
    try {
      let response;

      switch (category) {
        case 'popular':
          response = await AnimeService.getAnimeByRanking(page, 'bypopularity');
          break;
        case 'airing':
          response = await AnimeService.getAnimeByRanking(page, 'airing');
          break;
        case 'upcoming':
          response = await AnimeService.getAnimeByRanking(page, 'upcoming');
          break;
        case 'top_rated':
          response = await AnimeService.getTopAnime(page);
          break;
        case 'seasonal':
          response = await AnimeService.getSeasonalAnime(page);
          break;
        case 'movie':
          response = await AnimeService.getTopAnime(page, 'movie');
          break;
        default:
          response = await AnimeService.getAnimeByCategory(category as any, page);
          break;
      }

      if (page === 1) {
        setAnime(response.data);
      } else {
        setAnime(prev => [...prev, ...response.data]);
      }

      setHasNextPage(response.pagination.has_next_page);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching anime by category:', error);
      throw error;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    try {
      await fetchAnimeByCategory(1);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasNextPage || loadingMore || loading) return;

    setLoadingMore(true);
    try {
      await fetchAnimeByCategory(currentPage + 1);
    } catch (err: any) {
      console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAnimePress = (animeId: number) => {
    navigation.navigate('AnimeDetails', { animeId });
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'popular':
        return 'Most Popular Anime';
      case 'airing':
        return 'Currently Airing';
      case 'upcoming':
        return 'Upcoming Anime';
      case 'top_rated':
        return 'Top Rated Anime';
      case 'seasonal':
        return 'This Season';
      case 'movie':
        return 'Anime Movies';
      default:
        return category.replace('_', ' ').toUpperCase() + ' Anime';
    }
  };

  const renderAnimeItem = ({ item }: { item: Anime }) => (
    <AnimeCard
      item={item}
      onPress={() => handleAnimePress(item.mal_id)}
      width={cardWidth}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#FF6B35" />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No Anime Found</Text>
        <Text style={styles.emptyText}>
          No anime available in this category at the moment.
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading {getCategoryTitle(category).toLowerCase()}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadInitialData}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={anime}
        renderItem={renderAnimeItem}
        keyExtractor={(item) => item.mal_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    color: '#999',
    marginTop: 8,
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default AnimeListScreen;
