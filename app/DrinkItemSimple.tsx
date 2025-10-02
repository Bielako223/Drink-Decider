import React, { memo, useContext } from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { DrinkSimple } from './DataManagment/Classes';
import Images from './DataManagment/Images';
import { useFavorites } from "./FavoriteContext";
import { ThemeContext } from "../ThemeContext";
import { useTranslation } from 'react-i18next';
import { FontAwesome} from "@expo/vector-icons";



interface Props {
  drink: DrinkSimple;
  onPress?: () => void;
  matchPercentage?: number;
  points?: number;
  maxPoints?: number;
}

const DrinkItemSimpleComponent: React.FC<Props> = ({ drink, onPress, matchPercentage, points, maxPoints }) => {
  const imgPath = drink.img ?? 'no_image.png';
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(drink.id);
  const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;
    const { t } = useTranslation();

  return (
    <Pressable style={[theme === "dark" ?styles.cardItemSimpleDark:styles.cardItemSimple]} onPress={onPress}>
      <Image source={Images[imgPath]} style={styles.imageItemSimple} />

      <View style={styles.textContainerItemSimple}>
        <Text style={[theme === "dark" ?styles.nameItemSimpleDark:styles.nameItemSimple]}>{drink.name}</Text>

        <Text style={[theme === "dark" ?styles.abvItemSimpleDark:styles.abvItemSimple]}>{drink.range} ABV</Text>

        {points !== undefined && maxPoints !== undefined && (
          <Text style={[theme === "dark" ?styles.abvItemSimpleDark:styles.abvItemSimple]}>
            {points}/{maxPoints}{" "}
  {maxPoints === 1
    ? t('skladnik')       // 1 składnik
    : maxPoints > 1 && maxPoints < 5
    ? t('skladniki')      // 2–4 składniki
    : t('skladnikow')}  
            </Text>
        )}

        {matchPercentage !== undefined && points == undefined && maxPoints == undefined && (
          <Text style={[theme === "dark" ?styles.abvItemSimpleDark:styles.abvItemSimple]}>{t('DrinkMatchingPercentage')} {matchPercentage}%</Text>
        )}

        {/* ❤️ Serce wycentrowane pionowo po prawej */}
        <View style={styles.heartContainerItemSimple}>
          <Pressable onPress={() => toggleFavorite(drink.id)}>
            <FontAwesome
              name={favorite ? "heart" : "heart-o"}
              size={26}
              color={favorite ? "red" : "gray"}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

// Memo z prostym porównaniem props
const DrinkItemSimple = memo(
  DrinkItemSimpleComponent,
  (prevProps, nextProps) =>
    prevProps.drink.id === nextProps.drink.id &&
    prevProps.drink.name === nextProps.drink.name &&
    prevProps.drink.img === nextProps.drink.img &&
    prevProps.drink.range === nextProps.drink.range &&
    prevProps.onPress === nextProps.onPress
);

export default DrinkItemSimple;

const styles = StyleSheet.create({
  cardItemSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardItemSimpleDark: {
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 12,
  marginVertical: 6,
  padding: 12,
  borderRadius: 12,
  backgroundColor: '#050712', // ciemne tło
  borderWidth: 1,
  borderColor: '#333',       // ciemniejsza ramka
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,        // mocniejszy cień na ciemnym tle
  shadowRadius: 4,
  elevation: 3,
},
  imageItemSimple: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  textContainerItemSimple: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nameItemSimple: {
    fontSize: 16,
    color: '#111',
    marginBottom: 4,
    fontFamily: 'Poppins_500Medium',
  },
  nameItemSimpleDark: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
    fontFamily: 'Poppins_500Medium',
  },
  abvItemSimple: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  abvItemSimpleDark: {
    fontSize: 14,
    color: '#c7c7c7ff',
    fontFamily: 'Poppins_400Regular',
  },
  matchTextItemSimple: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 2,
  },
  heartContainerItemSimple: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
});
