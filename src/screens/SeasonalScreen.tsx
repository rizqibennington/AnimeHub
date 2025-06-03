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
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Anime } from '../types';
import AnimeService from '../services/animeService';
import AnimeCard from '../components/AnimeCard';
import SeasonPicker from '../components/SeasonPicker';

type SeasonalScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Seasonal'>;
type SeasonalScreenRouteProp = RouteProp<RootStackParamList, 'Seasonal'>;

interface Props {
  navigation: SeasonalScreenNavigationProp;
  route: SeasonalScreenRouteProp;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2; // 2 columns with padding

const SeasonalScreen: React.FC<Props> = ({ navigation, route }) => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Season and year state
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  const [selectedYear, setSelectedYear] = useState(route.params?.year || currentYear);
  const [selectedSeason, setSelectedSeason] = useState(route.params?.season || currentSeason);

  // Get current season based on month
  function getCurrentSeason(): string {
    const month = new Date().getMonth() + 1; // getMonth() returns 0-11
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }

  const fetchSeasonalAnime = async (page: number = 1, year: number = selectedYear, season: string = selectedSeason) => {
    try {
      const response = await AnimeService.getSeasonalAnimeByYear(year, season, page);
      
      if (page === 1) {
        setAnime(response.data);
      } else {
        setAnime(prev => [...prev, ...response.data]);
      }
      
      setHasNextPage(response.pagination.has_next_page);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching seasonal anime:', error);
      Alert.alert('Error', 'Failed to load seasonal anime. Please try again.');
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    await fetchSeasonalAnime(1, selectedYear, selectedSeason);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await fetchSeasonalAnime(1, selectedYear, selectedSeason);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!hasNextPage || loadingMore) return;
    
    setLoadingMore(true);
    await fetchSeasonalAnime(currentPage + 1, selectedYear, selectedSeason);
    setLoadingMore(false);
  };

  const handleSeasonChange = (year: number, season: string) => {
    setSelectedYear(year);
    setSelectedSeason(season);
    setCurrentPage(1);
    setAnime([]);
    fetchSeasonalAnime(1, year, season);
  };

  const handleAnimePress = (animeId: number) => {
    navigation.navigate('AnimeDetails', { animeId });
  };

  useEffect(() => {
    loadInitialData();
  }, []);

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading seasonal anime...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SeasonPicker
        selectedYear={selectedYear}
        selectedSeason={selectedSeason}
        onSeasonChange={handleSeasonChange}
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default SeasonalScreen;
