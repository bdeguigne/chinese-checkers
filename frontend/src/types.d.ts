type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type Room = {
  _id: string;
  playersCount: number;
  players: RoomPlayerInfo[];
  creatorName: string;
};

type RoomPlayerInfo = {
  info: Player;
  playerIndex: number;
};

type Player = {
  _id: string;
  name: string;
  avatar: Avatar;
  gameId: string;
};

type Avatar = {
  type: string;
  seed: string;
};

type SocketResponse<T = any> = {
  event: string;
  data: T;
};

type SocketError = {
  message: string;
  status: string;
};

type GameResponse = {
  roomId: string;
  playerIndex?: number;
  board?: number[][][];
};

type HexType = {
  q: number;
  r: number;
  s: number;
};

type PawnAction = {
  hex: HexType;
  x: number;
  y: number;
  color: string;
};
