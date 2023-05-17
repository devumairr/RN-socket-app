export const socketConnection = (connectionURL: string): WebSocket => {
  return new WebSocket(connectionURL);
};
