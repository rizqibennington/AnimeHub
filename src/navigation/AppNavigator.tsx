import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AnimeDetailsScreen from '../screens/AnimeDetailsScreen';
import AnimeListScreen from '../screens/AnimeListScreen';
import SeasonalScreen from '../screens/SeasonalScreen';
import RankingsScreen from '../screens/RankingsScreen';
import GenreScreen from '../screens/GenreScreen';

import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Tab Navigator Component
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Rankings') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Seasonal') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35', // Anime orange
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#333',
        },
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'AnimeHub',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
        }}
      />
      <Tab.Screen
        name="Rankings"
        component={RankingsScreen}
        options={{
          title: 'Rankings',
        }}
      />
      <Tab.Screen
        name="Seasonal"
        component={SeasonalScreen}
        options={{
          title: 'Seasonal',
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: {
            backgroundColor: '#000',
          },
        }}
      >
        {/* Tab Navigator as the main screen */}
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        
        {/* Detail Screens */}
        <Stack.Screen
          name="AnimeDetails"
          component={AnimeDetailsScreen}
          options={{
            title: 'Anime Details',
            headerBackTitleVisible: false,
          }}
        />

        {/* List Screens */}
        <Stack.Screen
          name="AnimeList"
          component={AnimeListScreen}
          options={({ route }) => ({
            title: `${route.params.category.replace('_', ' ').toUpperCase()} Anime`,
            headerBackTitleVisible: false,
          })}
        />

        {/* Additional Screens */}
        <Stack.Screen
          name="Genres"
          component={GenreScreen}
          options={{
            title: 'Browse by Genre',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
