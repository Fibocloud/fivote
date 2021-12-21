import { createContext, useState, useEffect, useContext } from "react";
import { SOCKET_URL } from "config/default";
import EVENTS from "config/events";
import { Socket, io } from "socket.io-client";
import { ITeam, IUser } from "interface";
import Cookies from "universal-cookie";

const socket = io(SOCKET_URL);
const cookie = new Cookies();

interface ICurrentVote {
  team: ITeam;
  users: IUser[];
}
interface Context {
  socket: Socket;
  currentVotes: ICurrentVote[];
  currentUser: IUser;
}

const SocketContext = createContext<Context>({
  socket,
  currentVotes: [],
  currentUser: {} as IUser,
});

const SocketProvider = (props: any) => {
  const [currentVotes, setCurrentVotes] = useState<ICurrentVote[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);

  useEffect(() => {
    socket.emit(EVENTS.CLIENT.CURRENT_VOTES);
    const token = cookie.get("token");
    const name = cookie.get("name");
    if (token && name) {
      socket.emit(EVENTS.CLIENT.WHOAMI, {
        user: {
          name,
          session: token,
        },
      });
    }
  }, []);

  useEffect(() => {
    socket.on(EVENTS.SERVER.CURRENT_VOTES, (resp: ICurrentVote[]) =>
      setCurrentVotes(resp)
    );
    socket.on(EVENTS.SERVER.WHOAMI_RESP, (resp) => {
      if (resp.status) {
        setCurrentUser(resp.data);
      }
    });
    socket.on(EVENTS.SERVER.AUTH_RESPONSE, (resp) => {
      if (resp.status) {
        cookie.set("token", resp.token, {
          path: "/",
        });
        cookie.set("name", resp.name, {
          path: "/",
        });
      }
    });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        currentVotes,
        currentUser,
      }}
      {...props}
    />
  );
};

export const useSockets = () => useContext(SocketContext);

export default SocketProvider;
