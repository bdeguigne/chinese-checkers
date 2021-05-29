export const create = async (
  player: string,
  avatar: Avatar
): Promise<Player> => {
  let apiAddr = "";
  if (process.env.REACT_APP_API_ADDRESS) {
    apiAddr = process.env.REACT_APP_API_ADDRESS;
  }
  const response = await fetch(`${apiAddr}/players/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: player,
      avatar,
    }),
  });
  const apiResponse: ApiResponse<Player> = await response.json();

  console.log(apiResponse);

  if (!apiResponse?.success) {
    const error = new Error(apiResponse.message);
    return Promise.reject(error);
  }
  if (!response.ok) {
    return Promise.reject("something went wrong");
  }
  return {
    _id: apiResponse.data._id,
    name: apiResponse.data.name,
    gameId: "",
    avatar: apiResponse.data.avatar,
    win: 0,
    lose: 0,
  };
};

export const getPlayer = async (playerId: string): Promise<Player> => {
  let apiAddr = "";
  if (process.env.REACT_APP_API_ADDRESS) {
    apiAddr = process.env.REACT_APP_API_ADDRESS;
  }
  const response = await fetch(`${apiAddr}/players/` + playerId, {
    method: "GET",
  });
  const apiResponse: ApiResponse<Player> = await response.json();

  console.log(apiResponse);

  if (!apiResponse?.success) {
    const error = new Error(apiResponse.message);
    return Promise.reject(error);
  }
  if (!response.ok) {
    return Promise.reject("something went wrong");
  }
  return apiResponse.data;
};

export const playerWinOrLose = async (
  playerId: string,
  state: string
): Promise<Player> => {
  let apiAddr = "";
  if (process.env.REACT_APP_API_ADDRESS) {
    apiAddr = process.env.REACT_APP_API_ADDRESS;
  }
  const response = await fetch(`${apiAddr}/players/` + playerId + "/" + state, {
    method: "PATCH",
  });
  const apiResponse: ApiResponse<Player> = await response.json();

  if (!apiResponse?.success) {
    const error = new Error(apiResponse.message);
    return Promise.reject(error);
  }
  if (!response.ok) {
    return Promise.reject("something went wrong");
  }
  return apiResponse.data;
};
