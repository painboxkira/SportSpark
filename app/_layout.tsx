import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ASSET = require('../assets/database/exercise.db');

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SQLiteProvider
          databaseName="exercise.db"
          assetSource={{ assetId: ASSET }}
        >
          <Stack
            screenOptions={{ headerShown: false }}
          >
            {/* With Expo Router, screens are mostly defined via files, but you can declare specific ones if you want custom options */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="ExerciseDB/(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="ExerciseDB/(tabs)/Details" options={{ headerShown: false }} />
            <Stack.Screen name="dashboard/(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" hidden={true} />
        </SQLiteProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
