import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import BackgroundDesktop from '../../images/BackgroundDesktop.svg';
import BackgroundMobile from '../../images/BackgroundMobile.svg';
import BackgroundTablet from '../../images/BackgroundTablet.svg';
import Card from '../../images/Card.svg';
import Donation from '../../images/Donation.svg';
import Financial from '../../images/Financial.svg';
import Insurance from '../../images/Insurance.svg';
import Phone from '../../images/phone.svg';
import Pix from '../../images/pix.svg';
import MyCards from './MyCards';

const services = [
  { key: 'emprestimo', label: 'Empréstimo', icon: Financial },
  { key: 'cartoes', label: 'Meus cartões', icon: Card },
  { key: 'doacoes', label: 'Doações', icon: Donation },
  { key: 'pix', label: 'Pix', icon: Pix },
  { key: 'seguros', label: 'Seguros', icon: Insurance },
  { key: 'celular', label: 'Crédito celular', icon: Phone },
];

export default function OtherServices() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showMyCards, setShowMyCards] = useState(false);

  const { width } = useWindowDimensions();
  const cols = width <= 425 ? 1 : width <= 768 ? 2 : 3;
  const isTablet = width <= 768;
  const isMobile = width <= 425;

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  const Background = isMobile ? BackgroundMobile : isTablet ? BackgroundTablet : BackgroundDesktop;

  const cardBasis = useMemo(() => `${100 / cols}%`, [cols]);

  if (showMyCards) {
    return <MyCards onBack={() => setShowMyCards(false)} />;
  }

  return (
    <Animated.View style={[styles.otherServicesContainer, { opacity: fade }]}>
      <View pointerEvents="none" style={styles.bgDecoration}>
        <Background width="100%" height="100%" preserveAspectRatio="xMaxYMin meet" />
      </View>

      <Text style={styles.title}>Confira os serviços disponíveis</Text>
      <View style={[styles.grid, { gap: width <= 425 ? 16 : 24 }]}>
        {services.map((service) => {
          const Icon = service.icon;
          const pressScale = new Animated.Value(1);
          const onPressIn = () => Animated.spring(pressScale, { toValue: 0.98, useNativeDriver: true }).start();
          const onPressOut = () => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start();
          const isSelected = selected === service.key;
          return (
            <Animated.View key={service.key} style={{ transform: [{ scale: pressScale }], flexBasis: cardBasis, maxWidth: '100%' }}>
              <Pressable
                onPress={() => {
                  setSelected(service.key);
                  if (service.key === 'cartoes') setShowMyCards(true);
                }}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[styles.card, isSelected && styles.selected, isTablet && styles.cardTablet, isMobile && styles.cardMobile]}
              >
                <Icon width={60} height={60} />
                <Text style={styles.cardLabel}>{service.label}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  otherServicesContainer: {
    backgroundColor: '#CBCBCB',
    borderRadius: 8,
    padding: 32,
    position: 'relative',
    width: '100%',
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
    fontSize: 25,
    fontWeight: '700',
    color: '#000',
    lineHeight: 30,
    marginBottom: 32,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 145,
    minWidth: 173,
    marginBottom: 0,
  },
  cardTablet: {
    minWidth: 120,
    minHeight: 120,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  cardMobile: {
    minWidth: '100%',
    minHeight: 100,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  selected: {
    borderColor: '#47A138',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 16,
    textAlign: 'center',
  },
});
