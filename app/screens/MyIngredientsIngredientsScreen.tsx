import React, { useState, useContext, useEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  
  Pressable,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import styles from "../styles";
import { useTranslation } from "react-i18next";
import { BaseItem } from "../DataManagment/Classes";
import { GetIngredients } from "../DataManagment/DataAccess";
import { ThemeContext } from "../../ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; // nowa wersja
import SimplePopup from '../SimplePopup'; // dostosuj ścieżkę





const MyIngredientsIngredientsScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  // parametry z poprzedniego ekranu (lista ID alkoholi)
  const route: RouteProp<{ params: { alcohols: number[] } }, "params"> = useRoute();
  const alcohols = route.params?.alcohols ?? [];

  const [ingredients, setIngredients] = useState<BaseItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
const [popupTitle, setPopupTitle] = useState("");
const [popupMessage, setPopupMessage] = useState("");


  // pobranie danych z bazy
  useEffect(() => {
    (async () => {
      try {
        const lang = t("Lang") === "pl" ? "pl" : "eng";
        const data = await GetIngredients(lang);
        data.sort((a, b) => a.name.localeCompare(b.name));
        setIngredients(data);
      } catch (err) {
        console.error("[MyIngredientsIngredientsScreen] błąd przy pobieraniu składników:", err);
      }
    })();
  }, [t]);

  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderItem = ({ item }: { item: BaseItem }) => {
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
      {/* LEWA CZĘŚĆ */}
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
        {/* Tekst */}
        <Text
          style={[styles.itemText, theme === "dark" ? styles.fontColorDarkMode: styles.fontColorWhiteMode, { flexShrink: 1 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>

        {/* Ikonka info */}
        {item.desc && (
           <Pressable
  onPress={() => {
    setPopupTitle(item.name);          // nagłówek = nazwa składnika
    setPopupMessage(item.desc ?? "");  // treść = opis
    setPopupVisible(true);
  }}
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
          styles.topText1,
          theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode,
        ]}
      >
        {t("SelectIngrednientsMyIngredients")}
      </Text>

      <FlatList
        style={styles.bottomSpace}
        data={ingredients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedItems}
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
            navigation.navigate("MyIngredientsResut", {
              alcohols: alcohols,
              ingredients: selectedItems,
            })
          }
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t("ButtonTextNext")}</Text>
        </Pressable>
      </View>
      <SimplePopup
  isVisible={popupVisible}
  onClose={() => setPopupVisible(false)}
  title={popupTitle}
  message={popupMessage}
/>

    </SafeAreaView>
  );
};

export default MyIngredientsIngredientsScreen;
