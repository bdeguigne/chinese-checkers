type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type Room = {
  _id: string;
  playersCount: number;
  players: Player[];
  creatorName: string;
};

type Player = {
  _id: string;
  name: string;
  avatar: Avatar;
};

type Avatar = {
  type: string;
  seed: string;
}

type LobbyResponse = {
  event: string,
}