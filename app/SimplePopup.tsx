import React, { useContext } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { ThemeContext } from "../ThemeContext";
import { useTranslation } from 'react-i18next';


interface SimplePopupProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SimplePopup: React.FC<SimplePopupProps> = ({ isVisible, onClose, title, message }) => {
    const { t } = useTranslation();
  
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Nagłówek */}
          <Text style={styles.drinkTextBold}>{title}</Text>

          {/* Treść */}
          <Text style={[styles.popupListText, { marginVertical: 10 }]}>{message}</Text>

          {/* Przycisk zamknięcia */}
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

export default SimplePopup;
