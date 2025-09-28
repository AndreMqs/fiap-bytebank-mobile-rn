import { arc as d3arc, pie as d3pie } from 'd3-shape';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { useStore } from '../../store/useStore';

import BackgroundDesktop from '../../images/BackgroundDesktop.svg';
import BackgroundMobile from '../../images/BackgroundMobile.svg';
import BackgroundTablet from '../../images/BackgroundTablet.svg';

export default function CategoryChart() {
  const { getCategoryData } = useStore();
  const data = getCategoryData() || [];

  const { width } = useWindowDimensions();
  const isMobile = width <= 425;
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

  const arcs = useMemo(() => {
    const p = d3pie<any>().value((d: any) => d.value).sort(null);
    return p(data);
  }, [data]);

  const arcGen = useMemo(
    () =>
      d3arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius),
    [outerRadius, innerRadius]
  );

  return (
    <View style={styles.categoryChartContainer}>
      <View pointerEvents="none" style={styles.bgDecoration}>
        <Background width="100%" height="100%" preserveAspectRatio="xMaxYMax meet" />
      </View>

      <View style={styles.categoryChartContent}>
        <Text style={styles.title}>Gastos por Categoria</Text>

        {data.length === 0 ? (
          <View style={[styles.chartContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.noData}>Nenhum dado disponível</Text>
          </View>
        ) : (
          <View style={styles.chartContainer}>
            {isMobile ? (
              <View style={styles.mobileChartAndLegend}>
                <Animated.View style={{ transform: [{ scale }], opacity: fade }}>
                  <Svg width={chartWidth} height={chartHeight}>
                    <G x={chartWidth / 2} y={chartHeight / 2}>
                      {arcs.map((a: any, i: number) => (
                        <Path key={`slice-${i}`} d={arcGen(a) || ''} fill={data[i].color} />
                      ))}
                    </G>
                  </Svg>
                </Animated.View>

                <View style={styles.mobileLegendWrapper}>
                  {data.map((item: any) => (
                    <View key={item.name} style={styles.mobileLegendItem}>
                      <View style={[styles.mobileLegendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.mobileLegendText}>{item.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.desktopChartWrapper}>
                <Animated.View style={{ transform: [{ scale }], opacity: fade }}>
                  <Svg width={chartWidth} height={chartHeight}>
                    <G x={chartWidth / 2} y={chartHeight / 2}>
                      {arcs.map((a: any, i: number) => (
                        <Path key={`slice-${i}`} d={arcGen(a) || ''} fill={data[i].color} />
                      ))}
                    </G>
                  </Svg>
                </Animated.View>

                <View style={styles.desktopLegend}>
                  {data.map((item: any) => (
                    <View key={item.name} style={styles.desktopLegendItem}>
                      <View style={[styles.desktopLegendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.desktopLegendText}>{item.name}</Text>
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

const styles = StyleSheet.create({
  categoryChartContainer: {
    backgroundColor: '#CBCBCB',
    borderRadius: 8,
    padding: 32,
    position: 'relative',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  bgDecoration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  categoryChartContent: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 24,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#000',
    lineHeight: 30,
    marginBottom: 8,
  },
  chartContainer: {
    backgroundColor: '#004D61',
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 600,
    marginBottom: 16,
    alignSelf: 'center',
  },
  desktopChartWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  desktopLegend: {
    marginLeft: 16,
    gap: 8,
  },
  desktopLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  desktopLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  desktopLegendText: {
    color: '#fff',
    fontSize: 16,
  },
  mobileChartAndLegend: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  mobileLegendWrapper: {
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
    gap: 8,
  },
  mobileLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mobileLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mobileLegendText: {
    color: '#fff',
    fontSize: 16,
  },
  noData: {
    color: '#fff',
    fontSize: 16,
  },
});
