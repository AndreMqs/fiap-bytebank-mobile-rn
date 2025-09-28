import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';

interface MenuProps {
  items: {
    title: string;
    route: string;
    selected: boolean;
  }[];
  onMenuClick: (title: string) => void;
}

export default function Menu(props: MenuProps) {
  const { items, onMenuClick } = props;
  const { width } = useWindowDimensions();
  const isTablet = width <= 768;
  const isMobile = width <= 425;

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [fade]);

  const containerStyle = useMemo(() => {
    return [
      styles.menuContainer,
      isTablet && styles.menuContainerTablet,
    ];
  }, [isTablet]);

  if (isMobile) return null;

  return (
    <Animated.View style={[{ opacity: fade }, ...containerStyle]}>
      {items.map((item) => {
        const pressScale = new Animated.Value(1);
        const onPressIn = () => Animated.spring(pressScale, { toValue: 0.98, useNativeDriver: true }).start();
        const onPressOut = () => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start();
        return (
          <Animated.View key={item.title} style={{ transform: [{ scale: pressScale }] }}>
            <Pressable
              onPress={() => onMenuClick(item.title)}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={[
                styles.menuItem,
                item.selected && styles.itemSelected,
                isTablet && styles.menuItemTablet,
              ]}
            >
              <Text
                style={[
                  styles.menuItemText,
                  item.selected && styles.menuItemTextSelected,
                ]}
              >
                {item.title}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    width: 180,
    borderRadius: 8,
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  menuContainerTablet: {
    width: '100%',
    height: '100%',
    paddingBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    gap: 16,
    paddingHorizontal: 0,
    paddingTop: 16,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  menuItemTablet: {
    width: 'auto',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  itemSelected: {
    borderBottomColor: '#47A138',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19.36,
    textAlign: 'center',
    color: '#000000',
  },
  menuItemTextSelected: {
    color: '#47A138',
  },
});
