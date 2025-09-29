import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const dbAssets: Record<string, any> = {
  'drinks.db': require('../assets/drinks.db'),
  'drinksEng.db': require('../assets/drinksEng.db'),
};

export async function resetDatabases() {
  const dbDir = `${FileSystem.documentDirectory}SQLite`;

  // Tworzymy katalog jeśli nie istnieje
  const dirInfo = await FileSystem.getInfoAsync(dbDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
  }

  for (const dbName of Object.keys(dbAssets)) {
    const dbUri = `${dbDir}/${dbName}`;

    // Usuń starą bazę (jeśli istnieje)
    await FileSystem.deleteAsync(dbUri, { idempotent: true });
    console.log(`Usunięto starą bazę: ${dbName}`);

    // Pobierz asset i skopiuj świeżą bazę
    const dbAsset = Asset.fromModule(dbAssets[dbName]);
    await dbAsset.downloadAsync();
    await FileSystem.copyAsync({ from: dbAsset.localUri!, to: dbUri });
    console.log(`Skopiowano świeżą bazę: ${dbName}`);
  }

  console.log('Reset baz zakończony!');
}

// Przykład użycia: uruchamiasz tylko raz przy aktualizacji bazy
// await resetDatabases();
