import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { ModeSelectorProps } from '../../types/components';

export const ModeSelector = ({ currentMode, onModeChange }: ModeSelectorProps) => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 425;

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  const mkPressScale = () => new Animated.Value(1);
  const scaleManual = useRef(mkPressScale()).current;
  const scaleCsv = useRef(mkPressScale()).current;

  const pressIn = (v: Animated.Value) => Animated.spring(v, { toValue: 0.98, useNativeDriver: true }).start();
  const pressOut = (v: Animated.Value) => Animated.spring(v, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.modeSelector, isMobile && styles.modeSelectorMobile, { opacity: fade }]}>
      <Animated.View style={{ transform: [{ scale: scaleManual }] }}>
        <Pressable
          onPress={() => onModeChange('manual')}
          onPressIn={() => pressIn(scaleManual)}
          onPressOut={() => pressOut(scaleManual)}
          style={[styles.modeButton, currentMode === 'manual' && styles.modeButtonActive, isMobile && styles.modeButtonMobile]}
        >
          <Text style={[styles.modeButtonText, currentMode === 'manual' && styles.modeButtonTextActive]}>Entrada Manual</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: scaleCsv }] }}>
        <Pressable
          onPress={() => onModeChange('csv')}
          onPressIn={() => pressIn(scaleCsv)}
          onPressOut={() => pressOut(scaleCsv)}
          style={[styles.modeButton, currentMode === 'csv' && styles.modeButtonActive, isMobile && styles.modeButtonMobile]}
        >
          <Text style={[styles.modeButtonText, currentMode === 'csv' && styles.modeButtonTextActive]}>Upload CSV</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  modeSelectorMobile: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#004D61',
    backgroundColor: 'transparent',
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#004D61',
  },
  modeButtonMobile: {
    width: 200,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DEE9EA',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
});
