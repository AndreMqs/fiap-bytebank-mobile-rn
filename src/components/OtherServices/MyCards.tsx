import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import BackgroundDesktop from '../../images/BackgroundDesktop.svg';
import CardImage from '../../images/Card.svg';

const cardsMock = [
  { type: 'Crédito', image: CardImage, function: 'Crédito' },
  { type: 'Débito', image: CardImage, function: 'Débito' },
];

export default function MyCards({ onBack }: { onBack: () => void }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scaleBack = useRef(new Animated.Value(1)).current;
  const scaleConfig = useRef(new Animated.Value(1)).current;
  const scaleBlock = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  const pressIn = (v: Animated.Value) => Animated.spring(v, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = (v: Animated.Value) => Animated.spring(v, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.myCardsContainer, { opacity: fade }]}>
      <View style={styles.bgDecoration}>
        <BackgroundDesktop width="100%" height="100%" preserveAspectRatio="xMaxYMin meet" />
      </View>

      <View style={styles.title}>
        <Animated.View style={{ transform: [{ scale: scaleBack }] }}>
          <Pressable
            onPress={onBack}
            onPressIn={() => pressIn(scaleBack)}
            onPressOut={() => pressOut(scaleBack)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
        </Animated.View>
        <Text style={styles.titleText}>Meus cartões</Text>
      </View>

      {cardsMock.map((card, i) => (
        <View style={styles.section} key={i}>
          <Text style={styles.sectionTitle}>{`Cartão ${card.type}`}</Text>
          <View style={styles.cardRow}>
            <Image source={card.image} style={styles.cardImage} resizeMode="contain" />
            <View style={styles.cardActions}>
              <Animated.View style={{ transform: [{ scale: scaleConfig }] }}>
                <Pressable
                  onPressIn={() => pressIn(scaleConfig)}
                  onPressOut={() => pressOut(scaleConfig)}
                  style={styles.configButton}
                >
                  <Text style={styles.configButtonText}>Configurar</Text>
                </Pressable>
              </Animated.View>
              <Animated.View style={{ transform: [{ scale: scaleBlock }] }}>
                <Pressable
                  onPressIn={() => pressIn(scaleBlock)}
                  onPressOut={() => pressOut(scaleBlock)}
                  style={styles.blockButton}
                >
                  <Text style={styles.blockButtonText}>Bloquear</Text>
                </Pressable>
              </Animated.View>
              <Text style={styles.cardFunction}>{`Função: ${card.function}`}</Text>
            </View>
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  myCardsContainer: {
    backgroundColor: '#CBCBCB',
    borderRadius: 8,
    padding: 32,
    marginBottom: 24,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  bgDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  titleText: {
    fontSize: 25,
    fontWeight: '700',
    color: '#000',
    lineHeight: 30,
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  section: {
    width: '100%',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#2F2E41',
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 32,
    width: '100%',
  },
  cardImage: {
    width: 320,
    height: 160,
    borderRadius: 12,
  },
  cardActions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
    marginTop: 8,
  },
  configButton: {
    width: 250,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FF5031',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  configButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  blockButton: {
    width: 250,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#BF1313',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  blockButtonText: {
    color: '#BF1313',
    fontSize: 18,
    fontWeight: '700',
  },
  cardFunction: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2F2E41',
    marginTop: 8,
  },
});
