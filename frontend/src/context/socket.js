import { createContext } from "react";

import io from "socket.io-client";
const ENDPOINT = "https://chinese-checkers-api.herokuapp.com";

export const socket = io(ENDPOINT);
export const SocketContext = createContext(socket);
