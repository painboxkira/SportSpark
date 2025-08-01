import { useDashboardBackground } from '@/hooks/useDashboardBackground';
import { StyleSheet, Text } from 'react-native';

export default function ProfileScreen() {
  const DashboardBackground = useDashboardBackground();
  return (
    <DashboardBackground>
      <Text style={styles.title}>👤 Profile</Text>
      <Text style={styles.subtitle}>Manage your identity and preferences.</Text>
    </DashboardBackground>
  );
}

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
