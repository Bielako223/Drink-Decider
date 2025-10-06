import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  bgColorDarkMode: {
    backgroundColor: '#050712'
  },
  bgColorWhiteMode: {
    backgroundColor: 'white'
  },
  fontColorDarkMode: {
    color: 'white'
  },
  fontColorWhiteMode: {
    color: 'black'
  },
  buttonDarkMode: {
    borderWidth: 1.5,
    borderColor: 'white',
    backgroundColor: '#050712',
    overflow: 'visible',

    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,

    elevation: 5,
  },
  buttonWhiteMode: {
    borderWidth: 1.5,
    borderColor: 'black',
    backgroundColor: 'white',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    elevation: 5,
  },
  textcolorDarkMode: {
    color: 'black'
  },
  textcolorWhiteMode: {
    color: 'white'
  },
  drinkDarkMode: {
    backgroundColor: 'black'
  },
  drinkWhiteMode: {
    backgroundColor: 'white'
  },
  bgButtonSelectedColorDarkMode: {
    backgroundColor: '#5a5a5aff',
    color: 'white'
  },
  bgbuttonSelectedColorWhiteMode: {
    backgroundColor: '#d6c9c9ff',
    color: 'white'
  },
  bottomButtonDarkMode: {
    backgroundColor: 'black',
    borderWidth: 1.5,
    borderColor: 'white',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,

    
    elevation: 5,
  },
  bottomButtonWhiteMode: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: 'black',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    elevation: 5,
  },
  buttonTextWhiteMode: {
    color: 'black',
    width: '100%',
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    lineHeight: 22,
    includeFontPadding: false,
    letterSpacing: 0.3,
    paddingHorizontal: 4,
    paddingRight: 2,
  }, buttonTextWhiteMode1: {
    color: 'black',
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    lineHeight: 22,
    includeFontPadding: false,
    letterSpacing: 0.3,
    paddingHorizontal: 4,
    paddingRight: 2, 
  },

  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 0,
    borderRadius: 20,
  },
  selectedItem: {
    backgroundColor: '#F39C12',
  },
  itemReverseColors: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#27AE60',
    borderRadius: 25,
  },
  selectedItemReverseColors: {
    backgroundColor: '#ff4d4d',
  },
  itemText: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    includeFontPadding: false
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    width: '43%',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: '43%',
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2off: {
    backgroundColor: '#A9A6A6',
  },
  buttonText: {
    color: 'white',
    width: '100%',
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    lineHeight: 22,
    includeFontPadding: false,
    letterSpacing: 0.3,
    paddingHorizontal: 4,
    paddingRight: 2, 
  },
  buttonText11: {
    color: 'white',
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    lineHeight: 22,
    includeFontPadding: false,
    letterSpacing: 0.3,
    paddingHorizontal: 4,
    paddingRight: 2, 
  },
  topBlock: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '5%',
    backgroundColor: '#fff',
  },
  container: {
    height: '100%',
    position: 'relative',
    flex: 1,

  },
  topText: {
    textAlign: 'center',
    fontSize: 22,
    margin: 5,
    padding: 5,
    fontFamily: 'Poppins_500Medium',
    includeFontPadding: false,
  },
  topText1: {
    textAlign: 'center',
    fontSize: 24,
    margin: 5,
    marginTop: 8,
    padding: 5,
    fontWeight: '500',
  },
  boldText1: {
    textDecorationLine: 'underline',
    fontSize: 25,
    color: 'red'
  },
  bottomSpace: {
    marginBottom: '20%'
  },
  image: {
    width: 240,
    height: 300,
    marginBottom: 40
  },
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 40
  },
  startButton: {
    width: '64%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,

   
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    elevation: 5,

  },
  mainDrink: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#F39C12',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  othersDrinks: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finalDrinkContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  finalDrinkbuttonContainer: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '300'
  },
  percentageText1: {
    fontSize: 14,
    color: 'white',
    fontWeight: '300'
  },
  drinkTextBold: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    includeFontPadding: false,
  },
  popupListText: {
    fontFamily: 'Poppins_400Regular',
    includeFontPadding: false,
  },
  helpText: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 8,
    padding: 5,
    fontWeight: '500',
  },
  langContainer: {

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeLanguageContainer: {
    width: '90%',
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 5
  },
  langflagContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  drinkImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 25
  },
  drinkImgContainer: {
    width: 200, 
    height: 200, 
  },
  drinkImgContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDrinkList: {

    width: '40%',
    backgroundColor: '#F39C12',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drinkListButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    backgroundColor: 'rgba(52, 52, 52, 0.0)'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20, 
    left: 0,
    right: 0,
    alignItems: 'center', 
    zIndex: 100, 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recipeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  buttonText1: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  noDrinksText: {
    textAlign: 'center',
    margin: 100,
    fontSize: 50
  },
  searchContainer: {
    padding: 10
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  }, instructionTextTop: {
    fontSize: 25,
    marginBottom: 30,
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },
  instructionTextList: {
    fontSize: 20,
    marginBottom: 15,
  },

  containerInstruction: {
    padding: 20,
    marginTop: 50
  },
  contentContainerInstruction: {
    flex: 1, 
    justifyContent: 'flex-start', 
    padding: 10, 
  },
  textNoneResultMessage: {
    fontSize: 25,
    padding: 10
  },
  mt: {
    paddingLeft: 5
  },
  iconscontainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconstext: {
    fontSize: 35
  },

  drinkCard: {
    margin: 16,
    borderRadius: 20,
    backgroundColor: '#fff',

  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    
    elevation: 5,
  },
  drinkCardDark: {
    margin: 16,
    borderRadius: 20,
    backgroundColor: '#050712',

 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, 
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },

  imageContainer: {
    width: '100%',
    height: 210,
    position: 'relative',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },

  drinkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '33%', 
  },

  imageOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },

  drinkName: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    includeFontPadding: false,
  },

  drinkStrength: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    includeFontPadding: false,
  },

  infoContainer: {
    padding: 15,
  },

  infoHeader: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
    fontFamily: 'Poppins_500Medium',
    includeFontPadding: false,
  },
  infoHeaderDark: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
    fontFamily: 'Poppins_500Medium',
    color: 'white',
    includeFontPadding: false,
  },

  infoContent: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
    includeFontPadding: false,
  },
  infoContentDark: {
    fontSize: 14,
    marginBottom: 8,
    color: '#ccc',
    fontFamily: 'Poppins_400Regular',
    includeFontPadding: false,
  },

  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
  imageGradientDrinkItem: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  imageOverlayDrinkItem: {
    position: 'absolute',
    left: 12,
    bottom: 12,
  },
  matchBadgeDrinkItem: {
    backgroundColor: "#6eec6eff",
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  matchBadgeTextDrinkItem: {
    marginTop: 2,
    fontSize: 18,
    color: "black",
    fontFamily: "Poppins_500Medium",
  },
  alcoholsContainerDrinkItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  alcoholBadgeDrinkItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E6FFCC',
    backgroundColor: '#E6FFCC',
  },
  alcoholBadgeTextDrinkItem: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#333',
  },
  heartContainerDrinkItem: {
    position: "absolute",
    top: 15,
    right: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', 
  },
  separatorLang: {
    height: 100,
  }


});

export default styles;