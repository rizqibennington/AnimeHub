import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimeFilters } from '../types';
import { ANIME_CONSTANTS } from '../constants/api';

interface SearchFiltersProps {
  filters: AnimeFilters;
  onFiltersChange: (filters: AnimeFilters) => void;
  onApplyFilters: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempFilters, setTempFilters] = useState<AnimeFilters>(filters);

  const handleFilterChange = (key: keyof AnimeFilters, value: any) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    onApplyFilters();
    setModalVisible(false);
  };

  const clearFilters = () => {
    const clearedFilters: AnimeFilters = {};
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onApplyFilters();
    setModalVisible(false);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => filters[key as keyof AnimeFilters]).length;
  };

  const renderFilterOption = (
    title: string,
    options: { key: string; label: string }[],
    selectedValue: string | undefined,
    filterKey: keyof AnimeFilters
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            !selectedValue && styles.selectedOption,
          ]}
          onPress={() => handleFilterChange(filterKey, undefined)}
        >
          <Text
            style={[
              styles.optionText,
              !selectedValue && styles.selectedOptionText,
            ]}
          >
            Any
          </Text>
        </TouchableOpacity>
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionButton,
              selectedValue === option.key && styles.selectedOption,
            ]}
            onPress={() => handleFilterChange(filterKey, option.key)}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option.key && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSortOption = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>Sort By</Text>
      <View style={styles.optionsContainer}>
        {[
          { key: 'score', label: 'Score' },
          { key: 'popularity', label: 'Popularity' },
          { key: 'start_date', label: 'Release Date' },
          { key: 'title', label: 'Title' },
          { key: 'episodes', label: 'Episodes' },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionButton,
              tempFilters.orderBy === option.key && styles.selectedOption,
            ]}
            onPress={() => handleFilterChange('orderBy', option.key)}
          >
            <Text
              style={[
                styles.optionText,
                tempFilters.orderBy === option.key && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Sort Direction */}
      <View style={styles.sortDirectionContainer}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            (!tempFilters.sort || tempFilters.sort === 'desc') && styles.selectedSort,
          ]}
          onPress={() => handleFilterChange('sort', 'desc')}
        >
          <Ionicons name="arrow-down" size={16} color="#fff" />
          <Text style={styles.sortText}>Descending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            tempFilters.sort === 'asc' && styles.selectedSort,
          ]}
          onPress={() => handleFilterChange('sort', 'asc')}
        >
          <Ionicons name="arrow-up" size={16} color="#fff" />
          <Text style={styles.sortText}>Ascending</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="options" size={20} color="#fff" />
        <Text style={styles.filterButtonText}>Filters</Text>
        {getActiveFiltersCount() > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Filters</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
              {renderFilterOption(
                'Type',
                ANIME_CONSTANTS.ANIME_TYPES,
                tempFilters.type,
                'type'
              )}

              {renderFilterOption(
                'Status',
                ANIME_CONSTANTS.STATUS_TYPES,
                tempFilters.status,
                'status'
              )}

              {renderFilterOption(
                'Rating',
                [
                  { key: 'g', label: 'G - All Ages' },
                  { key: 'pg', label: 'PG - Children' },
                  { key: 'pg13', label: 'PG-13 - Teens 13+' },
                  { key: 'r17', label: 'R - 17+' },
                  { key: 'r', label: 'R+ - Mild Nudity' },
                ],
                tempFilters.rating,
                'rating'
              )}

              {renderSortOption()}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  filterBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  filtersContainer: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedOption: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  sortDirectionContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  selectedSort: {
    backgroundColor: '#FF6B35',
  },
  sortText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchFilters;
