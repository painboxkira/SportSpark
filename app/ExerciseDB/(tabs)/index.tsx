import { useRouter } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';






const ASSET = require('../../../assets/database/exercise.db');

const BASE_IMAGE_URL = 'https://mediumvioletred-dogfish-712473.hostingersite.com/exercises/';

export const getImageUrl = (slug: string) => `${BASE_IMAGE_URL}${slug}/0.jpg`;

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
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();
  React.useEffect(() => {
    db.getAllAsync('SELECT imgFolder, name FROM exercises;')
      .then(rows => setExercises(rows as { imgFolder: string; name: string; }[]))
      .catch(e => setError(e.message || String(e)));
  }, [db]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }
  if (!exercises.length) {
    return (
      <View style={styles.container}>
        <Text>No exercises found.</Text>
      </View>
    );
  }
  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <View style={styles.container}>  
      <TextInput
        style={styles.searchInput}
        placeholder="Search exercises..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />  
      <FlatList
         data={filteredExercises}
        keyExtractor={item => item.imgFolder}
        renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => {
          router.push({
            pathname: '/ExerciseDB/(tabs)/Details',
            params: {
              imgFolder: item.imgFolder,
              name: item.name,
              // Add anything else you need!
            },
          })}}
            >
          <Image source={{ uri: getImageUrl(item.imgFolder) }} style={styles.image} />
          <Text
            style={styles.text}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.list}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11296b',width:'100%' },
  list: { padding: 24, backgroundColor: '#11296b' },
  card: {
    backgroundColor: '#00509d',
    borderRadius: 12,
    marginBottom: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0 // This makes sure text shrinks instead of overflowing
  },
  image: { width: 76, height: 76, marginRight: 14, borderRadius: 8, backgroundColor: '#333' },
  text: {
    color: '#ffdb57',
    fontSize: 20,
    flex: 1,
    minWidth: 0, // necessary for truncation in flex row
  },
  searchInput: {
    backgroundColor: '#00509d',
    borderRadius: 8,
    padding: 12,
    paddingTop: 24,
    marginBottom: 16,
    color: '#ffdb57',
    fontSize: 20,
  },
});
