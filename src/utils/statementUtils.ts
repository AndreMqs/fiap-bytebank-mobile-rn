import { TransactionData } from "../types/transaction";

export function getStatementByMonth(transactions: TransactionData[]) {
  const monthMap = new Map<string, TransactionData[]>();
  transactions.forEach((transaction) => {
    const month = new Date(transaction.date).toLocaleString('default', { month: 'long' });
    const prevItem = monthMap.get(month);
    monthMap.set(month, [...(prevItem ?? []), transaction]);
  });
  return monthMap;
}