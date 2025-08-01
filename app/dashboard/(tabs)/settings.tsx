import { useDashboardBackground } from '@/hooks/useDashboardBackground';
import { StyleSheet, Text } from 'react-native';
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: '#F9D342',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default function SettingsScreen() {
  const DashboardBackground = useDashboardBackground();
  return (
    <DashboardBackground>
      <Text style={styles.title}>⚙️ Settings</Text>
      <Text style={styles.subtitle}>Configure your app settings here.</Text>
    </DashboardBackground>
  );
}

