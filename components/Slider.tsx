import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View, ViewToken } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/constants/ThemeContext';
import { DarkColors, LightColors } from "@/constants/Colors";
import SliderItem from '@/components/SliderItem'
import Animated, { scrollTo, useAnimatedRef, useAnimatedScrollHandler, useDerivedValue, useSharedValue } from 'react-native-reanimated'
import Pagination from '@/components/Pagination'
import { useAuth } from '@/constants/userContext';
import apiClient from '@/constants/apiClient';
import { useLanguage } from '@/hook/LanguageContext';


type Props = {
  campaigns: Array<Campaigns>
}

type Campaigns = {
  id: number;
  ngo_id: number;
  title: string;
  description: string;
  goal_amount: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  featured_image: string;
  category_id: number;
  ngo: {
    id: number;
    name: string;
  }
  category: {
    id: number;
    name: string;
  }
};


const CampaignSlider = ({ campaigns }: Props) => {
  const [data, setData] = useState(campaigns);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const ref = useAnimatedRef<Animated.FlatList<any>>();
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const interval = useRef<NodeJS.Timeout>();
  const offset = useSharedValue(0);
  const { width } = useWindowDimensions();

  const { isDarkMode } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  const { i18n } = useLanguage();

  const [modalVisible, setModalVisible] = useState(false);
  const { accessToken } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
    onMomentumEnd: (e) => {
      offset.value = e.contentOffset.x
    }
  });

  useEffect(() => {
    if (isAutoPlay === true) {
      interval.current = setInterval(() => {
        offset.value = offset.value + width;
      }, 5000);
    }
    else {
      clearInterval(interval.current);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [isAutoPlay, offset, width]);

  useDerivedValue(() => {
    scrollTo(ref, offset.value, 0, true);
  });

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }
  ) => {
    if (viewableItems[0].index !== undefined &&
      viewableItems[0].index !== null) {
      setPaginationIndex(viewableItems[0].index % campaigns.length)
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig, onViewableItemsChanged
    }
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.slideWrapper}>
          {data.length === 0 ? (
            <Text style={{ color: currentColors.darkGrey, textAlign: 'center', padding: 20 }}>
              {i18n.t('noCampaign')}
            </Text>
          ) : (
            <>
              <Animated.FlatList
                ref={ref}
                data={data}
                renderItem={({ item, index }) => (
                  <SliderItem slideItem={item} index={index} scrollX={scrollX} />
                )}
                keyExtractor={(item, index) => `list_item_${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScrollHandler}
                scrollEventThrottle={16}
                onEndReachedThreshold={0.5}
                onEndReached={() => setData([...data, ...campaigns])}
                viewabilityConfigCallbackPairs={
                  viewabilityConfigCallbackPairs.current
                }
                onScrollBeginDrag={() => {
                  setIsAutoPlay(false);
                }}
                onScrollEndDrag={() => {
                  setIsAutoPlay(true);
                }}
              />

            </>)}
        </View>
      </View>
    </View>
  );
}

export default CampaignSlider

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    //color: Colors.black,
    paddingTop: 20,
    marginBottom: 10,
    paddingLeft: 20
  },
  slideWrapper: {
    //flex: 1,
    justifyContent: 'center',
    //paddingTop: 30
  },
})