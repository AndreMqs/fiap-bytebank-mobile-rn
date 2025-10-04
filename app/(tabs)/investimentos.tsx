import { ThemedText } from '@/components/themed-text';
import Investments from '@/src/components/Investments/Investments';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InvestimentosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#004D61', '#E4EDE3']}
          style={styles.header}
        >
          <ThemedText style={styles.title}>Investimentos</ThemedText>
          <ThemedText style={styles.subtitle}>
            Gerencie sua carteira de investimentos
          </ThemedText>
        </LinearGradient>

        {/* Investments Component */}
        <View style={styles.investmentsContainer}>
          <Investments />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  investmentsContainer: {
    margin: 20,
  },
});