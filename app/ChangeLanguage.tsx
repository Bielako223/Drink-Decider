import React, {useState, useContext} from 'react';
import { Text, View,Image,TouchableOpacity  } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import i18next from '../services/i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from "../ThemeContext";

function ChangeLang() {
  const [changeLanguage, setchangeLanguage] = useState(false);
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme} = themeContext;
  const {t}= useTranslation();
    return (
         <View style={styles.langContainer}>
            {!changeLanguage &&(<TouchableOpacity style={styles.langContainer}  onPress={() => setchangeLanguage(true)}>
            
            {theme === 'dark' ? <Icon name="translate" size={40} color="#FFF" /> : <Icon name="translate" size={40} color="#000" />}
      </TouchableOpacity>)}
      {changeLanguage &&(<View style={styles.langContainer}>
          <View >
          <TouchableOpacity style={styles.langflagContainer} onPress={() => {i18next.changeLanguage('en'); setchangeLanguage(false)}}>
        <Image source={require('../assets/img/eng.png')} style={{width:40,height:20}} />
      </TouchableOpacity>
          </View>
          <View >
      <TouchableOpacity style={styles.langflagContainer} onPress={() => {i18next.changeLanguage('pl'); setchangeLanguage(false)}}>
        <Image source={require('../assets/img/pl.png')} style={{width:40,height:20}} />
        
      </TouchableOpacity>
      </View>
          </View>)}
         </View>

  );
}


export default ChangeLang;