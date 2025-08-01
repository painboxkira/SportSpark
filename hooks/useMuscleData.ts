import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

interface MuscleData {
  id: string;
  wiki: string;
}

export function useMuscleData(muscleId: string | null) {
  const db = useSQLiteContext();
  const [muscleData, setMuscleData] = useState<MuscleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!muscleId || !db) {
      setMuscleData(null);
      return;
    }

    setLoading(true);
    setError(null);

    db.getFirstAsync('SELECT id, wiki FROM muscles WHERE id = ?;', [muscleId])
      .then(row => {
        setMuscleData(row as MuscleData | null);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || String(e));
        setLoading(false);
      });
  }, [db, muscleId]);

  return { muscleData, loading, error };
}
