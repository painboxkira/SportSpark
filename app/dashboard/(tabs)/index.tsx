import { useDashboardBackground } from '@/hooks/useDashboardBackground';
import { StyleSheet, Text } from 'react-native';

export default function DashboardHome() {
  const DashboardBackground = useDashboardBackground();
  return (
    <DashboardBackground>
      <Text style={styles.text}>💪 Welcome to your Dashboard</Text>
    </DashboardBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', alignItems: 'center',
  },
  text: {
    color: '#F9D342', fontSize: 24, fontWeight: 'bold',
  },
});