export function parseMoneyValue(money: number) {
  if (typeof money !== 'number' || isNaN(money)) {
    return 'R$ 0,00';
  }
  return money.toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
}