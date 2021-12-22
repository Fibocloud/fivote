import { useSockets } from "context/socket";
import { NextPage } from "next";
import { IUser } from "interface";
import React from "react";
import { Button, Avatar } from "@mui/material";
import EVENTS from "config/events";
import Login from "components/Login";
import Cookies from "universal-cookie";
import { Navbar } from "components";

interface Props {}

const cookie = new Cookies();

const Index: NextPage<Props> = ({}): React.ReactElement => {
  const {
    socket,
    currentVotes,
    currentUser,
    setCurrentUser,
    updateUser,
    totalUsers,
  } = useSockets();
  const roadRef = React.useRef();
  const [rootElementWidth, setRootElementWidth] = React.useState<number>(0);

  const calcPadding = (val: number): number => {
    return (rootElementWidth / totalUsers) * val;
  };

  React.useEffect(() => {
    setRootElementWidth(roadRef.current.clientWidth!);
  }, []);

  const onSubmit = (val: string) => {
    socket.emit(EVENTS.CLIENT.VOTE_TEAM, {
      user: {
        name: currentUser.name,
      },
      team: val,
    });
    updateUser();
  };

  const handleLogout = () => {
    setCurrentUser({} as IUser);
    cookie.remove("token", { path: "/" });
    cookie.remove("name", { path: "/" });
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex flex-col gap-12 py-12 px-96 mx-auto h-full">
        <div className="flex flex-col justify-center gap-12" ref={roadRef}>
          {currentVotes.map((vote) => (
            <div key={vote.team.name} className="flex flex-col w-full">
              <div className="flex flex-col relative -space-y-4">
                <img
                  src={`${
                    vote.users.length === 0
                      ? "/img/utils/horse_stand.gif"
                      : "/img/utils/horse_move.gif"
                  } `}
                  className={`bg-cover ${
                    vote.users.length === 0 ? "h-32 w-48" : "w-32 h-32"
                  }`}
                  style={{
                    marginLeft: `${calcPadding(vote.users.length)}px`,
                  }}
                />
                <img src="/img/utils/grass.png" className="w-full" />
              </div>
              <div className="flex justify-between py-2">
                <div>
                  <span className="text-md font-semibold text-red-600">
                    {vote.team.name}
                  </span>
                </div>
                <div className="flex gap-4">
                  {vote.users.map((user) => (
                    // <Avatar
                    //   className="border-red-400 border-2"
                    //   sx={{ width: 32, height: 32 }}
                    //  key={user.name}
                    // >
                    //   {user.name}
                    // </Avatar>
                    <span
                      key={user.name}
                      className="text-red-600 text-md font-normal"
                    >
                      {user.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-12">
          {currentVotes.map((vote) => (
            <div
              key={vote.team.name}
              className={`flex rounded-lg hover:cursor-pointer ${
                currentUser.votedTeam === vote.team.name
                  ? "bg-red-50"
                  : "bg-white"
              }`}
              onClick={() => onSubmit(vote.team.name)}
            >
              <img
                src={`/img/teams/${vote.team.image}`}
                className={`h-16 w-h-16 rounded-lg bg-cover p-2 ${
                  currentUser.votedTeam === vote.team.name
                    ? "border-red-400 border-2"
                    : "border-transparent border-2 opacity-40"
                }`}
              />
            </div>
          ))}
        </div>
        <div>
          {currentUser.name ? (
            <div>
              {currentUser.name}{" "}
              <Button variant="contained" onClick={() => handleLogout()}>
                {" "}
                Logout
              </Button>
            </div>
          ) : (
            <Login />
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
