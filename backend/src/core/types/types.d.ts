type Avatar = {
  type: string;
  seed: string;
};

type JoinLobbyResponse = {
  playerName: string;
};

type StartGameReponse = {
  roomId: string;
  playerIndex?: number;
};

type PlayerSocket = {
  roomId: number;
  playerId: number;
  socketId: string;
};
