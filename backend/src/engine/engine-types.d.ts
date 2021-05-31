import { Hex } from "./hex.lib";

type Board = {
  pawns: Pawn[];
};

type Pawn = {
  hex: Hex;
  x: number;
  y: number;
  color: string;
};

type PownIndex = {
  boardIndex: number;
  coordIndex: number;
};

type Movements = {
  neighborCoords: Hex[];
  jumpCoords: Hex[];
};

type MoveInfo = {
  isNeighbor: boolean;
  board: Pawn[];
  winPlayerId: string | null;
};
