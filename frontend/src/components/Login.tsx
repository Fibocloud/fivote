import React from "react";
import { useSockets } from "context/socket";
import { IUser } from "interface";
import { TextField, Button } from "@mui/material";
import EVENTS from "config/events";

interface Props {
  className?: string;
}

const Login: React.FC<Props> = ({ className = "" }): React.ReactElement => {
  const { socket, currentVotes } = useSockets();
  const handleLogin = () => {
    socket.emit(EVENTS.CLIENT.CHECK_AUTH, {
      user: {
        name: user.name,
        password: user.password,
      },
    });
  };
  const [user, setUser] = React.useState<IUser>({
    name: "",
    image: "",
    password: "",
    whichTeam: "",
    votedTeam: "",
  });
  return (
    <div className={`${className}`}>
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

export default Login;
