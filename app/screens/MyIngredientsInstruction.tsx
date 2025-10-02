import React, {useContext} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from '../styles';
import { ThemeContext } from "../../ThemeContext";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; // nowa wersja


const WelcomeScreen = ({ navigation }: { navigation: any }) => {
    const { t } = useTranslation();
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
   const { theme } = themeContext;
    return (
      <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
        <View style={styles.containerInstruction}>
          <Text style={[styles.instructionTextTop, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
              {t('WelcomeDescription')}
          </Text>
          <View>
            <Text style={[styles.instructionTextList, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>{t('Step1')}</Text>
            <Text style={[styles.instructionTextList, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>{t('Step2')}</Text>
            <Text style={[styles.instructionTextList, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>{t('Step3')}</Text>
            <View style={styles.iconscontainer}>
            <Text style={[styles.iconstext, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
            <MaterialCommunityIcons name="liquor" size={50} color={theme === "dark" ? "white" : "black"} />
            {'\u00A0'}+{'\u00A0'}
            <FontAwesome5Icon name="lemon" size={50} color="#FFC107" />
            <MaterialCommunityIcons name="fruit-cherries" size={50} color="red" />
            <MaterialCommunityIcons name="leaf" size={50} color="green" />
            {'\u00A0'}={'\u00A0'}
            <FontAwesome5Icon name="glass-martini-alt" size={50} color={theme === "dark" ? "white" : "black"} />
            </Text>
            </View>
          </View>
        </View>
  
        
          <Pressable style={[styles.button, theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode]} onPress={() => navigation.goBack()}  android_ripple={{ color: 'transparent' }}>
            <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('ButtonTextBack')}</Text>
          </Pressable>
          <Pressable style={[styles.button2, theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode]} onPress={() => navigation.navigate("MyIngredientsAlcohol")}  android_ripple={{ color: 'transparent' }}>
            <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('ButtonTextNext')}</Text>
          </Pressable>
      </SafeAreaView>
    );
  };
  export default WelcomeScreen;