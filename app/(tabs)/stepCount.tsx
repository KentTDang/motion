import { Pedometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function StepCounter() {
  const [stepsToday, setStepsToday] = useState(0);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    // Check if the pedometer is available on this device
    Pedometer.isAvailableAsync().then(
      result => setIsAvailable(result),
      error => console.log("Pedometer not available:", error)
    );

    // Get steps from the start of today until now
    const fetchSteps = async () => {
      const start = new Date();
      start.setHours(0, 0, 0, 0); // midnight today
      const end = new Date();     // current time

      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        setStepsToday(result.steps);
      } catch (error) {
        console.log("Error getting steps:", error);
      }
    };
    fetchSteps();
    const interval = setInterval(fetchSteps, 5000);
    return () => clearInterval(interval);

  }, []);

  return (
    <View style={styles.container}>
      {isAvailable === false ? (
        <Text>Pedometer is not available on this device.</Text>
      ) : (
        <Text style={styles.text}>Steps today: {stepsToday}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});
