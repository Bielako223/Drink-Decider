import React, { useState, useContext, useEffect } from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import styles from "../styles";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../ThemeContext";
import { DrinkFull } from "../DataManagment/Classes";
import DrinkItem from "../DrinkItem";
import DrinkItemSimple from "../DrinkItemSimple";
import { GetTopDrinks } from "../DataManagment/DataAccess";
import { SafeAreaView } from "react-native-safe-area-context"; 


function DrinkScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  let route: RouteProp<
    { params: { taste: number[]; strength: number | null; alcohols: number[]; ingredients: number[] } },
    "params"
  > = useRoute();

  const taste = route.params?.taste ?? [];
  const strength = route.params?.strength ?? null;
  const alcohols = route.params?.alcohols ?? [];
  const ingredients = route.params?.ingredients ?? [];

  const [drinks, setDrinks] = useState<DrinkFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number>(0); 

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const lang = t("Lang") === "pl" ? "pl" : "eng";
        const results = await GetTopDrinks(taste, strength, alcohols, ingredients, lang);
        setDrinks(results);
      } catch (err) {
        console.error("[DrinkScreen] error loading drinks:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [taste, strength, alcohols, ingredients, t]);

  const handlePress = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(-1);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
      <ScrollView>
        {loading ? (
          <Text style={styles.noDrinksText}>{t("Loading")}...</Text>
        ) : drinks.length === 0 ? (
          <Text style={styles.noDrinksText}>{t("None")}</Text>
        ) : (
          <View>
            <Text
              style={[
                styles.topText,
                theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode,
              ]}
            >
              {t("DrinkBestMatching")}
            </Text>

            {drinks.map((drink, index) => (
              <React.Fragment key={drink.id}>
                {index === 1 && (
                  <Text
                    style={[
                      styles.topText,
                      theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode,
                      { marginTop: 16, marginBottom: 8 }
                    ]}
                  >
                    {t("DrinkYouCanLike")} 
                  </Text>
                )}

                {activeIndex === index ? (
                  <DrinkItem
                    drink={drink}
                    matchPercentage={drink.percentage}
                    onPress={() => handlePress(index)}
                  />
                ) : (
                  <DrinkItemSimple
                    drink={drink}
                    matchPercentage={drink.percentage}
                    onPress={() => handlePress(index)}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        )}

        <View style={styles.finalDrinkbuttonContainer}>
          <Pressable
            style={[
              styles.startButton,
              theme === "dark" ? styles.bottomButtonDarkMode : styles.buttonWhiteMode,
            ]}
            onPress={() => navigation.navigate("Main")}
          >
            <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t("DrinkTryAgain")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DrinkScreen;
