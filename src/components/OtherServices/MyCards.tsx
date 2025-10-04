import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import CardBlue from '../../images/CardBlue.svg';
import CardGray from '../../images/CardGray.png';

type CardItem =
  | { type: 'Crédito'; function: 'Crédito'; kind: 'svg'; Svg: typeof CardBlue }
  | { type: 'Débito'; function: 'Débito'; kind: 'png'; img: any };

const cardsMock: CardItem[] = [
  { type: 'Crédito', function: 'Crédito', kind: 'svg', Svg: CardBlue },
  { type: 'Débito', function: 'Débito', kind: 'png', img: CardGray },
];

export default function MyCards({ onBack }: { onBack: () => void }) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  return (
    <Animated.View style={[styles.myCardsContainer, { opacity: fade }]}>
      <View style={styles.content}>
        <View style={styles.titleWrapper}>
          <Pressable onPress={onBack} style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.titleText}>Meus cartões</Text>
        </View>

        <View style={styles.list}>
          {cardsMock.map((card, i) => (
            <View style={styles.section} key={i}>
              <Text style={styles.sectionTitle}>{`Cartão ${card.type}`}</Text>

              <View style={styles.cardImageWrapper}>
                {card.kind === 'svg' ? (
                  <card.Svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
                ) : (
                  <Image source={card.img} style={styles.cardImageRaster} resizeMode="contain" />
                )}
              </View>

              <View style={styles.cardActions}>
                <Pressable
                  onPress={() => {}}
                  style={({ pressed }) => [styles.configButton, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.configButtonText}>Configurar</Text>
                </Pressable>

                <Pressable
                  onPress={() => {}}
                  style={({ pressed }) => [styles.blockButton, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.blockButtonText}>Bloquear</Text>
                </Pressable>

                <Text style={styles.cardFunction}>{`Função: ${card.function}`}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const MAX_CONTENT_WIDTH = 720;

const styles = StyleSheet.create({
  myCardsContainer: {
    backgroundColor: '#CBCBCB',
    borderRadius: 8,
    padding: 32,
    marginBottom: 24,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  bgDecoration: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    zIndex: 1,
    width: '100%',
    alignItems: 'center',
  },
  list: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    gap: 24,
  },
  titleWrapper: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  titleText: {
    fontSize: 25,
    fontWeight: '700',
    color: '#000',
    lineHeight: 30,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  section: {
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#2F2E41',
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
  },
  cardImageWrapper: {
    width: 320,
    height: 170,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardImageRaster: {
    width: '100%',
    height: '100%',
  },
  cardActions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  configButton: {
    width: 250,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FF5031',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  blockButtonText: {
    color: '#BF1313',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardFunction: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2F2E41',
    marginTop: 8,
    textAlign: 'center',
  },
});
