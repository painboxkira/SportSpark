import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export function useDashboardBackground() {
  return function DashboardBackground({ children }: { children: React.ReactNode }) {
    return (
      <ImageBackground
        source={require('../assets/images/bglab.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    );
  };
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
