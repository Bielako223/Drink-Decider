import React, { useState, useEffect, useContext } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
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

  let route: RouteProp<{ params: { alcohols: string[]; ingredients: string[] } }, "params"> = useRoute();

  const alcohols = React.useMemo(() => (route.params?.alcohols ?? []).map(id => Number(id)), [route.params?.alcohols]);
  const ingredients = React.useMemo(() => (route.params?.ingredients ?? []).map(id => Number(id)), [route.params?.ingredients]);

  const [drinks, setDrinks] = useState<DrinkFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);

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
  }, [alcohols, ingredients, t]);

  const handlePress = (index: number) => {
    setActiveIndex(prev => (prev === index ? -1 : index));
  };

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
      <ScrollView>
        {loading ? (
          <Text style={styles.noDrinksText}>{t("Loading")}...</Text>
        ) : drinks.length === 0 ? (
          <Text style={styles.noDrinksText}>{t("MyIngrednietsNoneMessage")}</Text>
        ) : (
          <View>
            <Text style={[styles.topText, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
              {t("drinksfromyoursingredients")}
            </Text>

            {drinks.map((drink, index) =>
              activeIndex === index ? (
                <DrinkItem
                  key={drink.id}
                  drink={drink}
                  matchPercentage={drink.percentage}
                  points={drink.points}
                  maxPoints={drink.maxPoints}
                  onPress={() => handlePress(index)}
                />
              ) : (
                <DrinkItemSimple
                  key={drink.id}
                  drink={drink}
                  matchPercentage={drink.percentage}
                  points={drink.points}
                  maxPoints={drink.maxPoints}
                  onPress={() => handlePress(index)}
                />
              )
            )}
          </View>
        )}

        <View style={styles.finalDrinkbuttonContainer}>
          <Pressable
            style={[styles.startButton, theme === "dark" ? styles.bottomButtonDarkMode : styles.buttonWhiteMode]}
            onPress={() => navigation.navigate("Main")}
          >
            <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t("DrinkTryAgain")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


export default MyIngredientsResutScreen;
