import { useSockets } from "context/socket";
import { NextPage } from "next";
import React from "react";
import { IUser } from "interface";
import { TextField, Button } from "@mui/material";
import EVENTS from "config/events";

interface Props {}

const Index: NextPage<Props> = ({}): React.ReactElement => {
  const { socket, currentVotes } = useSockets();
  const [name, setName] = React.useState<string>("");
  const [user, setUser] = React.useState<IUser>({
    name: "",
    image: "",
    password: "",
    whichTeam: "",
    votedTeam: "",
  });

  const onSubmit = (val: string) => {
    socket.emit(EVENTS.CLIENT.VOTE_TEAM, {
      user: {
        name,
      },
      team: val,
    });
  };

  const handleLogin = () => {
    socket.emit(EVENTS.CLIENT.CHECK_AUTH, {
      user: {
        name: user.name,
        password: user.password,
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-12 justify-between py-12 px-96">
        {/* <div
          className="flex p-6 bg-cover rounded-lg hover:cursor-pointer shadow-sm hover:shadow-md h-64 w-64"
          style={{
            backgroundImage: 'url("/radiant.png")',
          }}
        >
        </div> */}

        {currentVotes.map((vote) => (
          <div
            key={vote.team.name}
            className="flex p-6 bg-cover h-64 w-64 rounded-lg hover:cursor-pointer shadow-sm hover:shadow-md"
            onClick={() => onSubmit(vote.team.name)}
            style={{
              backgroundImage: `url("/${vote.team.image}")`,
            }}
          >
            <div className="flex gap-4">
              {vote.users.map((user) => (
                <div key={user.name} className="text-red-600 text-lg font-bold">
                  {user.name}
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* <div
          className="flex p-6 bg-blue-200 rounded-lg hover:cursor-pointer shadow-sm hover:shadow-md"
          onClick={() => onSubmit("radiant")}
        >
          Radiant
        </div>
        <div
          className="flex p-6 bg-red-200 rounded-lg hover:cursor-pointer shadow-sm hover:shadow-md"
          onClick={() => onSubmit("dire")}
        >
          Dire
        </div>
        <div
          className="flex p-6 bg-green-200 rounded-lg hover:cursor-pointer shadow-sm hover:shadow-md"
          onClick={() => onSubmit("got")}
        >
          GOT
        </div> */}
      </div>
      <div className="flex gap-4 p-20">
        <TextField
          placeholder="Username"
          label="Username"
          size="small"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <TextField
          placeholder="Password"
          label="Password"
          size="small"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <Button variant="contained" onClick={() => handleLogin()}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Index;
