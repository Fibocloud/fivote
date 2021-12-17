export interface IUser {
  username: string;
  image: string;
  password: string;
  whichTeam: string;
  votedTeam: string;
}

export interface ITeam {
  name: string;
  image: string;
}
