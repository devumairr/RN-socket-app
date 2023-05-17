import AsyncStorage from '@react-native-async-storage/async-storage';

export const setSession = async (userId: string): Promise<void> => {
  await AsyncStorage.setItem('user_cognito_id', userId);
};

export const getSession = async (): Promise<string> => {
  return (await AsyncStorage.getItem('user_cognito_id')) || '';
};

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem('user_cognito_id');
};
