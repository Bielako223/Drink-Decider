import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, FlatList, TextInput, View, Text, Pressable } from 'react-native';
import DrinkItemSimple from '../DrinkItemSimple';
import DrinkItem from '../DrinkItem';
import { DrinkSimple, DrinkFull } from '../DataManagment/Classes';
import { GetDrinksBasic, GetDrinkById } from '../DataManagment/DataAccess';
import { ThemeContext } from '../../ThemeContext';
import styles from '../styles';
import { useTranslation } from 'react-i18next';
import Icon from "react-native-vector-icons/FontAwesome";
import { useFavorites } from "../FavoriteContext";

function DrinkListScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const [drinks, setDrinks] = useState<DrinkSimple[]>([]);
  const [activeDrink, setActiveDrink] = useState<DrinkFull | null>(null);
  const [activeDrinkId, setActiveDrinkId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { favoriteIds } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    (async () => {
      const lang = t('Lang') === 'pl' ? 'pl' : 'eng';
      const data = await GetDrinksBasic(lang);
      setDrinks(data.map(d => new DrinkSimple(d.id, d.name, d.img ?? '', d.range ?? '')));
    })();
  }, [t]);

  const handlePress = async (drink: DrinkSimple) => {
    if (activeDrinkId === drink.id) {
      setActiveDrinkId(null);
      setActiveDrink(null);
    } else {
      const lang = t('Lang') === 'pl' ? 'pl' : 'eng';
      const fullDrink = await GetDrinkById(drink.id, lang);
      if (fullDrink) {
        setActiveDrink(fullDrink);
        setActiveDrinkId(drink.id);
      }
    }
  };

  // Filtrowanie
  const filteredDrinks = drinks.filter(d =>
    (showFavorites ? favoriteIds.includes(d.id) : true) &&
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode
      ]}
    >
      {/* 🔍 Pole wyszukiwania */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode
          ]}
          placeholder={t('SearchPlaceholder')}
          placeholderTextColor={theme === "dark" ? 'white' : 'black'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* ❤️ Przycisk ULUBIONE */}
      <Pressable
        style={{
  margin: 8,
  padding: 10,
  borderRadius: 8,
  backgroundColor: showFavorites ? "red" : (theme === "dark" ? "#3b3b3bff" : "#ddd"),
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}}
        onPress={() => setShowFavorites(prev => !prev)}
      >
        <Icon name="heart" size={16} color="white" style={{ marginRight: 6 }} />
        <Text style={{ color: "white" }}>{showFavorites ? t('Showall') : t('favorites')}</Text>
      </Pressable>

      {/* 📋 Lista drinków */}
      <FlatList
        data={filteredDrinks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) =>
          activeDrinkId === item.id && activeDrink ? (
            <DrinkItem drink={activeDrink} onPress={() => handlePress(item)} />
          ) : (
            <DrinkItemSimple drink={item} onPress={() => handlePress(item)} />
          )
        }
        contentContainerStyle={{ paddingBottom: 100 }} // żeby lista nie nachodziła na przycisk
      />

      {/* 🔙 Przycisk Back – na stałe na dole */}
      <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' }}>
  <Pressable
    style={[
      styles.startButton,
      theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode
    ]}
    onPress={() => navigation.navigate('Main')}
  >
    <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('ButtonTextBack')}</Text>
  </Pressable>
</View>
    </SafeAreaView>
  );
}

export default DrinkListScreen;
