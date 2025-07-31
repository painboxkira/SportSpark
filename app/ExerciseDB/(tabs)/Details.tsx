import { useExerciseDetails } from '@/hooks/useExerciseDetails';
import { useLocalSearchParams } from 'expo-router';
import { Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

const BASE_IMAGE_URL = 'https://mediumvioletred-dogfish-712473.hostingersite.com/exercises/';
const getImageUrl = (imgFolder: string, index: number) =>
  `${BASE_IMAGE_URL}${imgFolder}/${index}.jpg`;

export default function ExerciseDetail() {
  const { imgFolder, name } = useLocalSearchParams<{ imgFolder: string; name: string }>();
  const { exercise, error } = useExerciseDetails(imgFolder);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }
  if (!exercise) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  // Handle instructions field: flatten array or use as string
  let instructionsText = '';
  try {
    const steps = JSON.parse(exercise.instructions);
    if (Array.isArray(steps)) {
      instructionsText = steps.join(' ');
    } else if (typeof steps === 'string') {
      instructionsText = steps;
    }
  } catch {
    instructionsText = typeof exercise.instructions === 'string'
      ? exercise.instructions
      : '';
  }

  return (
    <ScrollView style={{ backgroundColor: '#181818' }} contentContainerStyle={styles.center}>
      <Text style={styles.title}>{exercise.name}</Text>
      <View style={styles.imgRow}>
        <Image
          source={{ uri: getImageUrl(exercise.imgFolder, 0) }}
          style={styles.image}
          resizeMode="contain"
        />
        <Image
          source={{ uri: getImageUrl(exercise.imgFolder, 1) }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.label}>Body Part: <Text style={styles.value}>{exercise.bodyPart}</Text></Text>
      <Text style={styles.label}>Main Muscle: <Text style={styles.value}>{exercise.mainMuscle}</Text></Text>
      <Text style={styles.label}>Equipment: <Text style={styles.value}>{exercise.equipment}</Text></Text>
      <Text style={styles.label}>Level: <Text style={styles.value}>{exercise.level}</Text></Text>
      <Text style={styles.label}>Force: <Text style={styles.value}>{exercise.force}</Text></Text>
      <Text style={styles.label}>Mechanic: <Text style={styles.value}>{exercise.mechanic}</Text></Text>
      <Text style={styles.label}>Category: <Text style={styles.value}>{exercise.category}</Text></Text>
      {instructionsText && (
        <>
          <Text style={styles.label}>Instructions:</Text>
          <Text style={styles.instructions}>{instructionsText}</Text>
        </>
      )}
      {exercise.muscleWiki && (
        <Text
          style={[styles.label, { color: '#7af', textDecorationLine: 'underline' }]}
          onPress={() => Linking.openURL(exercise.muscleWiki)}
        >
          MuscleWiki
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 24, backgroundColor: '#181818' },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 18, textAlign: 'center' },
  imgRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  image: { width: 120, height: 120, borderRadius: 14, backgroundColor: '#333' },
  label: { color: '#bbb', fontSize: 15, marginTop: 10, fontWeight: 'bold' },
  value: { color: '#fff', fontWeight: 'normal' },
  instructions: { color: '#eee', marginTop: 4, fontSize: 15, lineHeight: 22, textAlign: 'left' },
});
