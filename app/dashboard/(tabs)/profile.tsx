import { Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>👤 Profile</Text>
      <Text>Manage your identity and preferences.</Text>
    </View>
  );
}
