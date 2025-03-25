import React, { useEffect, useState, useCallback, } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, Image, InteractionManager } from 'react-native';
import { useLocalSearchParams, useFocusEffect, Stack } from 'expo-router';
import axios from 'axios';
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from "@/constants/Colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('screen');

type Post = {
  id: number;
  title: string;
  body: string;
  featured_image: string;
  created_at: string;
  categories: [{
    id: number;
    name: string;
  }];
  author: {
    id: number,
    name: string,
    email: string,
  }
};

const NewsDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  headerImage: {
    width: 150,
    height: 40,
    alignSelf: 'center',
  },
  screen: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    letterSpacing: 0.6,
  },
  newsImg: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  newsInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  newsInfo: {
    fontSize: 12,
  },
  noPosts: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    padding: 20,
    borderRadius: 10,
  },
});
