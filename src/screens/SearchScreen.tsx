import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Anime, RootStackParamList } from '../types';
import { AnimeService } from '../services/animeService';
import SearchBar from '../components/SearchBar';
import AnimeCard from '../components/AnimeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { debounce, generateAnimeKey } from '../utils/helpers';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      // Search anime
      const animeResults = await AnimeService.searchAnime(query, 1);

      setSearchResults(animeResults.data.slice(0, 20));
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce(performSearch, 500);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleSearchSubmit = () => {
    performSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

  const navigateToDetails = (anime: Anime) => {
    navigation.navigate('AnimeDetails', { animeId: anime.mal_id });
  };

  const renderSearchResult = ({ item, index }: { item: Anime; index: number }) => (
    <AnimeCard
      item={item}
      onPress={() => navigateToDetails(item)}
      width={cardWidth}
    />
  );

  const renderEmptyState = () => {
    if (loading) return null;
    
    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Discover Anime</Text>
          <Text style={styles.emptyText}>
            Search for your favorite anime series and movies
          </Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyText}>
            Try searching with different keywords
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        onSubmit={handleSearchSubmit}
        onClear={handleClear}
        autoFocus={true}
      />

      {loading && (
        <LoadingSpinner message="Searching..." />
      )}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => performSearch(searchQuery)}
        />
      )}

      {!loading && !error && (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item, index) => generateAnimeKey(item, index)}
          numColumns={2}
          contentContainerStyle={styles.resultsContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  resultsContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
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

export default SearchScreen;
