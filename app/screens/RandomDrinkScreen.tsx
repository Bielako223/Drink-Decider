import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, Text, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from '../styles';
import { ThemeContext } from "../../ThemeContext";
import DrinkItem from '../DrinkItem';
import { GetRandomDrink } from '../DataManagment/DataAccess';
import { DrinkFull } from '../DataManagment/Classes';

function RandomDrinkScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const [randomDrink, setRandomDrink] = useState<DrinkFull | null>(null);

  const loadRandomDrink = async () => {
    setRandomDrink(null); // efekt ładowania
    const drink = await GetRandomDrink(t('Lang') === 'pl' ? 'pl' : 'eng');
    setRandomDrink(drink);
  };

  useEffect(() => {
    loadRandomDrink();
  }, []);

  if (!randomDrink) {
    return (
      <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
        <Text style={styles.topText}>{t('Loading')}...</Text>
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
            onPress={loadRandomDrink}
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
