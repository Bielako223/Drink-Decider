import React, { memo, useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../ThemeContext";
import Images from './DataManagment/Images';
import { DrinkFull } from './DataManagment/Classes';
import { FontAwesome } from "@expo/vector-icons";
import styles from './styles';
import Popup from './Popup';
import { useFavorites } from "./FavoriteContext";

interface Props {
  drink: DrinkFull;
  onPress?: () => void;
  matchPercentage?: number;
  points?: number;
  maxPoints?: number;
}

const DrinkItemComponent: React.FC<Props> = ({ drink, onPress, matchPercentage, points, maxPoints }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const [popupVisible, setPopupVisible] = useState(false);
  const ImgPath = drink.img ?? 'no_image.png';
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(drink.id);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={[theme === "dark" ? styles.drinkCardDark : styles.drinkCard]}>
        <View style={styles.imageContainer}>
          <Image source={Images[ImgPath]} style={styles.drinkImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageGradientDrinkItem}
          />
          <View style={styles.imageOverlayDrinkItem}>
            <Text style={styles.drinkName}>{drink.name}</Text>
            <Text style={styles.drinkStrength}>{drink.range} {t('ABV')}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          {matchPercentage !== undefined && points == undefined && maxPoints == undefined && (
            <View style={styles.matchBadgeDrinkItem}>
              <Text style={styles.matchBadgeTextDrinkItem}>
                {t('DrinkMatchingPercentage')} {matchPercentage}%
              </Text>
            </View>
          )}
          {points !== undefined && maxPoints !== undefined && (
            <View style={styles.matchBadgeDrinkItem}>
              <Text style={styles.matchBadgeTextDrinkItem}>
                {points}/{maxPoints}{" "}
                {maxPoints === 1
                  ? t('skladnik')      
                  : maxPoints > 1 && maxPoints < 5
                    ? t('skladniki')     
                    : t('skladnikow')}
              </Text>
            </View>
          )}

          <Text style={[theme === "dark" ? styles.infoHeaderDark : styles.infoHeader]}>{t('Description')}</Text>
          <Text style={[theme === "dark" ? styles.infoContentDark : styles.infoContent]}>{drink.description ?? ''}</Text>
          <View style={styles.separator} />

          <Text style={[theme === "dark" ? styles.infoHeaderDark : styles.infoHeader]}>{t('DrinkTaste')}</Text>
          <Text style={[theme === "dark" ? styles.infoContentDark : styles.infoContent]}>
            {drink.tastes.map((v, i, arr) => i === arr.length - 1 ? v.name + '.' : v.name + ', ')}
          </Text>
          <View style={styles.separator} />

          <Text style={[theme === "dark" ? styles.infoHeaderDark : styles.infoHeader]}>{t('DrinkIngredients')}</Text>
          <Text style={[theme === "dark" ? styles.infoContentDark : styles.infoContent]}>
            {drink.ingredients.map((v, i, arr) => i === arr.length - 1 ? v.name + '.' : v.name + ', ')}
          </Text>
          <View style={styles.separator} />

          <Text style={[theme === "dark" ? styles.infoHeaderDark : styles.infoHeader]}>{t('DrinkAlcohols')}</Text>
          <View style={styles.alcoholsContainerDrinkItem}>
            {drink.alcohols.map((v, i) => (
              <View key={i} style={styles.alcoholBadgeDrinkItem}>
                <Text style={styles.alcoholBadgeTextDrinkItem}>{v.name}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.recipeButton} onPress={() => setPopupVisible(true)}>
            <FontAwesome name="book" size={20} color={theme === "dark" ? "white" : "black"} />

            <Text style={[theme === "dark" ? styles.buttonText11 : styles.buttonTextWhiteMode1]}>{t('Recipe')}</Text>
          </TouchableOpacity>

          <Popup
            isVisible={popupVisible}
            onClose={() => setPopupVisible(false)}
            drinkId={drink.id}
            lang={t('Lang') === 'pl' ? 'pl' : 'eng'}
          />
        </View>

        <Pressable
          onPress={() => toggleFavorite(drink.id)}
          style={styles.heartContainerDrinkItem}
        >
          <FontAwesome name={favorite ? "heart" : "heart-o"} size={25} color={favorite ? "red" : "white"} />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

const DrinkItem = memo(
  DrinkItemComponent,
  (prevProps, nextProps) =>
    prevProps.drink.id === nextProps.drink.id &&
    prevProps.onPress === nextProps.onPress
);

export default DrinkItem;