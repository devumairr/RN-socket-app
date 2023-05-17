import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';

const Stack = createStackNavigator();

function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

export default LoginStack;
