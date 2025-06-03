import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RankingCategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const RANKING_CATEGORIES = [
  {
    key: 'bypopularity',
    label: 'Most Popular',
    icon: 'trending-up',
    description: 'Most popular anime',
  },
  {
    key: 'top_rated',
    label: 'Top Rated',
    icon: 'star',
    description: 'Highest rated anime',
  },
  {
    key: 'airing',
    label: 'Currently Airing',
    icon: 'play-circle',
    description: 'Currently broadcasting',
  },
  {
    key: 'upcoming',
    label: 'Upcoming',
    icon: 'time',
    description: 'Coming soon',
  },
  {
    key: 'favorite',
    label: 'Most Favorited',
    icon: 'heart',
    description: 'Most favorited anime',
  },
];

const RankingCategorySelector: React.FC<RankingCategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const handleCategoryPress = (category: string) => {
    if (category !== selectedCategory) {
      onCategoryChange(category);
    }
  };

  const renderCategoryItem = (category: typeof RANKING_CATEGORIES[0]) => {
    const isSelected = category.key === selectedCategory;
    
    return (
      <TouchableOpacity
        key={category.key}
        style={[
          styles.categoryItem,
          isSelected && styles.selectedCategoryItem,
        ]}
        onPress={() => handleCategoryPress(category.key)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryContent}>
          <View style={styles.categoryHeader}>
            <Ionicons
              name={category.icon as any}
              size={20}
              color={isSelected ? '#000' : '#FF6B35'}
            />
            <Text
              style={[
                styles.categoryLabel,
                isSelected && styles.selectedCategoryLabel,
              ]}
            >
              {category.label}
            </Text>
          </View>
          <Text
            style={[
              styles.categoryDescription,
              isSelected && styles.selectedCategoryDescription,
            ]}
          >
            {category.description}
          </Text>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={20} color="#000" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {RANKING_CATEGORIES.map(renderCategoryItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    minWidth: 140,
    maxWidth: 160,
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
  },
  selectedCategoryItem: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryContent: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  selectedCategoryLabel: {
    color: '#000',
  },
  categoryDescription: {
    color: '#999',
    fontSize: 12,
    lineHeight: 16,
  },
  selectedCategoryDescription: {
    color: '#000',
    opacity: 0.8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default RankingCategorySelector;
