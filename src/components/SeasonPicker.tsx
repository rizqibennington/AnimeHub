import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SeasonPickerProps {
  selectedYear: number;
  selectedSeason: string;
  onSeasonChange: (year: number, season: string) => void;
}

const { width } = Dimensions.get('window');

const SEASONS = [
  { key: 'winter', label: 'Winter', icon: 'snow-outline' },
  { key: 'spring', label: 'Spring', icon: 'flower-outline' },
  { key: 'summer', label: 'Summer', icon: 'sunny-outline' },
  { key: 'fall', label: 'Fall', icon: 'leaf-outline' },
];

const SeasonPicker: React.FC<SeasonPickerProps> = ({
  selectedYear,
  selectedSeason,
  onSeasonChange,
}) => {
  const [showYearModal, setShowYearModal] = useState(false);
  const [showSeasonModal, setShowSeasonModal] = useState(false);

  // Generate years from 1970 to current year + 1
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i + 1);

  const getSeasonLabel = (season: string) => {
    const seasonObj = SEASONS.find(s => s.key === season);
    return seasonObj ? seasonObj.label : season;
  };

  const getSeasonIcon = (season: string) => {
    const seasonObj = SEASONS.find(s => s.key === season);
    return seasonObj ? seasonObj.icon : 'calendar-outline';
  };

  const handleYearSelect = (year: number) => {
    setShowYearModal(false);
    onSeasonChange(year, selectedSeason);
  };

  const handleSeasonSelect = (season: string) => {
    setShowSeasonModal(false);
    onSeasonChange(selectedYear, season);
  };

  const renderYearItem = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        item === selectedYear && styles.selectedModalItem,
      ]}
      onPress={() => handleYearSelect(item)}
    >
      <Text
        style={[
          styles.modalItemText,
          item === selectedYear && styles.selectedModalItemText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderSeasonItem = ({ item }: { item: typeof SEASONS[0] }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        item.key === selectedSeason && styles.selectedModalItem,
      ]}
      onPress={() => handleSeasonSelect(item.key)}
    >
      <View style={styles.seasonItemContent}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={item.key === selectedSeason ? '#000' : '#FF6B35'}
        />
        <Text
          style={[
            styles.modalItemText,
            item.key === selectedSeason && styles.selectedModalItemText,
          ]}
        >
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Season</Text>
      
      <View style={styles.pickerContainer}>
        {/* Year Picker */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowYearModal(true)}
        >
          <Text style={styles.pickerButtonText}>{selectedYear}</Text>
          <Ionicons name="chevron-down" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Season Picker */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowSeasonModal(true)}
        >
          <View style={styles.seasonButtonContent}>
            <Ionicons
              name={getSeasonIcon(selectedSeason) as any}
              size={20}
              color="#FF6B35"
            />
            <Text style={styles.pickerButtonText}>{getSeasonLabel(selectedSeason)}</Text>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Year Modal */}
      <Modal
        visible={showYearModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Year</Text>
              <TouchableOpacity onPress={() => setShowYearModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={years}
              renderItem={renderYearItem}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              getItemLayout={(data, index) => ({
                length: 50,
                offset: 50 * index,
                index,
              })}
              initialScrollIndex={years.findIndex(year => year === selectedYear)}
            />
          </View>
        </View>
      </Modal>

      {/* Season Modal */}
      <Modal
        visible={showSeasonModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSeasonModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Season</Text>
              <TouchableOpacity onPress={() => setShowSeasonModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={SEASONS}
              renderItem={renderSeasonItem}
              keyExtractor={(item) => item.key}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerButton: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  pickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  seasonButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedModalItem: {
    backgroundColor: '#FF6B35',
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedModalItemText: {
    color: '#000',
    fontWeight: 'bold',
  },
  seasonItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SeasonPicker;
