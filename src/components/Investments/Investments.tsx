import { arc as d3arc, pie as d3pie } from 'd3-shape';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import BackgroundDesktop from '../../images/BackgroundDesktop.svg';
import BackgroundMobile from '../../images/BackgroundMobile.svg';
import BackgroundTablet from '../../images/BackgroundTablet.svg';
import { INVESTMENTS_MOCK } from '../../utils/constants';

const Chart = ({ data, width, height, outerRadius, innerRadius }: any) => {
  const arcs = useMemo(() => d3pie<any>().value((d: any) => d.value).sort(null)(data), [data]);
  const arcGen = useMemo(() => d3arc().outerRadius(outerRadius).innerRadius(innerRadius), [outerRadius, innerRadius]);
  return (
    <Svg width={width} height={height}>
      <G x={width / 2} y={height / 2}>
        {arcs.map((a: any, i: number) => (
          <Path key={`slice-${i}`} d={arcGen(a) || ''} fill={data[i].color} />
        ))}
      </G>
    </Svg>
  );
};

export default function Investments() {
  const rendaFixa = INVESTMENTS_MOCK.rendaFixa;
  const rendaVariavel = INVESTMENTS_MOCK.rendaVariavel;
  const total = INVESTMENTS_MOCK.total;
  const data = INVESTMENTS_MOCK.chartData || [];

  const { width } = useWindowDimensions();
  const isMobile = width <= 425;
  const isTablet = width <= 768;
  const isNarrow = width <= 640;

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

  return (
    <View style={styles.investmentsContainer}>
      <View pointerEvents="none" style={styles.bgDecoration}>
        <Background width="100%" height="100%" preserveAspectRatio="xMaxYMax meet" />
      </View>

      <View style={styles.inner}>
        <Text style={styles.title}>Investimentos</Text>
        <Text style={styles.total}>Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>

        <View style={[styles.yields, isNarrow && styles.yieldsColumn]}>
          <View style={[styles.yieldBox, isNarrow && styles.yieldBoxFull]}>
            <Text style={styles.yieldTitle}>Renda Fixa</Text>
            <Text style={styles.yieldValue}>R$ {rendaFixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={[styles.yieldBox, isNarrow && styles.yieldBoxFull]}>
            <Text style={styles.yieldTitle}>Renda variável</Text>
            <Text style={styles.yieldValue}>R$ {rendaVariavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>

        <Text style={styles.statistics}>Estatísticas</Text>

        <View style={styles.chartContainer}>
          {data.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff' }}>Nenhum dado disponível</Text>
            </View>
          ) : isMobile ? (
            <View style={styles.mobileChartAndLegend}>
              <Animated.View style={{ transform: [{ scale }], opacity: fade }}>
                <Chart data={data} width={chartWidth} height={chartHeight} outerRadius={outerRadius} innerRadius={innerRadius} />
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
                <Chart data={data} width={chartWidth} height={chartHeight} outerRadius={outerRadius} innerRadius={innerRadius} />
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
      </View>
    </View>
  );
}

const CONTENT_MAX_WIDTH = 720;

const styles = StyleSheet.create({
  investmentsContainer: {
    backgroundColor: '#CBCBCB',
    borderRadius: 8,
    padding: 32,
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  inner: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    gap: 24,
  },
  bgDecoration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#000',
    lineHeight: 30,
    marginBottom: 8,
  },
  total: {
    fontSize: 25,
    fontWeight: '400',
    color: '#004D61',
    lineHeight: 30,
    marginBottom: 8,
  },
  yields: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 8,
  },
  yieldsColumn: {
    flexDirection: 'column',
  },
  yieldBox: {
    backgroundColor: '#004D61',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  yieldBoxFull: {
    width: '100%',
  },
  yieldTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#DADADA',
    marginBottom: 4,
    textAlign: 'center',
  },
  yieldValue: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
  },
  statistics: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
    marginTop: 8,
  },
  chartContainer: {
    backgroundColor: '#004D61',
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  desktopChartWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  desktopLegend: {
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
    marginTop: 8,
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
});
