import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { useUser } from '../../hooks/useParentApp';
import Avatar from '../../images/Avatar.svg';
import Fechar from '../../images/Fechar.svg';
import { HeaderProps } from '../../types/header';

export default function Header(props: HeaderProps) {
  const { items, onMenuClick } = props;
  const { getUserName } = useUser();
  const { width } = useWindowDimensions();
  const isMobile = width <= 425;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fade = useMemo(() => new Animated.Value(0), []);
  const scale = useMemo(() => new Animated.Value(0.98), []);

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setIsMenuOpen(false);
      scale.setValue(0.98);
    });
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerGrid}>
        {isMobile ? (
          <View style={styles.mobileHeaderContainer}>
            <TouchableOpacity onPress={openMenu} style={styles.iconBtn} accessibilityLabel="Abrir menu">
              <MaterialIcons name="menu" size={32} color="#FF5031" />
            </TouchableOpacity>
            <Avatar width={40} height={40} />
          </View>
        ) : (
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{getUserName()}</Text>
            <Avatar width={40} height={40} />
          </View>
        )}
      </View>

      {isMenuOpen && (
        <Animated.View style={[styles.mobileMenuContainer, { opacity: fade, transform: [{ scale }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={closeMenu} accessibilityLabel="Fechar menu">
            <Fechar width={20} height={20} />
          </TouchableOpacity>

          {items.map((item) => (
            <TouchableOpacity
              key={item.title}
              onPress={() => {
                onMenuClick(item.title);
                closeMenu();
              }}
              style={[styles.menuItem, item.selected && styles.itemSelected]}
            >
              <Text style={[styles.menuItemText, item.selected && styles.menuItemTextSelected]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 96,
    width: '100%',
    marginBottom: 24,
    backgroundColor: '#004D61',
    zIndex: 100,
    elevation: 100,
  },
  headerGrid: {
    flex: 1,
    marginRight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  userNameContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  mobileHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  iconBtn: {
    padding: 8,
  },
  mobileMenuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E4EDE3',
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 24,
    zIndex: 1000,
    elevation: 1000,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 16,
    marginHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  itemSelected: {
    borderBottomColor: '#47A138',
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  menuItemTextSelected: {
    color: '#FF5031',
  },
});
