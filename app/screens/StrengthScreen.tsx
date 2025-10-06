import React, { useState, useContext, useEffect } from "react";
import { FlatList, Text, TouchableOpacity, Pressable, View } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import styles from "../styles";
import { useTranslation } from "react-i18next";
import { BaseItem } from "../DataManagment/Classes";
import { GetStrength } from "../DataManagment/DataAccess";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeContext } from "../../ThemeContext";

const StrengthScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const route: RouteProp<{ params: { taste: number[] } }, "params"> = useRoute();
  const taste = route.params?.taste;

  const [strength, setStrength] = useState<BaseItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const lang = t("Lang") === "pl" ? "pl" : "eng";
        const data = await GetStrength(lang);
        setStrength(data);
      } catch (error) {
        console.error("Błąd przy wczytywaniu strength:", error);
      }
    })();
  }, [t]);

  const handleSelect = (id: number) => {
    setSelectedItem(id === selectedItem ? null : id);
  };

  const renderItem = ({ item }: { item: BaseItem }) => {
    const isSelected = item.id === selectedItem;
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
          <Text style={[styles.itemText, theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode]}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
        {t("StrengthText")}
      </Text>

      <FlatList
        data={strength}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedItem}
      />

      <View>
        <Pressable
          style={[
            styles.button,
            theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t("ButtonTextBack")}</Text>
        </Pressable>

        <Pressable
          disabled={selectedItem === null}
          style={[
            styles.button2,
            theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode,
            selectedItem === null && styles.button2off,
          ]}
          onPress={() =>
            navigation.navigate("Alcohol", {
              taste: taste,
              strength: selectedItem, 
            })
          }
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t("ButtonTextNext")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default StrengthScreen;
