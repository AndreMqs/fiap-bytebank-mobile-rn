import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Select(props: SelectProps) {
  const { value, options, placeholder, onChange } = props;
  const [selectValue, setSelectValue] = useState<string>(placeholder ?? '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value == null || value === '') {
      setSelectValue(placeholder ?? '');
      return;
    }
    setSelectValue(value);
  }, [value, placeholder]);

  const isSelected = (option: string) => selectValue === option;

  const pressScale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(pressScale, { toValue: 0.98, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start();

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (open) {
      fade.setValue(0);
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    }
  }, [open, fade]);

  const placeholderValue = useMemo(() => placeholder ?? '', [placeholder]);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Pressable
          onPress={() => setOpen(true)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={({ pressed }) => [styles.transactionSelect, pressed && styles.transactionSelectFocused]}
        >
          <Text style={styles.selectText}>{selectValue || placeholderValue}</Text>
        </Pressable>
      </Animated.View>

      <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
        <Animated.View style={[styles.backdrop, { opacity: fade }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={styles.menuPaper}>
            <View style={styles.menuHeader}>
              <Text style={styles.placeholderText}>{placeholderValue}</Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(o) => o}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.transactionOption,
                    isSelected(item) && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectValue(item);
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected(item) && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

interface SelectProps {
  value: string;
  onChange: (option: string) => void;
  options: string[];
  placeholder?: string;
  style?: React.CSSProperties | any;
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  transactionSelect: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#004D61',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  transactionSelectFocused: {
    borderColor: '#47A138',
  },
  selectText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19.36,
    color: '#000',
    textAlign: 'left',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuPaper: {
    borderWidth: 1,
    borderColor: '#47A138',
    borderTopWidth: 0,
    borderRadius: 8,
    width: 252,
    maxHeight: 320,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  menuHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#47A138',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  transactionOption: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#E4EDE3',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19.36,
    color: '#444444',
    textAlign: 'center',
  },
  optionTextSelected: {
    fontWeight: '700',
  },
});
