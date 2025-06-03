import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, MalEntity, Anime } from '../types';
import { AnimeService } from '../services/animeService';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

type GenreScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2;

const GenreScreen: React.FC = () => {
  const navigation = useNavigation<GenreScreenNavigationProp>();

  const [genres, setGenres] = useState<MalEntity[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<MalEntity | null>(null);
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAnime, setLoadingAnime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AnimeService.getAnimeGenres();
      setGenres(response.data);
    } catch (err: any) {
      console.error('Error loading genres:', err);
      setError(err.message || 'Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  const loadAnimeByGenre = async (genreId: number, page: number = 1) => {
    try {
      if (page === 1) {
        setLoadingAnime(true);
      } else {
        setLoadingMore(true);
      }

      const response = await AnimeService.getAnimeByGenre(genreId, page);
      
      if (page === 1) {
        setAnime(response.data);
      } else {
        setAnime(prev => [...prev, ...response.data]);
      }
      
      setHasNextPage(response.pagination.has_next_page);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Error loading anime by genre:', err);
      setError(err.message || 'Failed to load anime');
    } finally {
      setLoadingAnime(false);
      setLoadingMore(false);
    }
  };

  const handleGenreSelect = (genre: MalEntity) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    setAnime([]);
    loadAnimeByGenre(genre.mal_id, 1);
  };

  const handleLoadMore = async () => {
    if (!hasNextPage || loadingMore || !selectedGenre) return;
    await loadAnimeByGenre(selectedGenre.mal_id, currentPage + 1);
  };

  const handleAnimePress = (animeId: number) => {
    navigation.navigate('AnimeDetails', { animeId });
  };

  const renderGenreItem = ({ item }: { item: MalEntity }) => (
    <TouchableOpacity
      style={[
        styles.genreItem,
        selectedGenre?.mal_id === item.mal_id && styles.selectedGenreItem,
      ]}
      onPress={() => handleGenreSelect(item)}
    >
      <Text
        style={[
          styles.genreText,
          selectedGenre?.mal_id === item.mal_id && styles.selectedGenreText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

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
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading genres..." />;
  }

  if (error && !selectedGenre) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadGenres}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Genres List */}
      <View style={styles.genresSection}>
        <Text style={styles.sectionTitle}>Select Genre</Text>
        <FlatList
          data={genres}
          renderItem={renderGenreItem}
          keyExtractor={(item) => item.mal_id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genresList}
        />
      </View>

      {/* Anime Results */}
      <View style={styles.animeSection}>
        {selectedGenre ? (
          <>
            <Text style={styles.sectionTitle}>
              {selectedGenre.name} Anime
            </Text>
            {loadingAnime ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>Loading anime...</Text>
              </View>
            ) : (
              <FlatList
                data={anime}
                renderItem={renderAnimeItem}
                keyExtractor={(item) => item.mal_id.toString()}
                numColumns={2}
                contentContainerStyle={styles.animeList}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                      No anime found for this genre
                    </Text>
                  </View>
                )}
              />
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Browse by Genre</Text>
            <Text style={styles.emptyText}>
              Select a genre above to discover anime
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  genresSection: {
    backgroundColor: '#111',
    paddingVertical: 16,
  },
  animeSection: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  genresList: {
    paddingHorizontal: 16,
  },
  genreItem: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedGenreItem: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedGenreText: {
    color: '#fff',
  },
  animeList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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

export default GenreScreen;
