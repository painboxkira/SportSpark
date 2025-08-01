// app/dashboard/(tabs)/stats.tsx
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  webview: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent', // Ensure background is transparent for the ImageBackground
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});


import { ImageBackground } from 'react-native';

export default function StatsScreen() {
  const webviewRef = useRef<WebView>(null);
  const [webviewError, setWebviewError] = useState<string | null>(null);
  const [webviewLoaded, setWebviewLoaded] = useState(false);

  // Send mock muscle load data to WebView
  const sendMockMuscleLoad = () => {
    if (webviewRef.current) {
      const mockLoads = {
        quads: Math.random(),
        calves: Math.random(),
        biceps: Math.random(),
        traps: Math.random(),
      };
      const payload = JSON.stringify({
        type: 'muscleLoads',
        data: mockLoads,
      });
      console.log('Sending to WebView:', payload); // <-- log what's sent
      webviewRef.current.postMessage(payload);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/pitbg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {!webviewLoaded && !webviewError && (
        <Text style={{ textAlign: 'center', marginTop: 32 }}>Loading WebView...</Text>
      )}
      {webviewError && (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 32 }}>
          WebView failed to load: {webviewError}
        </Text>
      )}
      <View style={styles.container}>
        <WebView
          ref={webviewRef}
          style={styles.webview}
          originWhitelist={['*']}
          source={require('@/assets/musclemap/muscle copy.html')}
          javaScriptEnabled
          domStorageEnabled
          injectedJavaScript={`
            window.document.addEventListener('message', function(event) {
              console.log('WebView received message:', event.data); // <-- log in WebView
            });
            true;
          `}
          onLoadStart={() => {
            setWebviewLoaded(false);
          }}
          onLoadEnd={() => {
            setWebviewLoaded(true);
            setTimeout(sendMockMuscleLoad, 500);
          }}
          onError={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
            setWebviewError(nativeEvent.description || 'Unknown error');
          }}
          onMessage={event => {
            const data = event.nativeEvent.data;
            console.log('Received from WebView:', data); // <-- log what's received
            if (data === 'getMuscleLoads') {
              const mockLoads = {
                quads: Math.random(),
                calves: Math.random(),
                biceps: Math.random(),
                traps: Math.random(),
              };
              const payload = JSON.stringify({
                type: 'muscleLoads',
                data: mockLoads,
              });
              console.log('Responding to getMuscleLoads with:', payload); // <-- log response
              webviewRef.current?.postMessage(payload);
            }
          }}
        />
      </View>
    </ImageBackground>
  );
}