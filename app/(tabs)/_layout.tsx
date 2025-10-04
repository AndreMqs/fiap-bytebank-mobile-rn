import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/src/components/haptic-tab';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Colors } from '@/src/constants/theme';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: 70 + Math.max(insets.bottom, 0),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 2,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transferencias"
        options={{
          title: 'Transferir',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="arrow.left.arrow.right" color={color} />,
        }}
      />
      <Tabs.Screen
        name="investimentos"
        options={{
          title: 'Investir',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="chart.line.uptrend.xyaxis" color={color} />,
        }}
      />
      <Tabs.Screen
        name="outros-servicos"
        options={{
          title: 'Serviços',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="ellipsis.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="extrato"
        options={{
          title: 'Extrato',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="doc.text" color={color} />,
        }}
      />
    </Tabs>
  );
}
