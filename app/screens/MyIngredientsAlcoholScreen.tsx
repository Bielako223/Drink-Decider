import React, { useState, useContext, useEffect, useMemo, useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View, Pressable, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import styles from "../styles";
import { BaseItem } from "../DataManagment/Classes";
import { GetAlcohol } from "../DataManagment/DataAccess";
import { ThemeContext } from "../../ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import SimplePopup from '../SimplePopup'; 

const MyIngredientsAlcoholScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const [alcohol, setAlcohol] = useState<BaseItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // OPTYMALIZACJA: Połączony stan dla pop-upu
  const [popupConfig, setPopupConfig] = useState({ visible: false, title: "", message: "" });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const lang = t("Lang") === "pl" ? "pl" : "eng";
        const data = await GetAlcohol(lang);
        data.sort((a, b) => a.name.localeCompare(b.name));
        setAlcohol(data);
      } catch (err) {
        console.error("[MyIngredientsAlcoholScreen] błąd przy pobieraniu alkoholi:", err);
      }
    })();
  }, [t]);

  // OPTYMALIZACJA: useCallback i aktualizacja funkcyjna
  const handleSelect = useCallback((id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // OPTYMALIZACJA: Wyniesienie toLowerCase() przed pętlę
  const filteredAlcohol = useMemo(() => {
    if (!searchQuery) return alcohol;
    const lowerQuery = searchQuery.toLowerCase();
    return alcohol.filter(a => a.name.toLowerCase().includes(lowerQuery));
  }, [alcohol, searchQuery]);

  // OPTYMALIZACJA: useCallback dla renderItem
  const renderItem = useCallback(({ item }: { item: BaseItem }) => {
    const isSelected = selectedItems.includes(item.id);
    const hasDesc = item.desc && item.desc !== "";
    
    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 16,
          marginVertical: 8,
          overflow: 'hidden',
          alignItems: 'center',
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

          {hasDesc && (
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
    <SafeAreaView
      style={[
        styles.container,
        theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode,
      ]}
    >
      <Text
        style={[
          styles.topText,
          theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode,
        ]}
      >
        {t("SelectAlcoholMyIngredients")}
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
        data={filteredAlcohol}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedItems}
        // OPTYMALIZACJA: Flagi wydajnościowe FlatList
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
      />

      <View>
        <Pressable
          style={[
            styles.button,
            theme === "dark"
              ? styles.bottomButtonDarkMode
              : styles.bottomButtonWhiteMode,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t("ButtonTextBack")}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button2,
            theme === "dark"
              ? styles.bottomButtonDarkMode
              : styles.bottomButtonWhiteMode,
            selectedItems.length === 0 && styles.button2off,
          ]}
          disabled={selectedItems.length === 0}
          onPress={() =>
            navigation.navigate("MyIngredientsIngredients", {
              alcohols: selectedItems,
            })
          }
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t("ButtonTextNext")}</Text>
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

export default MyIngredientsAlcoholScreen;