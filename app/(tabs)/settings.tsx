import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
 import { Link } from 'expo-router'; 
import { DarkColors, LightColors } from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function Settings() {

  const { isDarkMode, toggleTheme } = useTheme();
  const currentColors = isDarkMode ? DarkColors : LightColors;
  
  return (
    <View style={[styles.container, {backgroundColor: currentColors.background}]}>
      <ScrollView style={{ backgroundColor: currentColors.background }}>
        <View
          style={styles.container}>
          <Link href={`/settings/about`} asChild style={[styles.itemBtn,
          { backgroundColor: currentColors.mainColorWithOpacity },
          { borderBottomColor: currentColors.background, }
          ]}>
            <TouchableOpacity>
              <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>About</Text>
              <MaterialIcons name="arrow-forward-ios"
                size={16}
                color={currentColors.mainColor}
              />
            </TouchableOpacity>
          </Link>
          <Link href={`/settings/privacy`} asChild style={[styles.itemBtn,
          { backgroundColor: currentColors.mainColorWithOpacity },
          { borderBottomColor: currentColors.background, }
          ]}>
            <TouchableOpacity>
              <Text style={[styles.itemBtnText,
              { color: currentColors.mainColor }]}>
                Privacy Policy</Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color={currentColors.mainColor}
              />
            </TouchableOpacity>
          </Link>
          <Link href={`/settings/termofuse`} asChild style={[styles.itemBtn,
          { backgroundColor: currentColors.mainColorWithOpacity },
          { borderBottomColor: currentColors.background, }
          ]}>
            <TouchableOpacity>
              <Text style={[styles.itemBtnText,
              { color: currentColors.mainColor }]}>Terms of Use</Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color={currentColors.mainColor}
              />
            </TouchableOpacity>
          </Link>
          <Link href={`/settings/notifications`} asChild style={[styles.itemBtn,
          { backgroundColor: currentColors.mainColorWithOpacity },
          { borderBottomColor: currentColors.background, }
          ]}>
            <TouchableOpacity>
              <Text style={[styles.itemBtnText, { color: currentColors.mainColor }]}>Notification</Text>
              <MaterialIcons name="arrow-forward-ios"
                size={16}
                color={currentColors.mainColor}
              />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            style={[styles.itemBtn,
            { backgroundColor: currentColors.mainColorWithOpacity },
            { borderBottomColor: currentColors.background, }
            ]}
            onPress={toggleTheme}>
            <Text style={[styles.itemBtnText,
            { color: currentColors.mainColor }]}>Dark Mode</Text>
            <Switch
              thumbColor={currentColors.mainColor }
              onValueChange={toggleTheme}
              value={isDarkMode}
              style={{ transform: [{ scale: 0.8 }], marginBottom: -15, marginRight: -8 }}
            />

          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
      },
      container: {
        flex: 1,
        padding: 20,
      },
      itemBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
      },
      itemBtnText: {
        fontSize: 14,
        fontWeight: '500',
      },
      titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      subTitleText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
      },
      itemText: {
        fontSize: 14,
        fontWeight: '300',
        lineHeight: 20,
      },
      highlight: {
        fontWeight: '600',
        textDecorationLine: 'underline',
      },
      instructionContainer: {
        marginBottom: 20,
      },
});
