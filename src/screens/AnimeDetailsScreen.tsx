import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Anime } from '../types';
import { AnimeService } from '../services/animeService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

type AnimeDetailsScreenRouteProp = RouteProp<RootStackParamList, 'AnimeDetails'>;

interface Props {
  route: AnimeDetailsScreenRouteProp;
}

const { width: screenWidth } = Dimensions.get('window');

const AnimeDetailsScreen: React.FC<Props> = ({ route }) => {
  const { animeId } = route.params;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'staff' | 'recommendations'>('overview');

  useEffect(() => {
    loadAnimeDetails();
  }, [animeId]);

  const loadAnimeDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load anime details and related data in parallel
      const [animeResponse, charactersResponse, staffResponse, recommendationsResponse] = await Promise.allSettled([
        AnimeService.getAnimeFullDetails(animeId),
        AnimeService.getAnimeCharacters(animeId),
        AnimeService.getAnimeStaff(animeId),
        AnimeService.getAnimeRecommendations(animeId),
      ]);

      // Handle anime details
      if (animeResponse.status === 'fulfilled') {
        setAnime(animeResponse.value.data);
      } else {
        throw new Error('Failed to load anime details');
      }

      // Handle characters (optional)
      if (charactersResponse.status === 'fulfilled') {
        setCharacters(charactersResponse.value.data.slice(0, 10)); // Limit to top 10
      }

      // Handle staff (optional)
      if (staffResponse.status === 'fulfilled') {
        setStaff(staffResponse.value.data.slice(0, 10)); // Limit to top 10
      }

      // Handle recommendations (optional)
      if (recommendationsResponse.status === 'fulfilled') {
        setRecommendations(recommendationsResponse.value.data.slice(0, 6)); // Limit to 6
      }

    } catch (err: any) {
      console.error('Error loading anime details:', err);
      setError(err.message || 'Failed to load anime details');
    } finally {
      setLoading(false);
    }
  };

  const openTrailer = () => {
    if (anime?.trailer?.url) {
      Linking.openURL(anime.trailer.url).catch(() => {
        Alert.alert('Error', 'Could not open trailer');
      });
    }
  };

  const formatScore = (score: number | null) => {
    return score ? score.toFixed(1) : 'N/A';
  };

  const formatNumber = (num: number | null) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading anime details..." />;
  }

  if (error || !anime) {
    return (
      <ErrorMessage
        message={error || 'Anime not found'}
        onRetry={loadAnimeDetails}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'characters':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Characters</Text>
            {characters.length > 0 ? (
              characters.map((char, index) => (
                <View key={index} style={styles.characterItem}>
                  <Image
                    source={{ uri: char.character?.images?.jpg?.image_url }}
                    style={styles.characterImage}
                  />
                  <View style={styles.characterInfo}>
                    <Text style={styles.characterName}>{char.character?.name}</Text>
                    <Text style={styles.characterRole}>{char.role}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No character information available</Text>
            )}
          </View>
        );

      case 'staff':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Staff</Text>
            {staff.length > 0 ? (
              staff.map((member, index) => (
                <View key={index} style={styles.staffItem}>
                  <Image
                    source={{ uri: member.person?.images?.jpg?.image_url }}
                    style={styles.staffImage}
                  />
                  <View style={styles.staffInfo}>
                    <Text style={styles.staffName}>{member.person?.name}</Text>
                    <Text style={styles.staffPosition}>
                      {member.positions?.join(', ') || 'Staff'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No staff information available</Text>
            )}
          </View>
        );

      case 'recommendations':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Recommendations</Text>
            {recommendations.length > 0 ? (
              <View style={styles.recommendationsGrid}>
                {recommendations.map((rec, index) => (
                  <TouchableOpacity key={index} style={styles.recommendationItem}>
                    <Image
                      source={{ uri: rec.entry?.images?.jpg?.image_url }}
                      style={styles.recommendationImage}
                    />
                    <Text style={styles.recommendationTitle} numberOfLines={2}>
                      {rec.entry?.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No recommendations available</Text>
            )}
          </View>
        );

      default: // overview
        return (
          <View style={styles.tabContent}>
            {/* Synopsis */}
            {anime.synopsis && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Synopsis</Text>
                <Text style={styles.synopsis}>{anime.synopsis}</Text>
              </View>
            )}

            {/* Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Type</Text>
                  <Text style={styles.infoValue}>{anime.type || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Episodes</Text>
                  <Text style={styles.infoValue}>{anime.episodes || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={styles.infoValue}>{anime.status || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{anime.duration || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Rating</Text>
                  <Text style={styles.infoValue}>{anime.rating || 'N/A'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Source</Text>
                  <Text style={styles.infoValue}>{anime.source || 'N/A'}</Text>
                </View>
              </View>
            </View>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Genres</Text>
                <View style={styles.genresContainer}>
                  {anime.genres.map((genre, index) => (
                    <View key={index} style={styles.genreTag}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Studios</Text>
                <Text style={styles.infoValue}>
                  {anime.studios.map(studio => studio.name).join(', ')}
                </Text>
              </View>
            )}
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with poster and basic info */}
      <View style={styles.header}>
        <Image
          source={{ uri: anime.images.jpg.large_image_url }}
          style={styles.posterImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={3}>
            {anime.title}
          </Text>
          {anime.title_english && anime.title_english !== anime.title && (
            <Text style={styles.englishTitle} numberOfLines={2}>
              {anime.title_english}
            </Text>
          )}

          {/* Score and stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{formatScore(anime.score)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color="#FF6B35" />
              <Text style={styles.statText}>{formatNumber(anime.members)}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color="#FF69B4" />
              <Text style={styles.statText}>{formatNumber(anime.favorites)}</Text>
            </View>
          </View>

          {/* Trailer button */}
          {anime.trailer?.url && (
            <TouchableOpacity style={styles.trailerButton} onPress={openTrailer}>
              <Ionicons name="play" size={16} color="#fff" />
              <Text style={styles.trailerText}>Watch Trailer</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'characters', label: 'Characters' },
          { key: 'staff', label: 'Staff' },
          { key: 'recommendations', label: 'Similar' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab.key && styles.activeTabButtonText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#111',
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  englishTitle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '600',
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  trailerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111',
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#FF6B35',
  },
  tabButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: '#FF6B35',
  },
  tabContent: {
    padding: 16,
  },
  tabTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  synopsis: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  characterItem: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 12,
  },
  characterImage: {
    width: 50,
    height: 70,
    borderRadius: 6,
  },
  characterInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  characterName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  characterRole: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  staffItem: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 12,
  },
  staffImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  staffInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  staffName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  staffPosition: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recommendationItem: {
    width: (screenWidth - 48) / 3,
    marginBottom: 16,
  },
  recommendationImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
  },
  recommendationTitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  noDataText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AnimeDetailsScreen;
