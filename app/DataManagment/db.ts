import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const dbAssets: Record<string, any> = {
  'drinks.db': require('../assets/drinks.db'),
  'drinksEng.db': require('../assets/drinksEng.db'),
};

export async function openDatabase(dbName: string) {
  const dbAsset = Asset.fromModule(dbAssets[dbName]);
  await dbAsset.downloadAsync();

  const dbDir = `${FileSystem.documentDirectory}SQLite`;
  const dbUri = `${dbDir}/${dbName}`;

  const dirInfo = await FileSystem.getInfoAsync(dbDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
  }

  const fileInfo = await FileSystem.getInfoAsync(dbUri);
  if (!fileInfo.exists) {
    await FileSystem.copyAsync({ from: dbAsset.localUri!, to: dbUri });
  }

  return SQLite.openDatabaseSync(dbName);
}