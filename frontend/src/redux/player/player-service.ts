export const create = async (player: string, avatar: Avatar): Promise<Player> => {
  const response = await fetch("http://localhost:3000/players/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: player,
      avatar
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
    avatar: apiResponse.data.avatar
  };
};
