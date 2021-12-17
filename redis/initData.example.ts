// Example file of initialization data for Redis
import { createClient } from "redis";

const userList: {
  name: string;
  image: string;
  password: string;
  whichTeam: string;
  votedTeam: string;
}[] = [
  {
    name: "",
    image: "",
    password: "",
    whichTeam: "",
    votedTeam: "",
  },
];

const client = createClient();

(async () => {
  await client.connect();

  for (const user of userList) {
    await client.set(`user_${user.name}`, JSON.stringify(user));
  }
  console.log("[+] Done users");
})();
