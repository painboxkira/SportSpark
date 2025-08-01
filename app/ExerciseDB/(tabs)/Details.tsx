import { useExerciseDetails } from '@/hooks/useExerciseDetails';
import { useLocalSearchParams } from 'expo-router';
import { Dumbbell, ExternalLink, Flame, Settings, Target, TrendingUp, Wrench, Zap } from 'lucide-react-native';
import { Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

const BASE_IMAGE_URL = 'https://mediumvioletred-dogfish-712473.hostingersite.com/exercises/';
const getImageUrl = (imgFolder: string, index: number) =>
  `${BASE_IMAGE_URL}${imgFolder}/${index}.jpg`;

export default function ExerciseDetail() {
  const { imgFolder, name } = useLocalSearchParams<{ imgFolder: string; name: string }>();
  const { exercise, error } = useExerciseDetails(imgFolder);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Flame size={48} color="#ffdb57" style={{ marginBottom: 15 }} />
          <Text style={styles.errorText}>EXERCISE NOT FOUND, BRO!</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Flame size={48} color="#ffdb57" style={{ marginBottom: 15 }} />
          <Text style={styles.loadingText}>LOADING GAINS...</Text>
        </View>
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
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      {/* HERO TITLE */}
      <View style={styles.heroSection}>
        <View style={styles.heroTitleContainer}>
          <Dumbbell size={32} color="#ffdb57" />
          <Text style={styles.heroTitle}>{exercise.name.toUpperCase()}</Text>
          <Dumbbell size={32} color="#ffdb57" />
        </View>
        <Text style={styles.heroSubtitle}>TIME TO GET SWOLE!</Text>
      </View>

      {/* EXERCISE IMAGES */}
      <View style={styles.imageSection}>
        <View style={styles.sectionTitleContainer}>
          <Target size={24} color="#ffdb57" />
          <Text style={styles.sectionTitle}>FORM CHECK</Text>
        </View>
        <View style={styles.imgRow}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getImageUrl(exercise.imgFolder, 0) }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.imageLabel}>START</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getImageUrl(exercise.imgFolder, 1) }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.imageLabel}>FINISH</Text>
          </View>
        </View>
      </View>

      {/* EXERCISE STATS */}
      <View style={styles.statsSection}>
        <View style={styles.sectionTitleContainer}>
          <Zap size={24} color="#ffdb57" />
          <Text style={styles.sectionTitle}>EXERCISE INTEL</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Target size={20} color="#ffdb57" style={{ marginBottom: 5 }} />
            <Text style={styles.statLabel}>TARGET</Text>
            <Text style={styles.statValue}>{exercise.bodyPart?.toUpperCase()}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Zap size={20} color="#ffdb57" style={{ marginBottom: 5 }} />
            <Text style={styles.statLabel}>MUSCLE</Text>
            <Text style={styles.statValue}>{exercise.mainMuscle?.toUpperCase()}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Dumbbell size={20} color="#ffdb57" style={{ marginBottom: 5 }} />
            <Text style={styles.statLabel}>GEAR</Text>
            <Text style={styles.statValue}>{exercise.equipment?.toUpperCase()}</Text>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#ffdb57" style={{ marginBottom: 5 }} />
            <Text style={styles.statLabel}>LEVEL</Text>
            <Text style={styles.statValue}>{exercise.level?.toUpperCase()}</Text>
          </View>
          
          {exercise.force && (
            <View style={styles.statCard}>
              <Flame size={20} color="#ffdb57" style={{ marginBottom: 5 }} />
              <Text style={styles.statLabel}>FORCE</Text>
              <Text style={styles.statValue}>{exercise.force?.toUpperCase()}</Text>
            </View>
          )}
          
          {exercise.mechanic && (
            <View style={styles.statCard}>
              <Settings size={20} color="#ffdb57" style={{ marginBottom: 5 }} />
              <Text style={styles.statLabel}>TYPE</Text>
              <Text style={styles.statValue}>{exercise.mechanic?.toUpperCase()}</Text>
            </View>
          )}
        </View>
      </View>

      {/* INSTRUCTIONS */}
      {instructionsText && (
        <View style={styles.instructionsSection}>
          <View style={styles.sectionTitleContainer}>
            <Wrench size={24} color="#ffdb57" />
            <Text style={styles.sectionTitle}>HOW TO CRUSH IT</Text>
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructions}>{instructionsText}</Text>
          </View>
        </View>
      )}

      {/* MUSCLE WIKI LINK */}
      {exercise.muscleWiki && (
        <View style={styles.linkSection}>
          <View style={styles.wikiLinkContainer}>
            <ExternalLink size={20} color="#ffdb57" />
            <Text
              style={styles.wikiLink}
              onPress={() => Linking.openURL(exercise.muscleWiki)}
            >
              LEARN MORE ON MUSCLEWIKI
            </Text>
            <ExternalLink size={20} color="#ffdb57" />
          </View>
        </View>
      )}

      {/* MOTIVATIONAL FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerContainer}>
          <Flame size={24} color="#ffdb57" />
          <Text style={styles.footerText}>NO PAIN, NO GAIN!</Text>
          <Flame size={24} color="#ffdb57" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#00509d',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#00509d',
  },
  
  // ERROR & LOADING STATES
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ffdb57',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    color: '#ffdb57',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffdb57',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  // HERO SECTION
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 219, 87, 0.1)',
    borderColor: '#ffdb57',
    borderWidth: 2,
  },
  heroTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#ffdb57',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  heroSubtitle: {
    color: '#ffdb57',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.9,
  },

  // SECTION TITLES
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#ffdb57',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // IMAGE SECTION
  imageSection: {
    marginBottom: 30,
  },
  imgRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 219, 87, 0.1)',
    borderColor: '#ffdb57',
    borderWidth: 2,
  },
  imageLabel: {
    color: '#ffdb57',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },

  // STATS SECTION
  statsSection: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'rgba(255, 219, 87, 0.1)',
    borderColor: '#ffdb57',
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    minWidth: '47%',
    alignItems: 'center',
  },
  statLabel: {
    color: '#ffdb57',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    color: '#ffdb57',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
  },

  // INSTRUCTIONS SECTION
  instructionsSection: {
    marginBottom: 30,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255, 219, 87, 0.1)',
    borderColor: '#ffdb57',
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
  },
  instructions: {
    color: '#ffdb57',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'left',
  },

  // LINK SECTION
  linkSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  wikiLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 219, 87, 0.2)',
    borderRadius: 25,
    borderColor: '#ffdb57',
    borderWidth: 2,
  },
  wikiLink: {
    color: '#ffdb57',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    textDecorationLine: 'underline',
    flexShrink: 1,
  },

  // FOOTER
  footer: {
    alignItems: 'center',
    paddingVertical: 25,
    marginTop: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  footerText: {
    color: '#ffdb57',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
});