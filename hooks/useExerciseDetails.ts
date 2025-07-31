import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

export function useExerciseDetails(imgFolder: string | undefined) {
  const db = useSQLiteContext();
  const [exercise, setExercise] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imgFolder) return;
    db.getFirstAsync('SELECT * FROM exercises WHERE imgFolder = ?', [imgFolder])
      .then(row => setExercise(row))
      .catch(e => setError(e.message || String(e)));
  }, [imgFolder, db]);

  return { exercise, error };
}
