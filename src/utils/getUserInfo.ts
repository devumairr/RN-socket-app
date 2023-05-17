import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentUserId = async (): Promise<string> => {
  const userId = (await AsyncStorage.getItem('user_cognito_id')) || '';
  return userId;
};
