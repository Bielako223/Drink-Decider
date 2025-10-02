import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

const dbAssets: Record<string, any> = {
  'drinks.db': require('../assets/drinks.db'),
  'drinksEng.db': require('../assets/drinksEng.db'),
};

export async function openDatabase(dbName: string) {
  const dbAsset = Asset.fromModule(dbAssets[dbName]);
  await dbAsset.downloadAsync();

const dbDir = `${(FileSystem as any).documentDirectory}SQLite`;
  const dbUri = `${dbDir}/${dbName}`;

  // Utwórz folder, jeśli nie istnieje
  const dirInfo = await FileSystem.getInfoAsync(dbDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
  }

  // Skopiuj plik bazy, jeśli nie istnieje
  const fileInfo = await FileSystem.getInfoAsync(dbUri);
  if (!fileInfo.exists) {
    await FileSystem.copyAsync({ from: dbAsset.localUri!, to: dbUri });
  }

  // Otwórz bazę synchronicznie
  return SQLite.openDatabaseSync(dbName);
}
