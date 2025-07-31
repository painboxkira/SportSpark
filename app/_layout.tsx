import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Configure navigation bar for Android
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{headerShown:false,}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <SafeAreaProvider>
          <Stack.Screen name="ExerciseDB/(tabs)" options={{ headerShown: false }} />
          </SafeAreaProvider> 
        <SafeAreaProvider>
        <Stack.Screen name="dashboard/(tabs)" options={{ headerShown: false }} />
        </SafeAreaProvider>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" hidden={true} />

    </ThemeProvider>
  );
}
