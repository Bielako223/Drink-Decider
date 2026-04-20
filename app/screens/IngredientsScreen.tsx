import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { FlatList, Text, TouchableOpacity, View, Pressable, TextInput } from 'react-native';
import { useRoute, RouteProp } from "@react-navigation/native";
import styles from '../styles';
import { useTranslation } from 'react-i18next';
import { BaseItem } from '../DataManagment/Classes';
import { GetIngredients } from '../DataManagment/DataAccess';
import { ThemeContext } from "../../ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; 
import SimplePopup from '../SimplePopup';

const IngredientsScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const [ingredients, setIngredients] = useState<BaseItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // OPTYMALIZACJA: Jeden stan dla pop-upu zamiast trzech osobnych
  const [popupConfig, setPopupConfig] = useState({ visible: false, title: "", message: "" });

  const [searchQuery, setSearchQuery] = useState('');

  let route: RouteProp<{ params: { taste: number[]; alcohols: number[]; strength: number } }, 'params'> = useRoute();
  const taste = route.params?.taste;
  const alcohols = route.params?.alcohols;
  const strength = route.params?.strength;

  useEffect(() => {
    (async () => {
      try {
        const lang = t('Lang') === 'pl' ? 'pl' : 'eng';
        const data = await GetIngredients(lang);
        data.sort((a, b) => a.name.localeCompare(b.name));
        setIngredients(data);
      } catch (err) {
        console.error("Błąd przy pobieraniu składników:", err);
      }
    })();
  }, [t]);

  // OPTYMALIZACJA: useCallback i aktualizacja funkcyjna
  const handleSelect = useCallback((id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  // OPTYMALIZACJA: toLowerCase wykonuje się raz, a nie w pętli dla każdego elementu
  const filteredIngredients = useMemo(() => {
    if (!searchQuery) return ingredients;
    const lowerQuery = searchQuery.toLowerCase();
    return ingredients.filter(i => i.name.toLowerCase().includes(lowerQuery));
  }, [ingredients, searchQuery]);

  // OPTYMALIZACJA: useCallback dla renderowania pojedynczego elementu listy
  const renderItem = useCallback(({ item }: { item: BaseItem }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 16,
          marginVertical: 8,
          overflow: "hidden",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => handleSelect(item.id)}
          style={[
            styles.item,
            theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode,
            isSelected &&
            (theme === "dark"
              ? styles.bgButtonSelectedColorDarkMode
              : styles.bgbuttonSelectedColorWhiteMode),
            {
              flex: 1,
              borderRadius: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[styles.itemText, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode, { flexShrink: 1 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>

          {item.desc && (
            <Pressable
              onPress={() => setPopupConfig({ visible: true, title: item.name, message: item.desc ?? "" })}
              style={{
                marginLeft: 8,
                backgroundColor: theme === "dark" ? "#444" : "#e0e0e0",
                borderRadius: 50,
                padding: 7,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={25}
                color={theme === "dark" ? "white" : "black"}
              />
            </Pressable>
          )}
        </TouchableOpacity>
      </View>
    );
  }, [selectedItems, theme, handleSelect]);

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
      <Text style={[styles.topText1, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
        <Text style={styles.boldText1}>{t('IngredientsText1')}</Text>{t('IngredientsText2')}
      </Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode
          ]}
          placeholder={t('SearchPlaceholder')}
          placeholderTextColor={theme === "dark" ? 'white' : 'black'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        style={styles.bottomSpace}
        data={filteredIngredients}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        extraData={selectedItems}
        // OPTYMALIZACJA: Flagi wydajnościowe FlatList
        initialNumToRender={12} 
        windowSize={5}
        maxToRenderPerBatch={10}
      />

      <View>
        <Pressable
          style={[styles.button, theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('ButtonTextBack')}</Text>
        </Pressable>

        <Pressable
          style={[styles.button2, theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode]}
          onPress={() => navigation.navigate("Drink", { taste, strength, alcohols, ingredients: selectedItems })}
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('ButtonTextNext')}</Text>
        </Pressable>
      </View>
      
      <SimplePopup
        isVisible={popupConfig.visible}
        onClose={() => setPopupConfig(prev => ({ ...prev, visible: false }))}
        title={popupConfig.title}
        message={popupConfig.message}
      />

    </SafeAreaView>
  );
};

export default IngredientsScreen;