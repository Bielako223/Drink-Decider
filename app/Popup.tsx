import React, { useContext, useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../ThemeContext";
import { GetDrinkDetails } from "./DataManagment/DataAccess";
import { Instruction, PrepIngredient,DrinkDetails } from "./DataManagment/Classes";

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  drinkId: number | null;
  lang: 'pl' | 'eng';
}

const Popup: React.FC<PopupProps> = ({ isVisible, onClose, drinkId, lang }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const [ingredients, setIngredients] = useState<PrepIngredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);

  useEffect(() => {
    if (isVisible && drinkId !== null) {
      (async () => {
        const details: DrinkDetails | null = await GetDrinkDetails(drinkId, lang);
setIngredients(details?.prepIngredients ?? []);
setInstructions(details?.instructions ?? []);
      })();
    } else {
      setIngredients([]);
      setInstructions([]);
    }
  }, [isVisible, drinkId, lang]);

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.drinkTextBold}>{t('DrinkIngredients')}</Text>
          <FlatList
            data={ingredients}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Text style={styles.popupListText}>• {item.ingredient_text}</Text>}
          />
          <Text style={styles.drinkTextBold}>{t('PreparationMethod')}</Text>
          <FlatList
            data={instructions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={styles.popupListText}>{item.step_number}. {item.instruction}</Text>
            )}
          />
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeButton,
              theme === "dark" ? styles.buttonDarkMode : styles.buttonWhiteMode
            ]}
          >
            <Text style={[theme === "dark" ? styles.buttonText : styles.buttonTextWhiteMode]}>{t('Close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Popup;
