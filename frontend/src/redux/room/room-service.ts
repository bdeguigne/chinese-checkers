export const getAllRooms = async (): Promise<Room[]> => {
  const response = await fetch("http://localhost:3000/rooms/", {
    method: "GET",
  });
  const apiResponse: ApiResponse<Room[]> = await response.json();

  console.log(apiResponse);

  if (!response.ok) {
    const error = new Error("something went wrong");
    return Promise.reject(error);
  }

  if (apiResponse.success) {
    return apiResponse.data;
  } else {
    const error = new Error(apiResponse.message);
    return Promise.reject(error);
  }
};

export const create = async (playerId: string): Promise<Room> => {
  const response = await fetch("http://localhost:3000/rooms/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId,
    }),
  });
  const apiResponse: ApiResponse<Room> = await response.json();

  if (!apiResponse?.success) {
    const error = new Error(apiResponse.message);
    return Promise.reject(error);
  }
  if (!response.ok) {
    const error = new Error("something went wrong");
    return Promise.reject(error);
  }

  return apiResponse.data;
};

export const getRoom = async (roomId: string): Promise<Room> => {
  const response = await fetch("http://localhost:3000/rooms/" + roomId, {
    method: "GET",
  });
  const apiResponse: ApiResponse<Room> = await response.json();

  if (!apiResponse?.success) {
    const error = new Error(apiResponse.message);
    return Promise.reject(error);
  }
  if (!response.ok) {
    const error = new Error("something went wrong");
    return Promise.reject(error);
  }

  return apiResponse.data;
};

export const addPlayer = async (
  roomId: string,
  playerId: string
): Promise<Room> => {
  const response = await fetch(
    "http://localhost:3000/rooms/" + roomId + "/player/add/" + playerId,
    {
      method: "PATCH",
    }
  );
  const apiResponse: ApiResponse<Room> = await response.json();

  if (!apiResponse?.success) {
    const error = new Error(apiResponse.message);
    return Promise.reject(error);
  }
  if (!response.ok) {
    const error = new Error("something went wrong");
    return Promise.reject(error);
  }

  return apiResponse.data;
};

export const removePlayer = async (
  roomId: string,
  playerId: string
): Promise<Room> => {
  const response = await fetch(
    "http://localhost:3000/rooms/" + roomId + "/player/remove/" + playerId,
    {
      method: "PATCH",
    }
  );
  const apiResponse: ApiResponse<Room> = await response.json();

  if (!apiResponse?.success) {
    const error = new Error(apiResponse.message);
    return Promise.reject(error);
  }
  if (!response.ok) {
    const error = new Error("something went wrong");
    return Promise.reject(error);
  }

  return apiResponse.data;
};
