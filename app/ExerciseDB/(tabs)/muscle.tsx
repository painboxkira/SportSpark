import { useMuscleData } from '@/hooks/useMuscleData';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import React, { useRef, useState } from 'react';
import { Dimensions, ImageBackground, Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const ASSET = require('../../../assets/database/exercise.db');

// Mapping from HTML muscle IDs to database muscle names
const MUSCLE_ID_MAP: Record<string, string> = {
  // HTML ID -> Database name
  'quads': 'quadriceps',
  'abdominals': 'abdominals',
  'biceps': 'biceps',
  'triceps': 'triceps',
  'chest': 'chest',
  'lats': 'lats',
  'glutes': 'glutes',
  'hamstrings': 'hamstrings',
  'calves': 'calves',
  'forearms': 'forearms',
  'traps': 'traps',
  'front-shoulders': 'shoulders',
  'rear-shoulders': 'shoulders',
  'traps-middle': 'traps',
  'obliques': 'obliques',
  'hands': 'forearms', // hands exercises often target forearms
  'lowerback': 'lower back',
};

const BLURB: Record<string, string> = {
  // Upper Body
  chest: 'The pectoralis major is the large muscle of the chest. It helps with pushing movements and arm adduction.',
  'front-shoulders': 'The anterior deltoids flex and internally rotate the arm at the shoulder.',
  'rear-shoulders': 'The posterior deltoids extend and externally rotate the arm at the shoulder.',
  biceps: 'The biceps brachii flexes the elbow and supinates the forearm. Key muscle for pulling movements.',
  triceps: 'The triceps brachii extends the elbow. Essential for pushing movements and arm extension.',
  forearms: 'Forearm muscles control wrist and finger movements. Important for grip strength.',
  hands: 'The hands contain intricate muscles for fine motor control and grip strength.',
  
  // Back
  lats: 'The latissimus dorsi are the broadest muscles of the back. They pull the arms toward the body.',
  traps: 'The trapezius elevates, retracts, and rotates the shoulder blades.',
  'traps-middle': 'The middle trapezius retracts the shoulder blades and maintains good posture.',
  lowerback: 'The lower back muscles support the spine and help with hip extension.',
  
  // Core
  abdominals: 'The abdominals flex the spine and provide core stability for all movements.',
  obliques: 'The obliques rotate and side-bend the torso. Important for rotational power.',
  
  // Lower Body
  glutes: 'The gluteus maximus is the largest muscle in the body. Essential for hip extension and power.',
  quads: 'The quadriceps extend the knee and flex the hip. Key muscles for squatting and jumping.',
  hamstrings: 'The hamstrings flex the knee and extend the hip. Important for running and posterior chain.',
  calves: 'The calf muscles plantarflex the foot and provide propulsion during walking and running.',
};

export default function Muscle() {
  return (
    <SQLiteProvider
      databaseName="exercise.db"
      assetSource={{ assetId: ASSET }}
    >
      <MuscleContent />
    </SQLiteProvider>
  );
}

function MuscleContent() {
  const [muscle, setMuscle] = useState<string | null>(null);
  const webref = useRef<WebView>(null);
  const router = useRouter();
  const mappedMuscleName = muscle ? MUSCLE_ID_MAP[muscle] || muscle : null;
  const { muscleData, loading, error } = useMuscleData(mappedMuscleName);

  const handleOpenWiki = async () => {
    if (muscleData?.wiki) {
      try {
        await Linking.openURL(muscleData.wiki);
      } catch (err) {
        console.error('Failed to open URL:', err);
      }
    }
  };

  const handleSeeExercises = () => {
    if (muscle && mappedMuscleName) {
      router.push({
        pathname: '/ExerciseDB/(tabs)/filteredIndex',
        params: { muscle: mappedMuscleName }
      });
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/bgmuscle.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <WebView
        ref={webref}
        style={{ width, flex: 1, height: '100%', marginTop: 24, backgroundColor: 'transparent' }}
        originWhitelist={['*']}
        source={require('../../../assets/musclemap/muscle.html')}
        onMessage={e => {
          const id = e.nativeEvent.data;
          setMuscle(id);
        }}
      />

      {muscle && (
        <BlurView intensity={60} tint="dark" style={styles.cardBlur}>
          <View style={styles.card}>
            <Pressable style={styles.closeButton} onPress={() => setMuscle(null)}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
            
            <Text style={styles.title}>{muscle.toUpperCase()}</Text>
            <Text style={styles.body}>{BLURB[muscle]}</Text>
            
            <View style={styles.buttonContainer}>
              {muscleData?.wiki && (
                <TouchableOpacity style={styles.wikiButton} onPress={handleOpenWiki}>
                  <Text style={styles.buttonText}>MuscleWiki</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.exerciseButton} onPress={handleSeeExercises}>
                <Text style={styles.buttonText}>See Exercises</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'transparent', height: '100%' },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff6f92',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  cardBlur: {
    position: 'absolute',
    bottom: 108,
    left: 20,
    right: 20,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 10,
  },
  card: {
    backgroundColor: 'rgba(30,33,43,0.7)',
    borderRadius: 14,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#ff6f92', marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 19, color: '#c6cad9', marginBottom: 16 },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 80,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ff6f92',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e212b',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  wikiButton: {
    flex: 1,
    backgroundColor: '#4a9eff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  exerciseButton: {
    flex: 1,
    backgroundColor: '#ff6f92',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
