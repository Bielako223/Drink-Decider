import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './app/screens/MainScreen';
import DrinkScreen from './app/screens/DrinkScreen';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import TasteScreen from './app/screens/TasteScreen';
import AlcoholScreen from './app/screens/AlcoholScreen';
import StrengthScreen from './app/screens/StrengthScreen';
import IngredientsScreen from './app/screens/IngredientsScreen';
import RandomDrinkScreen from './app/screens/RandomDrinkScreen';
import DrinkListScreen from './app/screens/DrinkListScreen';
import MyIngredientsAlcoholScreen from './app/screens/MyIngredientsAlcoholScreen';
import MyIngredientsIngredientsScreen from './app/screens/MyIngredientsIngredientsScreen';
import MyIngredientsResutScreen from './app/screens/MyIngredientsResutScreen';
import DrinkDetailsScreen from './app/screens/DrinkDetailsScreen';
import WelcomeScreen from './app/screens/MyIngredientsInstruction';
import { I18nextProvider } from 'react-i18next';
import i18next from './services/i18next';
import { ThemeProvider, ThemeContext } from "./ThemeContext";
import React, { useContext, useEffect } from 'react';
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { FavoriteProvider } from './app/FavoriteContext';

const Stack = createNativeStackNavigator();

function AppContent() {

  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  const { theme } = themeContext;

  return (
    <>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={theme === "dark" ? "#050712" : "white"} />
      <FavoriteProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Main'>
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Taste" component={TasteScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Alcohol" component={AlcoholScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Strength" component={StrengthScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Ingredients" component={IngredientsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Drink" component={DrinkScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RandomDrink" component={RandomDrinkScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DrinkList" component={DrinkListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MyIngredientsAlcohol" component={MyIngredientsAlcoholScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MyIngredientsIngredients" component={MyIngredientsIngredientsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MyIngredientsResut" component={MyIngredientsResutScreen} options={{ headerShown: false }} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DrinkDetails" component={DrinkDetailsScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
      </FavoriteProvider>
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium
  });
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18next}>
        <AppContent />
      </I18nextProvider>
    </ThemeProvider>
  );
}

