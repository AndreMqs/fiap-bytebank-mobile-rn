import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, RefreshControl, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useStore } from '../../store/useStore';
import CategoryChart from '../CategoryChart/CategoryChart';
import Header from '../Header/Header';
import Investments from '../Investments/Investments';
import Menu from '../Menu/Menu';
import NewTransaction from '../NewTransaction/NewTransaction';
import OtherServices from '../OtherServices/OtherServices';
import Statement from '../Statement/Statement';
import Summary from '../Summary/Summary';

export default function MainPage() {
  const { user, transactions, fetchUser, fetchTransactions, deleteTransaction } = useStore();
  const [selectedMenu, setSelectedMenu] = useState('Início');
  const [refreshing, setRefreshing] = useState(false);

  const { width } = useWindowDimensions();
  const isTablet = width <= 768;
  const isMobile = width <= 425;

  const fadeMain = useRef(new Animated.Value(0)).current;
  const fadeMiddle = useRef(new Animated.Value(0)).current;
  const fadeStatement = useRef(new Animated.Value(0)).current;
  const translateMiddle = useRef(new Animated.Value(10)).current;
  const translateStatement = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    fetchUser();
    fetchTransactions();
  }, [fetchUser, fetchTransactions]);

  useEffect(() => {
    Animated.timing(fadeMain, { toValue: 1, duration: 220, useNativeDriver: true }).start(() => {
      Animated.parallel([
        Animated.timing(fadeMiddle, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeStatement, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(translateMiddle, { toValue: 0, useNativeDriver: true }),
        Animated.spring(translateStatement, { toValue: 0, useNativeDriver: true }),
      ]).start();
    });
  }, [fadeMain, fadeMiddle, fadeStatement, translateMiddle, translateStatement]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchUser(), fetchTransactions()]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUser, fetchTransactions]);

  const handleMenuClick = useCallback((title: string) => {
    setSelectedMenu(title);
  }, []);

  const menuItems = useMemo(
    () => [
      { title: 'Início', route: '/inicio', selected: selectedMenu === 'Início' },
      { title: 'Transferências', route: '/inicio', selected: selectedMenu === 'Transferências' },
      { title: 'Investimentos', route: '/inicio', selected: selectedMenu === 'Investimentos' },
      { title: 'Outros serviços', route: '/home', selected: selectedMenu === 'Outros serviços' },
    ],
    [selectedMenu]
  );

  const mainContent = useMemo(() => {
    switch (selectedMenu) {
      case 'Transferências':
        return <NewTransaction />;
      case 'Investimentos':
        return <Investments />;
      case 'Outros serviços':
        return <OtherServices />;
      default:
        return <CategoryChart />;
    }
  }, [selectedMenu]);

  const renderMiddleContent = useCallback(() => {
    if (!user) return <Text>Carregando usuário...</Text>;
    return (
      <Animated.View
        style={[
          styles.middleContentContainer,
          isTablet || isMobile ? styles.middleContentContainerTablet : null,
          { opacity: fadeMiddle, transform: [{ translateY: translateMiddle }] },
        ]}
      >
        <Summary username={user.name} money={user.balance} />
        {mainContent}
      </Animated.View>
    );
  }, [mainContent, user, fadeMiddle, translateMiddle, isTablet, isMobile]);

  return (
    <Animated.View style={[styles.page, { opacity: fadeMain }]}>
      <Header items={menuItems} onMenuClick={handleMenuClick} />

      <View
        style={[
          styles.body,
          isTablet || isMobile ? styles.bodyTablet : null,
        ]}
      >
        <View style={styles.menuContainer}>
          <Menu items={menuItems} onMenuClick={handleMenuClick} />
        </View>

        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            isTablet || isMobile ? styles.scrollContentTablet : null,
          ]}
          nestedScrollEnabled
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {renderMiddleContent()}

          <Animated.View
            style={[
              styles.statementContainer,
              { opacity: fadeStatement, transform: [{ translateY: translateStatement }] },
              isTablet || isMobile ? styles.statementContainerTablet : null,
            ]}
          >
            <Statement transactions={transactions} deleteTransaction={deleteTransaction} />
          </Animated.View>
        </Animated.ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  bodyTablet: {
    flexDirection: 'column',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 36,
    paddingHorizontal: 24,
    gap: 16,
  },
  scrollContentTablet: {
    paddingHorizontal: 60,
    paddingBottom: 70,
  },
  menuContainer: {
    width: 180,
  },
  middleContentContainer: {
    width: '100%',
    marginHorizontal: 24,
    flexDirection: 'column',
    gap: 16,
  },
  middleContentContainerTablet: {
    width: '100%',
    marginHorizontal: 0,
    gap: 16,
  },
  statementContainer: {
    alignSelf: 'flex-start',
    width: 282,
  },
  statementContainerTablet: {
    width: '100%',
  },
});
