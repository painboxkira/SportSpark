import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none', // Hide the entire tab bar
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // Even if you define icon, it won't render since the bar is hidden
          tabBarButton: () => null, // Prevent interaction
        }}
      />
    </Tabs>
  );
}
