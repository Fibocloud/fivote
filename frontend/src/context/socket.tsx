import { createContext, useState, useEffect, useContext } from "react";
import { SOCKET_URL } from "config/default";
import EVENTS from "config/events";
import { Socket, io } from "socket.io-client";
import { IMessage } from "interface";

const socket = io(SOCKET_URL);

interface Context {
  socket: Socket;
  messages: IMessage[];
}

const SocketContext = createContext<Context>({
  socket,
  messages: [],
});

const SocketProvider = (props: any) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    socket.on(EVENTS.SERVER.SEND_MESSAGES, (msgs: IMessage[]) =>
      setMessages(msgs)
    );
  }, []);

  useEffect(() => {
    socket.on(EVENTS.SERVER.SEND_MESSAGES, (msgs: IMessage[]) =>
      setMessages(msgs)
    );
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        messages,
      }}
      {...props}
    />
  );
};

export const useSockets = () => useContext(SocketContext);

export default SocketProvider;
