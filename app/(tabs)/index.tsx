import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

export default function HomeScreen() {
  const opacity = useSharedValue(1);

  const handlePress = () => {
    // Animate fade out
    opacity.value = withTiming(0, { duration: 500 }, () => {
      runOnJS(router.replace)('/ExerciseDB/(tabs)');
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: withTiming(opacity.value, { duration: 500 }) }],
  }));

  return (
    <LinearGradient
      colors={['#E8E8E8', '#C0C0C0', '#808080', '#4A4A4A', '#2C2C2C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.headerView, animatedStyle]}>
        <BlurView intensity={60} tint="light" style={styles.logoBlurWrapper}>
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.3)',
              'rgba(200,200,255,0.2)',
              'rgba(150,150,255,0.1)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradientOverlay}
          >
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
          </LinearGradient>
        </BlurView>

        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <LinearGradient
            colors={['#1A1A1A', '#2D2D2D', '#404040']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>UNLEASH THE BEAST</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerView: {
    flex: 1,
    justifyContent: 'center', // ⬇️ Center logo & button vertically
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 40, // 🧃 Space between logo and button
  },

  logoBlurWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },

  logoGradientOverlay: {
    borderRadius: 25,
    padding: 6,
  },

  logo: {
    width: 280,
    height: 280,
    resizeMode: 'contain',
    borderRadius: 21,
  },

  button: {
    borderRadius: 16,
    elevation: 12,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: '#404040',
  },

  buttonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
});