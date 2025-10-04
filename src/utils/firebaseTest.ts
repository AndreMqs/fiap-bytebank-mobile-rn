import { TransactionService } from '../services/transactionService';
import { UserDataService } from '../services/userDataService';

export const testFirebaseStructure = async (userId: string) => {
  try {
    console.log('🧪 Testando estrutura do Firebase...');
    
    console.log('1. Testando criação de usuário...');
    const userData = {
      uid: userId,
      name: 'Usuário Teste',
      email: 'teste@email.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await UserDataService.createUser(userId, userData);
    console.log('✅ Usuário criado com sucesso');
    
    console.log('2. Testando busca de usuário...');
    const retrievedUser = await UserDataService.getUserData(userId);
    console.log('✅ Usuário encontrado:', retrievedUser?.name);
    
    console.log('3. Testando criação de transação...');
    const transactionData = {
      type: 'income',
      category: 'Alimentação',
      value: '100.50',
      date: '2024-01-15'
    };
    
    const transaction = await TransactionService.addTransaction(transactionData, userId);
    console.log('✅ Transação criada com sucesso:', transaction.id);
    
    console.log('4. Testando busca de transações...');
    const transactions = await TransactionService.getTransactions(userId);
    console.log('✅ Transações encontradas:', transactions.length);
    
    console.log('🎉 Todos os testes passaram! Estrutura funcionando corretamente.');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    throw error;
  }
};