import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Eye from '../../images/Eye.svg';
import SaldoBackground from '../../images/SaldoBackground.svg';
import { parseDateString } from '../../utils/dateUtils';
import { parseMoneyValue } from '../../utils/stringUtils';

interface SummaryProps {
  username: string;
  money: number;
}

export default function Summary({ username, money }: SummaryProps) {
  const { width } = useWindowDimensions();
  const isMobile = width <= 480;

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const dateText = useMemo(() => parseDateString(new Date()), []);

  const moneyText = isBalanceVisible ? parseMoneyValue(money) : '••••••';

  return (
    <View style={[styles.summaryContainer, isMobile && styles.summaryContainerMobile]}>
      <View pointerEvents="none" style={styles.bg}>
        <SaldoBackground width="100%" height="100%" preserveAspectRatio="xMinYMax meet" />
      </View>

      <View style={[styles.left, isMobile && styles.leftMobile]}>
        <Text style={styles.userName}>{`Olá, ${username}! 👋`}</Text>
        <Text style={styles.date}>{dateText}</Text>
      </View>

      <View style={[styles.moneyContainer, isMobile && styles.moneyContainerMobile]}>
        <View style={styles.moneyHeader}>
          <Text style={styles.balance}>Saldo</Text>
          <TouchableOpacity onPress={() => setIsBalanceVisible((v) => !v)}>
            <Eye width={22} height={22} />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.accountType}>Conta Corrente</Text>
          <Text style={[styles.moneyText, !isBalanceVisible && styles.hideMoney]}>{moneyText}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    position: 'relative',
    backgroundColor: '#004D61',
    borderRadius: 12,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    overflow: 'hidden',
    minHeight: 220,
  },
  summaryContainerMobile: {
    flexDirection: 'column',
    gap: 16,
    minHeight: 180,
  },
  bg: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0, top: 0,
    zIndex: -1,
  },
  left: { zIndex: 1 },
  leftMobile: { width: '100%' },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  date: { fontSize: 13, color: '#fff' },

  moneyContainer: {
    zIndex: 1,
    marginTop: 24,
    maxWidth: '50%',
    alignSelf: 'flex-end',
  },
  moneyContainerMobile: {
    maxWidth: '100%',
    alignSelf: 'stretch',
    marginTop: 8,
  },
  moneyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FF5031',
    paddingBottom: 12,
    minWidth: 180,
    gap: 12,
  },
  balance: { fontSize: 18, fontWeight: '700', color: '#fff' },

  balanceContainer: { marginTop: 12 },
  accountType: { fontSize: 14, color: '#fff', marginBottom: 6 },
  moneyText: { fontSize: 30, color: '#fff', fontWeight: '700' },
  hideMoney: {
    backgroundColor: '#CBCBCB',
    color: '#CBCBCB',
    borderRadius: 8,
  },
});
