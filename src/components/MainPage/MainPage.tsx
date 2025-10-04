import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

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
    fetchTransactions(user.uid);
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
      await Promise.all([fetchUser(), fetchTransactions(user.uid)]);
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
          { opacity: fadeMiddle, transform: [{ translateY: translateMiddle }] },
        ]}
      >
        <View style={styles.middleMax}>
          <Summary />
          {mainContent}
        </View>
      </Animated.View>
    );
  }, [mainContent, user, fadeMiddle, translateMiddle]);

  return (
    <Animated.View style={[styles.page, { opacity: fadeMain }]}>
      <Header items={menuItems} onMenuClick={handleMenuClick} />

      <View style={[styles.body, (isTablet || isMobile) && styles.bodyTablet]}>
        <View style={styles.menuContainer}>
          <Menu items={menuItems} onMenuClick={handleMenuClick} />
        </View>

        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            (isTablet || isMobile) && styles.scrollContentTablet,
          ]}
          nestedScrollEnabled
          removeClippedSubviews={false}    // impede que o Summary seja “recortado” no Android
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {renderMiddleContent()}

          <Animated.View
            style={[
              styles.statementContainer,
              { opacity: fadeStatement, transform: [{ translateY: translateStatement }] },
              (isTablet || isMobile) && styles.statementContainerTablet,
            ]}
          >
            <View style={styles.middleMax}>
              <Statement transactions={transactions} deleteTransaction={deleteTransaction} />
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </View>
    </Animated.View>
  );
}

const CONTENT_MAX_WIDTH = 840;

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
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: 36,
    paddingHorizontal: 24,
    gap: 16,
  },
  scrollContentTablet: {
    paddingHorizontal: 16,
    paddingBottom: 70,
    gap: 16,
  },
  menuContainer: {
    width: 180,
  },
  middleContentContainer: {
    width: '100%',
    flexDirection: 'column',
  },
  middleMax: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    gap: 16,
  },
  statementContainer: {
    alignSelf: 'stretch',
    width: '100%',
  },
  statementContainerTablet: {
    width: '100%',
  },
});
