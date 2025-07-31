// useDatabase.ts
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

const DB_NAME = 'exercises.db';
const ASSET = require('../assets/database/exercise.db');

export function useDatabase() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    async function initDb() {
      // Ensure asset is loaded
      const asset = Asset.fromModule(ASSET);
      await asset.downloadAsync();

      const dbDirectory = FileSystem.documentDirectory!;
      const dbUri = dbDirectory + DB_NAME;

      const info = await FileSystem.getInfoAsync(dbUri);
      if (!info.exists) {
        // first launch: copy from bundle
        await FileSystem.copyAsync({
          from: asset.localUri!,
          to: dbUri,
        });
      }

      // Now open the database
      const database = await SQLite.openDatabaseAsync(DB_NAME);
      setDb(database);
    }

    initDb().catch(err => console.error('DB init error:', err));
  }, []);

  return db;
}
