import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Eye from '../../images/Eye.svg';
import SaldoBackground from '../../images/SaldoBackground.svg';
import { parseDateString } from '../../utils/dateUtils';
import { parseMoneyValue } from '../../utils/stringUtils';

interface SummaryProps {
  username: string;
  money: number;
}

export default function Summary(props: SummaryProps) {
  const { username, money } = props;
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const dateText = useMemo(() => parseDateString(new Date()), []);

  const moneyText = isBalanceVisible ? parseMoneyValue(money) : '.';

  return (
    <View style={styles.summaryContainer}>
      <View pointerEvents="none" style={styles.bg}>
        <SaldoBackground width="100%" height="100%" preserveAspectRatio="xMinYMax meet" />
      </View>

      <View style={styles.summaryTitle}>
        <Text style={styles.userName}>{`Olá, ${username}! :)`}</Text>
        <Text style={styles.date}>{dateText}</Text>
      </View>

      <View style={styles.moneyContainer}>
        <View style={styles.moneyHeader}>
          <Text style={styles.balance}>Saldo</Text>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
            <Eye width={20} height={20} />
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
    minHeight: 402,
    backgroundColor: '#004D61',
    borderRadius: 8,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: -1,
  },
  summaryTitle: {
    zIndex: 1,
  },
  userName: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 24,
  },
  date: {
    fontSize: 13,
    color: '#fff',
  },
  moneyContainer: {
    zIndex: 1,
    marginTop: 72,
    maxWidth: '50%',
  },
  moneyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FF5031',
    paddingBottom: 16,
    minWidth: 180,
  },
  balance: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginRight: 24,
  },
  balanceContainer: {
    marginTop: 16,
  },
  accountType: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  moneyText: {
    fontSize: 31,
    color: '#fff',
  },
  hideMoney: {
    backgroundColor: '#CBCBCB',
    color: '#CBCBCB',
    borderRadius: 8,
  },
});
