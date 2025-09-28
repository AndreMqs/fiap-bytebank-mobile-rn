import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MainPage from './components/MainPage/MainPage';

export default function App() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [fade]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.global} edges={['top', 'right', 'bottom', 'left']}>
        <Animated.View style={{ flex: 1, opacity: fade }}>
          <MainPage />
        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  global: {
    flex: 1,
    backgroundColor: '#e4ede3',
    width: '100%',
  },
});
