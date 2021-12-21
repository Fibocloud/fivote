import { Server, Socket } from 'socket.io';
import { IUser, ITeam } from 'interface';
import EVENTS from './config/events';

const socket = ({ io, client }: { io: Server; client: any }) => {
  io.on(EVENTS.connection, (socket: Socket) => {
    socket.on(EVENTS.CLIENT.VOTE_TEAM, ({ user, team }: { user: Partial<IUser>; team: string }) => {
      voteTeam(user, team, client);
      (async () => {
        const data = await currentVote(client);
        socket.emit(EVENTS.SERVER.CURRENT_VOTES, data);
      })();
    });

    socket.on(EVENTS.CLIENT.CURRENT_VOTES, () => {
      (async () => {
        const data = await currentVote(client);
        socket.emit(EVENTS.SERVER.CURRENT_VOTES, data);
      })();
    });

    socket.on(EVENTS.CLIENT.CHECK_AUTH, ({ user }: { user: Partial<IUser> }) => {
      (async () => {
        const data = await checkLogin(user, client);
        socket.emit(EVENTS.SERVER.AUTH_RESPONSE, data);
      })();
    });
    socket.on(EVENTS.CLIENT.WHOAMI, ({ user }: { user: Partial<IUser> }) => {
      (async () => {
        const data = await checkToken(user, client);
        socket.emit(EVENTS.SERVER.WHOAMI_RESP, data);
      })();
    });
  });
};

const checkToken = async (user: Partial<IUser>, client: any): Promise<{ status: boolean; data?: any }> => {
  const record = await client.get(`user_${user.name}`);
  if (record) {
    const userData = JSON.parse(record);
    if (userData.session === user.session) {
      return {
        status: true,
        data: userData,
      };
    }
  }
  return {
    status: false,
  };
};

const checkLogin = async (
  user: Partial<IUser>,
  client: any,
): Promise<{ status: boolean; token: string; name: string }> => {
  const record = await client.get(`user_${user.name}`);
  if (record) {
    const userData = JSON.parse(record);
    if (userData.password === user.password) {
      const session = '_' + Math.random().toString(36).substr(2, 9);
      userData.session = session;
      await client.set(`user_${user.name}`, JSON.stringify(userData));
      return {
        status: true,
        token: session,
        name: userData.name,
      };
    }
  }
  return {
    status: false,
    token: '',
    name: '',
  };
};

const voteTeam = async (user: Partial<IUser>, team: string, client: any) => {
  const record = await client.get(`user_${user.name}`);
  if (record) {
    const userData = JSON.parse(record);
    userData.votedTeam = team;
    await client.set(`user_${user.name}`, JSON.stringify(userData));
  }
};

const currentVote = async (client: any) => {
  const userKeys = await client.keys('user_*');
  const teamKeys = await client.keys('team_*');

  const users = await Promise.all(
    userKeys.map(async (key: string) => {
      const record = await client.get(key);
      const userData = JSON.parse(record);
      return userData;
    }),
  );

  const resp: { team: ITeam; users: IUser }[] = await Promise.all(
    teamKeys.map(async (key: string) => {
      const team = await client.get(key);
      const teamData = JSON.parse(team);
      const votedUsers: IUser[] = [];

      users.forEach((user: IUser) => {
        if (user.votedTeam.toLowerCase() === teamData.name.toLowerCase()) {
          votedUsers.push(user);
        }
      });
      return {
        team: teamData,
        users: votedUsers,
      };
    }),
  );
  return resp;
};

// const saveMessage = async (message: IMessage, client: any) => {
//   await client.set(
//     `user_${message.username}`,
//     JSON.stringify({
//       votedTeam: 'votedTeam',
//       whichTeam: 'teamID',
//       password: 'password',
//       image: 'default_image',
//       bio: message.message,
//     }),
//   );
// };

// const getMessages = async (client: any) => {
//   const resp: IMessage[] = [];
//   const users = await client.keys('user_*');
//   for (let i = 0; i < users.length; i++) {
//     const user = users[i];
//     const message = await client.get(user);
//     resp.push({
//       username: user.replace('user_', ''),
//       message,
//     });
//   }
//   return resp;
// };

export default socket;
