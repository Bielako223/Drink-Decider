import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { Text, View, Pressable, FlatList } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import styles from "../styles";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../ThemeContext";
import { DrinkFull } from "../DataManagment/Classes";
import DrinkItem from "../DrinkItem";
import DrinkItemSimple from "../DrinkItemSimple";
import { GetTopDrinks } from "../DataManagment/DataAccess";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Memoizacja elementów listy (najlepiej zrobić to w plikach DrinkItem / DrinkItemSimple)
const MemoizedDrinkItem = React.memo(DrinkItem);
const MemoizedDrinkItemSimple = React.memo(DrinkItemSimple);

function DrinkScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme;

  const route: RouteProp<
    { params: { taste: number[]; strength: number | null; alcohols: number[]; ingredients: number[] } },
    "params"
  > = useRoute();

  const { taste = [], strength = null, alcohols = [], ingredients = [] } = route.params ?? {};

  const [drinks, setDrinks] = useState<DrinkFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const lang = t("Lang") === "pl" ? "pl" : "eng";
        // Warto rozważyć memoizację parametrów wejściowych, jeśli pochodzą z zewnątrz
        const results = await GetTopDrinks(taste, strength, alcohols, ingredients, lang);
        setDrinks(results);
      } catch (err) {
        console.error("[DrinkScreen] error loading drinks:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [taste, strength, alcohols, ingredients, t]);

  // 2. useCallback zapobiega re-renderom dzieci przy zmianie stanu indexu
  const handlePress = useCallback((index: number) => {
    setActiveIndex(prev => (prev === index ? -1 : index));
  }, []);

  // 3. Renderowanie pojedynczego elementu
  const renderDrink = useCallback(({ item, index }: { item: DrinkFull; index: number }) => {
    const isSelected = activeIndex === index;
    const ItemComponent = isSelected ? MemoizedDrinkItem : MemoizedDrinkItemSimple;

    return (
      <View>
        {index === 1 && (
          <Text style={[
            styles.topText, 
            theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode,
            { marginTop: 16, marginBottom: 8 }
          ]}>
            {t("DrinkYouCanLike")}
          </Text>
        )}
        <ItemComponent
          drink={item}
          matchPercentage={item.percentage}
          onPress={() => handlePress(index)}
        />
      </View>
    );
  }, [activeIndex, handlePress, theme, t]);

  // Nagłówek i stopka listy dla FlatList
  const ListHeader = useMemo(() => (
    <Text style={[styles.topText, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
      {t("DrinkBestMatching")}
    </Text>
  ), [theme, t]);

  const ListFooter = useMemo(() => (
    <View style={styles.finalDrinkbuttonContainer}>
      <Pressable
        style={[styles.startButton, theme === "dark" ? styles.bottomButtonDarkMode : styles.buttonWhiteMode]}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>
          {t("DrinkTryAgain")}
        </Text>
      </Pressable>
    </View>
  ), [theme, t, navigation]);

  if (!themeContext) return null;

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
      {loading ? (
        <Text style={styles.noDrinksText}>{t("Loading")}...</Text>
      ) : drinks.length === 0 ? (
        <Text style={styles.noDrinksText}>{t("None")}</Text>
      ) : (
        <FlatList
          data={drinks}
          renderItem={renderDrink}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          // Optymalizacja wydajności FlatList
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}

export default DrinkScreen;