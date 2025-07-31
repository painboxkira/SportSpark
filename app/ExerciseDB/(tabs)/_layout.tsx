// app/exercises/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Dumbbell, Search } from 'lucide-react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#111', borderTopWidth: 0 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'All',
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="[muscle]"
        options={{
          title: 'By Muscle',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      {/* Add more screens as you add files */}
    </Tabs>
  );
}
