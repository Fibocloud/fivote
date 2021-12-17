import { useSockets } from "context/socket";
import { NextPage } from "next";
import React from "react";
import { TextField } from "@mui/material";
import { IMessage } from "interface";
import EVENTS from "config/events";

interface Props {}

const Index: NextPage<Props> = ({}): React.ReactElement => {
  const { socket, messages } = useSockets();
  const [username, setUsername] = React.useState<string>("");

  const onSubmit = (val: string) => {
    socket.emit(EVENTS.CLIENT.VOTE_TEAM, {
      user: {
        username,
      },
      team: val,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-12 justify-between py-12 px-96">
        <div
          className="flex p-6 bg-blue-200 rounded-lg hover:cursor-pointer shadow-sm hover:shadow-md"
          onClick={() => onSubmit("team1")}
        >
          Team A
        </div>
        <div
          className="flex p-6 bg-red-200 rounded-lg hover:cursor-pointer shadow-sm hover:shadow-md"
          onClick={() => onSubmit("team2")}
        >
          Team B
        </div>
        <div
          className="flex p-6 bg-green-200 rounded-lg hover:cursor-pointer shadow-sm hover:shadow-md"
          onClick={() => onSubmit("team3")}
        >
          Team C
        </div>
      </div>
      <div className="p-20">
        <TextField
          placeholder="Username"
          label="Username"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Index;
