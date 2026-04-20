import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { FlatList, TextInput, View, Text, Pressable } from 'react-native';
import DrinkItemSimple from '../DrinkItemSimple';
import DrinkItem from '../DrinkItem';
import { DrinkSimple, DrinkFull } from '../DataManagment/Classes';
import { GetDrinksBasic, GetDrinkById } from '../DataManagment/DataAccess';
import { ThemeContext } from '../../ThemeContext';
import styles from '../styles';
import { useTranslation } from 'react-i18next';
import { FontAwesome } from "@expo/vector-icons";
import { useFavorites } from "../FavoriteContext";
import { SafeAreaView } from "react-native-safe-area-context";

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
      try {
        const lang = t('Lang') === 'pl' ? 'pl' : 'eng';
        const data = await GetDrinksBasic(lang);
        setDrinks(data.map(d => new DrinkSimple(d.id, d.name, d.img ?? '', d.range ?? '')));
      } catch (err) {
        console.error("Błąd przy pobieraniu listy drinków:", err);
      }
    })();
  }, [t]);

  const handlePress = useCallback(async (drink: DrinkSimple) => {
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
  }, [activeDrinkId, t]);

  // OPTYMALIZACJA: toLowerCase zrobione RAZ przed wejściem w pętlę filtrującą
  const filteredDrinks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return drinks.filter(d =>
      (showFavorites ? favoriteIds.includes(d.id) : true) &&
      d.name.toLowerCase().includes(query)
    );
  }, [drinks, searchQuery, showFavorites, favoriteIds]);

  // OPTYMALIZACJA: renderItem wydzielony do useCallback
  const renderItem = useCallback(({ item }: { item: DrinkSimple }) => {
    const isActive = activeDrinkId === item.id;
    
    if (isActive && activeDrink) {
      return <DrinkItem drink={activeDrink} onPress={() => handlePress(item)} />;
    }
    
    return <DrinkItemSimple drink={item} onPress={() => handlePress(item)} />;
  }, [activeDrinkId, activeDrink, handlePress]);

  // USUNIĘTO: getItemLayout - jeśli elementy rozwijają się po kliknięciu i zmieniają 
  // swoją wysokość, narzucanie im stałej wysokości (100) psuje system wirtualizacji FlatList!

  return (
    <SafeAreaView
      style={[
        styles.container,
        theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode
      ]}
    >
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
        <FontAwesome name="heart" size={16} color="white" style={{ marginRight: 6 }} />
        <Text style={{ color: "white" }}>{showFavorites ? t('Showall') : t('favorites')}</Text>
      </Pressable>

      <FlatList
        data={filteredDrinks}
        extraData={activeDrinkId} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        // DODANO: Flagi wydajnościowe FlatList
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' }}>
        <Pressable
          style={[
            styles.startButton,
            theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>
            {t('ButtonTextBack')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default DrinkListScreen;