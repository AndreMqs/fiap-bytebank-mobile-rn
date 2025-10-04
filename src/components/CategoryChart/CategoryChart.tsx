import { arc as d3arc, pie as d3pie } from 'd3-shape';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import BackgroundDesktop from '../../images/BackgroundDesktop.svg';
import BackgroundMobile from '../../images/BackgroundMobile.svg';
import BackgroundTablet from '../../images/BackgroundTablet.svg';
import { useStore } from '../../store/useStore';

export default function CategoryChart() {
  const { getCategoryData } = useStore();
  const data = getCategoryData() || [];

  const { width } = useWindowDimensions();
  const isMobile = width <= 480;
  const isTablet = width <= 768;

  const chartWidth = isMobile ? 300 : 400;
  const chartHeight = isMobile ? 180 : 220;
  const outerRadius = isMobile ? 60 : 70;
  const innerRadius = isMobile ? 35 : 40;

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [fade, scale]);

  const Background = isMobile ? BackgroundMobile : isTablet ? BackgroundTablet : BackgroundDesktop;

  const arcs = useMemo(() => d3pie<any>().value((d: any) => d.value).sort(null)(data), [data]);
  const arcGen = useMemo(() => d3arc().outerRadius(outerRadius).innerRadius(innerRadius), [outerRadius, innerRadius]);

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.bgDecoration}>
        <Background width="100%" height="100%" preserveAspectRatio="xMaxYMax meet" />
      </View>

      <View style={styles.inner}>
        <Text style={styles.title}>Gastos por Categoria</Text>

        {data.length === 0 ? (
          <View style={[styles.card, styles.center]}>
            <Text style={styles.noData}>Nenhum dado disponível</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {isMobile ? (
              <View style={styles.mobileStack}>
                <Animated.View style={{ transform: [{ scale }], opacity: fade }}>
                  <Svg width={chartWidth} height={chartHeight}>
                    <G x={chartWidth / 2} y={chartHeight / 2}>
                      {arcs.map((a: any, i: number) => (
                        <Path key={`slice-${i}`} d={arcGen(a) || ''} fill={data[i].color} />
                      ))}
                    </G>
                  </Svg>
                </Animated.View>

                <View style={styles.legendCol}>
                  {data.map((item: any) => (
                    <View key={item.name} style={styles.legendRow}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText}>{item.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.row}>
                <Animated.View style={{ transform: [{ scale }], opacity: fade }}>
                  <Svg width={chartWidth} height={chartHeight}>
                    <G x={chartWidth / 2} y={chartHeight / 2}>
                      {arcs.map((a: any, i: number) => (
                        <Path key={`slice-${i}`} d={arcGen(a) || ''} fill={data[i].color} />
                      ))}
                    </G>
                  </Svg>
                </Animated.View>

                <View style={styles.legendCol}>
                  {data.map((item: any) => (
                    <View key={item.name} style={styles.legendRow}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText}>{item.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const CONTENT_MAX_WIDTH = 720;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CBCBCB',
    borderRadius: 12,
    padding: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  bgDecoration: {
    position: 'absolute',
    right: 0, bottom: 0, left: 0, top: 0,
    width: '100%', height: '100%',
  },
  inner: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    gap: 20,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#000' },

  card: {
    backgroundColor: '#004D61',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 24,
    width: '100%',
    alignSelf: 'center',
  },
  center: { alignItems: 'center', justifyContent: 'center' },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  mobileStack: { alignItems: 'center', gap: 16 },

  legendCol: { gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { color: '#fff', fontSize: 16 },

  noData: { color: '#fff', fontSize: 16 },
});
