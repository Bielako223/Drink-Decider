import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ScrollView, Text, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from '../styles';
import { ThemeContext } from "../../ThemeContext";
import DrinkItem from '../DrinkItem';
import { GetRandomDrink } from '../DataManagment/DataAccess';
import { DrinkFull } from '../DataManagment/Classes';
import { SafeAreaView } from "react-native-safe-area-context";

function RandomDrinkScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const [randomDrink, setRandomDrink] = useState<DrinkFull | null>(null);
  
  // Opcjonalnie: dedykowany stan ładowania jest lepszą praktyką niż sprawdzanie samego null
  const [isLoading, setIsLoading] = useState(true);

  // OPTYMALIZACJA: useCallback
  const loadRandomDrink = useCallback(async () => {
    setIsLoading(true);
    try {
      const lang = t('Lang') === 'pl' ? 'pl' : 'eng';
      const drink = await GetRandomDrink(lang);
      setRandomDrink(drink);
    } catch (error) {
      console.error("Błąd przy losowaniu drinka:", error);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    // OPTYMALIZACJA: Zabezpieczenie przed aktualizacją odmontowanego komponentu
    let isMounted = true;

    const initLoad = async () => {
      setIsLoading(true);
      try {
        const lang = t('Lang') === 'pl' ? 'pl' : 'eng';
        const drink = await GetRandomDrink(lang);
        if (isMounted) {
          setRandomDrink(drink);
        }
      } catch (error) {
        console.error("Błąd przy losowaniu drinka:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initLoad();

    // Cleanup function - uruchomi się, gdy użytkownik wyjdzie z ekranu
    return () => {
      isMounted = false;
    };
  }, [t]);

  if (isLoading || !randomDrink) {
    return (
      <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
        <Text style={[styles.topText, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
          {t('Loading')}...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
      <ScrollView>
        <Text style={[styles.topText, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
          {t('RandomDrinkText')}
        </Text>

        <DrinkItem drink={randomDrink} />

        <View style={styles.finalDrinkbuttonContainer}>
          <Pressable
            style={[styles.startButton, theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode, { marginBottom: 15 }]}
            onPress={loadRandomDrink} // Podpięcie naszej funkcji z useCallback
          >
            <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('RandomDrinkTryAgain')}</Text>
          </Pressable>

          <Pressable
            style={[styles.startButton, theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode]}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('ButtonTextBack')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RandomDrinkScreen;