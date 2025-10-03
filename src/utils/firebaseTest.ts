import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testando conexão com Firebase...');
    
    // Teste simples: tentar adicionar um documento de teste
    const testData = {
      test: true,
      timestamp: new Date(),
      message: 'Teste de conexão Firebase'
    };
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('Documento de teste criado com ID:', docRef.id);
    
    // Tentar ler os documentos de teste
    const querySnapshot = await getDocs(collection(db, 'test'));
    console.log('Documentos encontrados:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      console.log('Documento:', doc.id, '=>', doc.data());
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao testar Firebase:', error);
    return false;
  }
};
