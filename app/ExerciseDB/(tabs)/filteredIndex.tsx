import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    db.getAllAsync('SELECT imgFolder, name FROM exercises WHERE mainMuscle = ?;', [muscle])
      .then(rows => setExercises(rows as { imgFolder: string; name: string; }[]))
      .catch(e => setError(e.message || String(e)));
  }, [db, muscle]);

  if (error) {
    return (
      <ImageBackground
        source={require('../../../assets/images/bgmuscle.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.centered}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      </ImageBackground>
    );
  }

  if (!exercises.length) {
    return (
      <ImageBackground
        source={require('../../../assets/images/bgmuscle.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.centered}>
          <Text style={styles.noExercisesText}>No exercises found for {muscle}.</Text>
        </View>
      </ImageBackground>
    );
  }

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/bgmuscle.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.headerText}>{muscle?.toUpperCase()} EXERCISES</Text>
      <BlurView intensity={60} tint="dark" style={styles.searchBlur}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor="#ffdb57"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </BlurView>
      <FlatList
        data={filteredExercises}
        keyExtractor={item => item.imgFolder}
        renderItem={({ item }) => (
          <BlurView intensity={60} tint="dark" style={styles.cardBlur}>
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
          </BlurView>
        )}
        contentContainerStyle={styles.list}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffdb57',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 24,
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  noExercisesText: {
    fontSize: 18,
    color: '#ffdb57',
    textAlign: 'center',
    marginTop: 50,
    opacity: 0.8,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  list: { padding: 24 },
  searchBlur: {
    borderRadius: 12,
    margin: 24,
    overflow: 'hidden',
  },
  searchInput: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: 12,
    color: '#ffdb57',
    fontSize: 20,
  },
  cardBlur: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  image: { width: 76, height: 76, marginRight: 14, borderRadius: 8, backgroundColor: '#333' },
  text: {
    color: '#ffdb57',
    fontSize: 20,
    flex: 1,
    minWidth: 0,
    fontWeight: '500',
    letterSpacing: 0.5,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});