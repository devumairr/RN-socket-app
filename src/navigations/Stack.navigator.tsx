import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import LoginStack from './Login.stack';
import ChatStack from './Chat.stack';

import authContext from '../contexts/auth.context';

function MainStack() {
  const { isAuthenticated, loading } = useContext(authContext);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return isAuthenticated ? <ChatStack /> : <LoginStack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainStack;
