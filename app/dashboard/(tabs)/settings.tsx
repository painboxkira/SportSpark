import { Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>⚙️ Settings</Text>
      <Text>Configure your app settings here.</Text>
    </View>
  );
}
