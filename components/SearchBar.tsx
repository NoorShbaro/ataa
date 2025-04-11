import { StyleSheet, TextInput, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type Props = {
  setSearchQuery: Function,
  onSubmitSearch: () => void
};

const SearchBar = ({ setSearchQuery, onSubmitSearch }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name='search-outline' size={20} color={Colors.lightGrey} />
        <TextInput
          placeholder='Search'
          placeholderTextColor={Colors.lightGrey}
          style={styles.searchTxt}
          autoCapitalize='none'
          onChangeText={query => setSearchQuery(query)}
          onSubmitEditing={onSubmitSearch}
        />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  searchBar: {
    backgroundColor: '#E4E4E4',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  searchTxt: {
    fontSize: 16,
    flex: 1,
    color: Colors.darkGrey,
  },
});
