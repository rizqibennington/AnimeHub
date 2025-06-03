import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Anime } from '../types';
import AnimeService from '../services/animeService';
import AnimeCard from '../components/AnimeCard';
import RankingCategorySelector from '../components/RankingCategorySelector';

type RankingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rankings'>;

interface Props {
  navigation: RankingsScreenNavigationProp;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2; // 2 columns with padding

const RankingsScreen: React.FC<Props> = ({ navigation }) => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('bypopularity');

  const fetchRankingAnime = async (page: number = 1, category: string = selectedCategory) => {
    try {
      let response;
      
      switch (category) {
        case 'airing':
          response = await AnimeService.getAnimeByRanking(page, 'airing');
          break;
        case 'upcoming':
          response = await AnimeService.getAnimeByRanking(page, 'upcoming');
          break;
        case 'favorite':
          response = await AnimeService.getAnimeByRanking(page, 'favorite');
          break;
        case 'top_rated':
          response = await AnimeService.getTopAnime(page);
          break;
        case 'bypopularity':
        default:
          response = await AnimeService.getAnimeByRanking(page, 'bypopularity');
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
      console.error('Error fetching ranking anime:', error);
      Alert.alert('Error', 'Failed to load ranking anime. Please try again.');
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    await fetchRankingAnime(1, selectedCategory);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await fetchRankingAnime(1, selectedCategory);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!hasNextPage || loadingMore) return;
    
    setLoadingMore(true);
    await fetchRankingAnime(currentPage + 1, selectedCategory);
    setLoadingMore(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setAnime([]);
    fetchRankingAnime(1, category);
  };

  const handleAnimePress = (animeId: number) => {
    navigation.navigate('AnimeDetails', { animeId });
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const renderAnimeItem = ({ item, index }: { item: Anime; index: number }) => (
    <View style={styles.animeItemContainer}>
      <View style={styles.rankingBadge}>
        <Text style={styles.rankingText}>#{(currentPage - 1) * 25 + index + 1}</Text>
      </View>
      <AnimeCard
        item={item}
        onPress={() => handleAnimePress(item.mal_id)}
        width={cardWidth}
      />
    </View>
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading rankings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RankingCategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
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
  animeItemContainer: {
    position: 'relative',
    margin: 5,
  },
  rankingBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  rankingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default RankingsScreen;
