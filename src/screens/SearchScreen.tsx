import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Anime, RootStackParamList, AnimeFilters } from '../types';
import { AnimeService } from '../services/animeService';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
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
  const [filters, setFilters] = useState<AnimeFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const performSearch = async (query: string, page: number = 1, searchFilters: AnimeFilters = filters) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      setHasSearched(true);

      // Search anime with filters
      const animeResults = await AnimeService.searchAnime(query, page, searchFilters);

      if (page === 1) {
        setSearchResults(animeResults.data);
      } else {
        setSearchResults(prev => [...prev, ...animeResults.data]);
      }

      setHasNextPage(animeResults.pagination.has_next_page);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce(performSearch, 500);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    performSearch(searchQuery, 1, filters);
  };

  const handleClear = () => {
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: AnimeFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    if (searchQuery.trim()) {
      setCurrentPage(1);
      performSearch(searchQuery, 1, filters);
    }
  };

  const handleLoadMore = () => {
    if (!hasNextPage || loadingMore || loading) return;
    performSearch(searchQuery, currentPage + 1, filters);
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
      <View style={styles.searchHeader}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSubmit={handleSearchSubmit}
          onClear={handleClear}
          autoFocus={true}
        />
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
        />
      </View>

      {loading && (
        <LoadingSpinner message="Searching..." />
      )}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => performSearch(searchQuery, 1, filters)}
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
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
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
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#111',
  },
  resultsContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
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
