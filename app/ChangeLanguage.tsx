import React, { useState, useContext } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import i18next from '../services/i18next';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeContext } from "../ThemeContext";

// DODANE: Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'; 

function ChangeLang() {
  const [changeLanguage, setchangeLanguage] = useState(false);
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;
  const { t } = useTranslation();

  // DODANE: Funkcja zmieniająca język i zapisująca go do pamięci
  const handleLanguageChange = async (lang: 'pl' | 'en') => {
    i18next.changeLanguage(lang);
    setchangeLanguage(false);
    try {
      await AsyncStorage.setItem('user-language', lang);
    } catch (error) {
      console.error('Błąd podczas zapisywania języka:', error);
    }
  };

  return (
    <View style={styles.langContainer}>
      {!changeLanguage && (
        <TouchableOpacity style={styles.langContainer} onPress={() => setchangeLanguage(true)}>
          {theme === 'dark' ? (
            <MaterialCommunityIcons name="translate" size={40} color="#FFF" />
          ) : (
            <MaterialCommunityIcons name="translate" size={40} color="#000" />
          )}
        </TouchableOpacity>
      )}
      
      {changeLanguage && (
        <View style={styles.langContainer}>
          <View>
            <TouchableOpacity 
              style={styles.langflagContainer} 
              onPress={() => handleLanguageChange('en')} // ZMIENIONE
            >
              <Image source={require('../assets/img/eng.png')} style={{ width: 40, height: 20 }} />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity 
              style={styles.langflagContainer} 
              onPress={() => handleLanguageChange('pl')} // ZMIENIONE
            >
              <Image source={require('../assets/img/pl.png')} style={{ width: 40, height: 20 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default ChangeLang;