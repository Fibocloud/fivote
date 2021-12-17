import { useSockets } from "context/socket";
import { NextPage } from "next";
import React from "react";
import { Button, TextField } from "@mui/material";
import { IMessage } from "interface";
import EVENTS from "config/events";

interface Props {}

const Index: NextPage<Props> = ({}): React.ReactElement => {
  const { socket, messages } = useSockets();
  const [message, setMessage] = React.useState<IMessage>({
    message: "",
    username: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit(EVENTS.CLIENT.SEND_MESSAGE, message);
  };

  return (
    <div className="p-20 grid grid-cols-2 gap-10">
      <div className="col-span-1">
        <form onSubmit={onSubmit} className="flex gap-2 w-full">
          <TextField
            placeholder="Username"
            label="Username"
            size="small"
            className="w-full"
            value={message.message}
            onChange={(e) =>
              setMessage({ ...message, message: e.target.value })
            }
          />
          <TextField
            size="small"
            placeholder="Message"
            label="Message"
            className="w-full"
            value={message.username}
            onChange={(e) =>
              setMessage({ ...message, username: e.target.value })
            }
          />
          <Button size="small" variant="contained" type="submit">
            Submit
          </Button>
        </form>
      </div>
      <div className="col-span-1 flex gap-2">
        <div className="flex flex-col gap-4 w-full">
          {messages.map((msg: IMessage, ind: number) => (
            <div key={ind} className="p-2 rounded-md bg-blue-200">
              <div className="font-bold">{msg.username}</div>
              <div>{msg.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
