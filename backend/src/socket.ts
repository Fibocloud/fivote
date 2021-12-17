import { Server, Socket } from 'socket.io';
import { IUser } from 'interface';
import EVENTS from './config/events';

const socket = ({ io, client }: { io: Server; client: any }) => {
  io.on(EVENTS.connection, (socket: Socket) => {
    // socket.on(EVENTS.CLIENT.SEND_MESSAGE, (message: IMessage) => {
    //   saveMessage(message, client);
    //   (async () => {
    //     const data = await getMessages(client);
    //     socket.emit(EVENTS.SERVER.SEND_MESSAGES, data);
    //   })();
    // });
    socket.on(EVENTS.CLIENT.VOTE_TEAM, ({ user, team }: { user: Partial<IUser>; team: string }) => {
      console.log(user, team);
      voteTeam(user, team, client);
      console.log('done');
    });
  });
};

const voteTeam = async (user: Partial<IUser>, team: string, client: any) => {
  const record = await client.get(`user_${user.username}`);
  const userData = JSON.parse(record);
  userData.votedTeam = team;
  await client.set(`user_${user.username}`, JSON.stringify(userData));
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
