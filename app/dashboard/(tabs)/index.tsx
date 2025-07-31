import { StyleSheet, Text, View } from 'react-native';

export default function DashboardHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💪 Welcome to your Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
  },
  text: {
    color: '#F9D342', fontSize: 24, fontWeight: 'bold',
  },
});