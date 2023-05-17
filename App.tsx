import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import MainStack from './src/navigations/Stack.navigator';

import Store from './src/store';

import 'react-native-gesture-handler';

const App = (): Element => {
  return (
    <Store>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </Store>
  );
};

export default App;
