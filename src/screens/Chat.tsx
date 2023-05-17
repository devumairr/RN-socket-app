import React, {
  useState,
  useEffect,
  ReactElement,
  FC,
  useCallback,
  useRef,
  useContext,
} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Button,
  // ActivityIndicator,
} from 'react-native';

import { IMessage } from '../interfaces/chat.interface';

import { formatTime } from '../utils/formatDate';
import { socketConnection } from '../utils/socket';
import { clearSession } from '../utils/userSession';

import { MOCK_ASSETS, ROOM_ID } from '../constants/chat.constant';

import authContext from '../contexts/auth.context';
import userContext from '../contexts/user.context';
import ImageCarousel from '../components/ImageCarousel';

const ws = socketConnection(
  'wss://eajw8idemd.execute-api.us-east-1.amazonaws.com/rootsDev',
);

const Chat: FC = ({ navigation }: any): ReactElement<SafeAreaView> => {
  const { setIsAuthenticated, setLoading: setAuthLoading } =
    useContext(authContext);
  const { user, setUser } = useContext(userContext);

  // const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [chat, setChat] = useState<{ messages: IMessage[] }>({
    messages: [],
  });

  const scrollViewRef = useRef<FlatList<IMessage> | null>(null);

  // WEBSOCKET EVENTS
  ws.onopen = () => {
    console.log('<<< SOCKET CONNECTED SUCCESSFULLY! >>>');

    getChatHistory();
  };

  ws.onmessage = (event: WebSocketMessageEvent) => {
    const dataObj = JSON.parse(event.data);

    console.log(
      `<<< SOCKET ${dataObj.action.toUpperCase()} EVENT CALLED! >>>`,
      dataObj,
    );

    const messages = dataObj.data.Items;

    handleReceive(messages);
    // handleReceive(messages, dataObj.action === 'newMessage');
  };

  ws.onerror = (event: WebSocketErrorEvent) => {
    console.log('<<< SOCKET ERROR >>>', event.message);
  };

  ws.onclose = (event: WebSocketCloseEvent) => {
    console.log('<<< SOCKET CLOSED! >>>', event.code, event.reason);
  };
  // WEBSOCKET EVENTS

  const getChatHistory = useCallback(() => {
    if (!user) {
      return;
    }

    // setLoading(true);

    console.log('<<< GETTING CHAT HISTORY >>>');

    const eventData: string = JSON.stringify({
      action: 'history',
      message: {
        room_participant_id: ROOM_ID,
        user_cognito_id: user,
        page: 1,
        message_id: '',
      },
    });

    ws.send(eventData);
  }, [user]);

  const handleReceive = useCallback(
    (messages: any) => {
      // (messages: any, isNewMessage: boolean) => {
      const newMessages = messages.map(
        ({
          created_at: date_time,
          message,
          room_participant_id,
          user_detail: user_cognito_id,
        }: any) => {
          return {
            room_participant_id,
            user_cognito_id,
            date_time,
            message,
            type: 'message',
          };
        },
      );

      // if (isNewMessage) {
      const oldChat = chat.messages;
      setChat({ messages: [...oldChat, ...newMessages] });
      // setLoading(false);
      // } else {
      //   setChat({ messages: newMessages });
      // }
    },
    [chat.messages],
  );

  const logout = useCallback(async () => {
    setAuthLoading(true);
    await clearSession();
    ws.close();
    setUser(null);
    setAuthLoading(false);
    setIsAuthenticated(false);
  }, [setIsAuthenticated, setUser, setAuthLoading]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props: any) => (
        <Button {...props} title="Logout" onPress={logout} />
      ),
    });

    if (user) {
      const messageData = {
        message: MOCK_ASSETS,
        type: 'image',
        room_participant_id: ROOM_ID,
        user_cognito_id: user,
        date_time: Date.now(),
      };

      setChat({ messages: [messageData] });
    }

    return () => ws.close();
  }, [navigation, logout, user]);

  const sendMessage = () => {
    if (text === '' || user === null) {
      return;
    }

    const messageData = {
      room_participant_id: ROOM_ID,
      user_cognito_id: user,
      date_time: Date.now(),
      message: text,
    };

    const data = JSON.stringify({
      action: 'newMessage',
      message: messageData,
    });

    console.log('Sent:' + text);
    ws.send(data);

    if (!user) {
      return;
    }
    const newChat = { ...chat };
    newChat.messages.push({ ...messageData, type: 'message' });
    setChat(newChat);
    setText('');
  };

  // if (loading) {
  // return (
  //   <SafeAreaView style={styles.loaderContainer}>
  //     <ActivityIndicator size="large" color="#1976d2" />;
  //   </SafeAreaView>
  // );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={ref => (scrollViewRef.current = ref)}
        onContentSizeChange={() => {
          if (scrollViewRef.current === null) {
            return;
          }
          scrollViewRef.current.scrollToEnd({ animated: true });
        }}
        data={chat.messages}
        keyExtractor={item => item.date_time.toString()}
        renderItem={({ item }) => {
          return item.type === 'image' && Array.isArray(item.message) ? (
            <View
              style={{
                ...styles.imageContainer,
                ...(item.user_cognito_id !== user
                  ? styles.imageContainerReceived
                  : {}),
              }}>
              <ImageCarousel assets={item.message} />
            </View>
          ) : (
            <View
              style={{
                ...styles.messageContainer,
                ...(item.user_cognito_id !== user
                  ? styles.messageContainerReceived
                  : {}),
              }}>
              <Text style={styles.messageText}>{item.message}</Text>
              <Text style={styles.messageTime}>
                {formatTime(item.date_time)}
              </Text>
            </View>
          );
        }}
      />
      <KeyboardAvoidingView
        enabled={true}
        behavior="padding"
        style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          returnKeyType="send"
          onChangeText={setText}
          onSubmitEditing={sendMessage}
          value={text}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  imageContainer: {
    backgroundColor: '#1976d2',
    paddingBottom: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    maxWidth: 260,
  },
  imageContainerReceived: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#00796b',
  },
  messageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#1976d2',
    borderRadius: 3,
    marginBottom: 8,
    flexDirection: 'row',
    maxWidth: 300,
  },
  messageContainerReceived: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#00796b',
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    marginEnd: 40,
  },
  messageTime: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginStart: 10,
    position: 'absolute',
    end: 10,
    bottom: 10,
  },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  textInput: {
    flex: 1,
    borderColor: '#448aff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
    marginBottom: 20,
  },
  sendButton: { paddingHorizontal: 10, marginBottom: 20 },
  sendButtonText: { color: '#448aff' },
});

export default Chat;
