import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const ASSET = require('../../../assets/database/exercise.db');

const BASE_IMAGE_URL = 'https://mediumvioletred-dogfish-712473.hostingersite.com/exercises/';

const getImageUrl = (slug: string) => `${BASE_IMAGE_URL}${slug}/0.jpg`;

export default function App() {
  return (
    <SQLiteProvider
      databaseName="exercise.db"
      assetSource={{ assetId: ASSET }}
    >
      <ExerciseImages />
    </SQLiteProvider>
  );
}

function ExerciseImages() {
  const db = useSQLiteContext();
  const [exercises, setExercises] = React.useState<{ imgFolder: string, name: string }[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    db.getAllAsync('SELECT imgFolder, name FROM exercises;')
      .then(rows => setExercises(rows as { imgFolder: string; name: string; }[]))
      .catch(e => setError(e.message || String(e)));
  }, [db]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }
  if (!exercises.length) {
    return (
      <View style={styles.center}>
        <Text>No exercises found.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={exercises}
      keyExtractor={item => item.imgFolder}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: getImageUrl(item.imgFolder) }} style={styles.image} />
          <Text
            style={styles.text}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#181818' },
  list: { padding: 24, backgroundColor: '#181818' },
  card: {
    backgroundColor: '#23242a',
    borderRadius: 12,
    marginBottom: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0 // This makes sure text shrinks instead of overflowing
  },
  image: { width: 76, height: 76, marginRight: 14, borderRadius: 8, backgroundColor: '#333' },
  text: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    minWidth: 0, // necessary for truncation in flex row
  },
});
