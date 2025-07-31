import React, { useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const BLURB: Record<string, string> = { /* …your blurbs… */ };

export default function Muscle() {
  const [muscle, setMuscle] = useState<string | null>(null);
  const webref = useRef<WebView>(null);

  return (
    <View style={styles.container}>
      <WebView
        ref={webref}
        style={{ width, flex: 1,height: '100%',marginTop: 24 }}
        originWhitelist={['*']}
        source={require('../../../assets/musclemap/muscle.html')}
        onMessage={e => {
          const id = e.nativeEvent.data;

          
        }}
      />

      
      {/* info card (unchanged) */}
      {muscle && (
        <Pressable style={styles.card} onPress={() => setMuscle(null)}>
          <Text style={styles.title}>{muscle.toUpperCase()}</Text>
          <Text style={styles.body}>{BLURB[muscle] ?? 'No info yet.'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0e14',height: '100%' },
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
  card: {
    position: 'absolute',
    bottom: 108,
    left: 20,
    right: 20,
    backgroundColor: '#1e212b',
    borderRadius: 14,
    padding: 16,
    elevation: 10,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#ff6f92', marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 19, color: '#c6cad9' },
});
