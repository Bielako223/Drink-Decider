import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetDatabases } from './DatabaseReset'; // zaimportuj swoją funkcję

// ZMIENIAJ TĘ WARTOŚĆ ZA KAŻDYM RAZEM, GDY MODYFIKUJESZ PLIKI .db!
// Jeśli wrzucasz nową bazę z nowymi drinkami, zmień na '2', potem na '3' itd.
const CURRENT_DB_VERSION = '1'; 

export async function checkAndUpgradeDatabases() {
  try {
    // 1. Pobierz zapisaną wersję z pamięci urządzenia
    const storedVersion = await AsyncStorage.getItem('db_version');

    // 2. Porównaj z obecną wersją w kodzie
    if (storedVersion !== CURRENT_DB_VERSION) {
      console.log(`Wykryto nową wersję bazy: ${CURRENT_DB_VERSION}. Aktualizuję...`);
      
      // 3. Odpal swój skrypt do resetu
      await resetDatabases();
      
      // 4. Zapisz nową wersję, żeby skrypt nie odpalił się ponownie przy kolejnym uruchomieniu
      await AsyncStorage.setItem('db_version', CURRENT_DB_VERSION);
      
      console.log('Aktualizacja bazy zakończona sukcesem!');
    } else {
      console.log('Baza danych jest aktualna (wersja ' + CURRENT_DB_VERSION + ').');
    }
  } catch (error) {
    console.error('Błąd podczas sprawdzania wersji bazy danych:', error);
  }
}