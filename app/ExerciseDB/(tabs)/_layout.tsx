// app/exercises/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Dumbbell, Info } from 'lucide-react-native';

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
        name="muscle"
        options={{
          title: 'Muscle',
          tabBarIcon: ({ color, size }) => <Info color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Details"
        options={{
          title: 'Details',
          href: null,
          tabBarIcon: ({ color, size }) => <Info color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="filteredIndex"
        options={{
          title: 'Filtered',
          href: null,
          tabBarIcon: ({ color, size }) => <Info color={color} size={size} />,
        }}
      />
      {/* Add more screens as you add files */}
    </Tabs>
  );
}
