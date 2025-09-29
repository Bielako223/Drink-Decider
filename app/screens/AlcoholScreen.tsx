import React, { useState, useContext, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, SafeAreaView, Pressable } from 'react-native';
import { useRoute, RouteProp } from "@react-navigation/native";
import styles from '../styles';
import { useTranslation } from 'react-i18next';
import { BaseItem } from '../DataManagment/Classes';
import { GetAlcohol } from '../DataManagment/DataAccess';
import { ThemeContext } from "../../ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';


const AlcoholScreen = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  // Route params
  let route: RouteProp<{ params: { taste: number[]; strength: number } }, 'params'> = useRoute();
  const taste = route.params?.taste;
  const strength = route.params?.strength;

  // State
  const [alcohol, setAlcohol] = useState<BaseItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Load alcohol list
  useEffect(() => {
    (async () => {
      try {
        const lang = t('Lang') === 'pl' ? 'pl' : 'eng';
        const data = await GetAlcohol(lang);
        // sortowanie po name
        data.sort((a, b) => a.name.localeCompare(b.name));
        setAlcohol(data);
      } catch (err) {
        console.error("Błąd przy pobieraniu alkoholi:", err);
      }
    })();
  }, [t]);

  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderItem = ({ item }: { item: BaseItem }) => {
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
        {hasDesc && (
  <Pressable
    onPress={() => alert(item.desc)}
    style={{
      marginLeft: 8,
      backgroundColor: theme === "dark" ? "#444" : "#e0e0e0",
      borderRadius: 50,
      padding: 7, // zwiększa obszar dotyku
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
          styles.topText,
          theme === "dark" ? styles.fontColorDarkMode : styles.fontColorWhiteMode,
        ]}
      >
        {t('SelectAlcohol')}
      </Text>

      <FlatList
        style={styles.bottomSpace}
        data={alcohol}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedItems}
      />

      <View>
        <Pressable
          style={[
            styles.button,
            theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('ButtonTextBack')}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button2,
            theme === "dark" ? styles.bottomButtonDarkMode : styles.bottomButtonWhiteMode,
          ]}
          onPress={() =>
            navigation.navigate("Ingredients", {
              taste,
              alcohols: selectedItems,
              strength,
            })
          }
        >
          <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('ButtonTextNext')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AlcoholScreen;
