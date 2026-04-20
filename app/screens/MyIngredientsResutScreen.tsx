import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Text, View, Pressable, FlatList } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import styles from "../styles";
import { useTranslation } from "react-i18next";
import { DrinkFull } from "../DataManagment/Classes";
import { MyIngredientsGetDrinks } from "../DataManagment/DataAccess";
import { ThemeContext } from "../../ThemeContext";
import DrinkItem from "../DrinkItem";
import DrinkItemSimple from "../DrinkItemSimple";
import { SafeAreaView } from "react-native-safe-area-context";

function MyIngredientsResutScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  // OPTYMALIZACJA: Poprawiony typ na number[], zgodnie z tym co wysyłają poprzednie ekrany
  let route: RouteProp<{ params: { alcohols: number[]; ingredients: number[] } }, "params"> = useRoute();

  const alcohols = route.params?.alcohols ?? [];
  const ingredients = route.params?.ingredients ?? [];

  const [drinks, setDrinks] = useState<DrinkFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // OPTYMALIZACJA: Zmieniamy tablice na proste stringi, żeby useEffect nie głupiał przy porównywaniu
  const alcoholsKey = useMemo(() => alcohols.join(','), [alcohols]);
  const ingredientsKey = useMemo(() => ingredients.join(','), [ingredients]);

  useEffect(() => {
    let isMounted = true; 

    const loadDrinks = async () => {
      setLoading(true);
      try {
        const lang = t("Lang") === "pl" ? "pl" : "eng";
        const results = await MyIngredientsGetDrinks(alcohols, ingredients, lang);
        if (isMounted) setDrinks(results);
      } catch (err) {
        console.error("[MyIngredientsResutScreen] error loading drinks:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDrinks();

    return () => {
      isMounted = false;
    };
  }, [alcoholsKey, ingredientsKey, t]); // Bezpieczne zależności

  // OPTYMALIZACJA: useCallback dla obsługi kliknięć
  const handlePress = useCallback((index: number) => {
    setActiveIndex(prev => (prev === index ? -1 : index));
  }, []);

  // OPTYMALIZACJA: Renderowanie pojedynczego elementu (wyciągnięte z FlatList)
  const renderItem = useCallback(({ item, index }: { item: DrinkFull, index: number }) => {
    const isActive = activeIndex === index;
    
    if (isActive) {
      return (
        <DrinkItem
          drink={item}
          matchPercentage={item.percentage}
          points={item.points}
          maxPoints={item.maxPoints}
          onPress={() => handlePress(index)}
        />
      );
    }
    
    return (
      <DrinkItemSimple
        drink={item}
        matchPercentage={item.percentage}
        points={item.points}
        maxPoints={item.maxPoints}
        onPress={() => handlePress(index)}
      />
    );
  }, [activeIndex, handlePress]);

  // NAGŁÓWEK LISTY
  const renderHeader = () => (
    <Text style={[styles.topText, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
      {t("drinksfromyoursingredients")}
    </Text>
  );

  // STOPKA LISTY
  const renderFooter = () => (
    <View style={styles.finalDrinkbuttonContainer}>
      <Pressable
        style={[styles.startButton, theme === "dark" ? styles.bottomButtonDarkMode : styles.buttonWhiteMode]}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t("DrinkTryAgain")}</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
      {loading ? (
        <Text style={styles.noDrinksText}>{t("Loading")}...</Text>
      ) : drinks.length === 0 ? (
        <View>
          <Text style={styles.noDrinksText}>{t("MyIngrednietsNoneMessage")}</Text>
          {renderFooter()}
        </View>
      ) : (
        // OPTYMALIZACJA: FlatList zamiast ScrollView
        <FlatList
          data={drinks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          extraData={activeIndex}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          initialNumToRender={5}
          windowSize={5}
          maxToRenderPerBatch={5}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

export default MyIngredientsResutScreen;