import { useRouter } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ASSET = require('../../../assets/database/exercise.db');

const BASE_IMAGE_URL = 'https://mediumvioletred-dogfish-712473.hostingersite.com/exercises/';

export const getImageUrl = (slug: string) => `${BASE_IMAGE_URL}${slug}/0.jpg`;

export default function FilteredIndex() {
  return (
    <SQLiteProvider
      databaseName="exercise.db"
      assetSource={{ assetId: ASSET }}
    >
      <FilteredExercises />
    </SQLiteProvider>
  );
}

function FilteredExercises() {
  const db = useSQLiteContext();
  const { muscle } = useLocalSearchParams<{ muscle: string }>();
  const [exercises, setExercises] = React.useState<{ imgFolder: string, name: string }[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    if (!muscle) return;
    
    // Query exercises where mainMuscle matches the selected muscle
    db.getAllAsync('SELECT imgFolder, name FROM exercises WHERE mainMuscle = ?;', [muscle])
      .then(rows => setExercises(rows as { imgFolder: string; name: string; }[]))
      .catch(e => setError(e.message || String(e)));
  }, [db, muscle]);

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
        <Text style={styles.noExercisesText}>No exercises found for {muscle}.</Text>
      </View>
    );
  }

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{muscle?.toUpperCase()} EXERCISES</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search exercises..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />  
      <FlatList
        data={filteredExercises}
        keyExtractor={item => item.imgFolder}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => {
              router.push({
                pathname: '/ExerciseDB/(tabs)/Details',
                params: {
                  imgFolder: item.imgFolder,
                  name: item.name,
                },
              })
            }}
          >
            <Image source={{ uri: getImageUrl(item.imgFolder) }} style={styles.image} />
            <Text style={styles.text} numberOfLines={2}>
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
  container: { flex: 1, backgroundColor: '#11296b', width: '100%' },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffdb57',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  noExercisesText: {
    fontSize: 18,
    color: '#ffdb57',
    textAlign: 'center',
    marginTop: 50,
  },
  list: { padding: 24, backgroundColor: '#11296b' },
  card: {
    backgroundColor: '#00509d',
    borderRadius: 12,
    marginBottom: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0
  },
  image: { width: 76, height: 76, marginRight: 14, borderRadius: 8, backgroundColor: '#333' },
  text: {
    color: '#ffdb57',
    fontSize: 20,
    flex: 1,
    minWidth: 0,
  },
  searchInput: {
    backgroundColor: '#00509d',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    color: '#ffdb57',
    fontSize: 20,
  },
});