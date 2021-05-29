export const create = async (
  player: string,
  avatar: Avatar
): Promise<Player> => {
  const response = await fetch("http://localhost:3000/players/", {
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
  // localhost:3000/players/60a324b5d7f59de0d51246c6
  const response = await fetch("http://localhost:3000/players/" + playerId, {
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
  const response = await fetch(
    "http://localhost:3000/players/" + playerId + "/" + state,
    {
      method: "PATCH",
    }
  );
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
