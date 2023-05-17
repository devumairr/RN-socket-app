import React, { useState, ReactElement, FC, useContext } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';

import { setSession } from '../utils/userSession';

import authContext from '../contexts/auth.context';
import userContext from '../contexts/user.context';

const Login: FC = (): ReactElement<SafeAreaView> => {
  const { setIsAuthenticated } = useContext(authContext);
  const { setUser } = useContext(userContext);

  const [loading, setLoading] = useState<boolean>(false);

  const handleUser = async (userId: string): Promise<void> => {
    setLoading(true);

    setSession(userId);
    setIsAuthenticated(true);
    setUser(userId);

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#448aff" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleUser('GaUJs2H5ByYgxenjCbgo0A8YWJU2');
            }}>
            <Text style={styles.buttonText}>User 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleUser('Dy0SGrlZq7MbDyelU13MFYCsgy32');
            }}>
            <Text style={styles.buttonText}>User 2</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#448aff',
    marginHorizontal: 10,
    padding: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default Login;
