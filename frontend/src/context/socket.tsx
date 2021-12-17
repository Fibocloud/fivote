import { createContext, useState, useEffect, useContext } from "react";
import { SOCKET_URL } from "config/default";
import EVENTS from "config/events";
import { Socket, io } from "socket.io-client";
import { ITeam, IUser } from "interface";

const socket = io(SOCKET_URL);

interface ICurrentVote {
  team: ITeam;
  users: IUser[];
}
interface Context {
  socket: Socket;
  currentVotes: ICurrentVote[];
}

const SocketContext = createContext<Context>({
  socket,
  currentVotes: [],
});

const SocketProvider = (props: any) => {
  const [currentVotes, setCurrentVotes] = useState<ICurrentVote[]>([]);

  useEffect(() => {
    socket.emit(EVENTS.CLIENT.CURRENT_VOTES);
  }, []);

  useEffect(() => {
    socket.on(EVENTS.SERVER.CURRENT_VOTES, (resp: ICurrentVote[]) =>
      setCurrentVotes(resp)
    );
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        currentVotes,
      }}
      {...props}
    />
  );
};

export const useSockets = () => useContext(SocketContext);

export default SocketProvider;
