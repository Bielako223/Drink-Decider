import React, { useCallback, useContext, useState } from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import { useFocusEffect, useRoute } from "@react-navigation/native";
import styles from '../styles';
import { useTranslation } from 'react-i18next';
import ChangeLang from '../ChangeLanguage';
import { ThemeContext } from "../../ThemeContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context"; // nowa wersja


function MainScreen({ navigation }: { navigation: any }) {

  let route = useRoute();
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;
  const { theme, toggleTheme } = themeContext;

  return (
    <SafeAreaView
      style={[
        styles.container,
        theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode
      ]}
    >
      <View style={styles.imgContainer}>
        <View style={styles.changeLanguageContainer}>
  <View style={styles.langRow}>
    <ChangeLang />
    <Pressable onPress={toggleTheme} style={styles.mt}>
      {theme === 'dark' ? (
        <MaterialCommunityIcons name="invert-colors" size={40} color="#FFF" />
      ) : (
        <MaterialCommunityIcons name="invert-colors" size={40} color="#000" />
      )}
    </Pressable>
  </View>
</View>

        {theme === 'dark' ? (
          <Image source={require('../assets/barIcon7.png')} style={styles.image} />
        ) : (
          <Image source={require('../assets/barIcon6.png')} style={styles.image} />
        )}

        <Pressable
          style={[
            styles.startButton,
            theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode
          ]}
          onPress={() => navigation.navigate("Taste")}
          android_ripple={{ color: 'black' }}
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('MainfirstButton')}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.startButton,
            theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode
          ]}
          onPress={() => navigation.navigate("RandomDrink")}
          android_ripple={{ color: 'black' }}
        >
          <Text  style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('MainSecondButton')}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.startButton,
            theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode
          ]}
          onPress={() => navigation.navigate("DrinkList")}
          android_ripple={{ color: 'black' }}
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('MainThirdButton')}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.startButton,
            theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode
          ]}
          onPress={() => navigation.navigate("WelcomeScreen")}
          android_ripple={{ color: 'black' }}
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('MainFourthButton')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default MainScreen;
