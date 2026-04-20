import React, { useState, useContext, useEffect, useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles";
import { useTranslation } from "react-i18next";
import { BaseItem } from "../DataManagment/Classes";
import { GetTaste } from "../DataManagment/DataAccess";
import { ThemeContext } from "../../ThemeContext";

const TasteScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const [taste, setTaste] = useState<BaseItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const lang = t("Lang") === "pl" ? "pl" : "eng";
        const data = await GetTaste(lang);
        setTaste(data);
      } catch (error) {
        console.error("Błąd przy wczytywaniu taste:", error);
      }
    })();
  }, [t]);

  // OPTYMALIZACJA: useCallback i aktualizacja funkcyjna stanu
  const handleSelect = useCallback((id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // OPTYMALIZACJA: renderItem wewnątrz useCallback
  const renderItem = useCallback(({ item }: { item: BaseItem }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <View style={{ marginHorizontal: 16 }}>
        <TouchableOpacity
          onPress={() => handleSelect(item.id)}
          style={[
            styles.item,
            theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode,
            isSelected &&
            (theme === "dark"
              ? styles.bgButtonSelectedColorDarkMode
              : styles.bgbuttonSelectedColorWhiteMode),
          ]}
        >
          <Text style={[styles.itemText, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [selectedItems, theme, handleSelect]); // Re-render nastąpi tylko wtedy, gdy zmieni się zaznaczenie, motyw lub funkcja

  return (
    <SafeAreaView style={[styles.container, theme === "dark" ? styles.bgColorDarkMode : styles.bgColorWhiteMode]}>
      <Text style={[styles.topText, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>
        {t("SelectTaste")}
      </Text>

      <FlatList
        style={styles.bottomSpace}
        data={taste}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        extraData={selectedItems}
        // OPTYMALIZACJA: Profilaktyczne flagi wydajnościowe FlatList
        initialNumToRender={8}
        windowSize={5}
        maxToRenderPerBatch={10}
      />

      <View>
        <Pressable
          style={[styles.button, theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode]}
          onPress={() => navigation.goBack()}
        >
          <Text style={theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode}>{t("ButtonTextBack")}</Text>
        </Pressable>

        <Pressable
          disabled={selectedItems.length === 0}
          style={[
            styles.button2,
            theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode,
            selectedItems.length === 0 && styles.button2off
          ]}
          onPress={() => navigation.navigate("Strength", { taste: selectedItems })}
        >
          <Text style={theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode}>{t("ButtonTextNext")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default TasteScreen;