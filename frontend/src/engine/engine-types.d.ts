import { Hex } from "./engine";

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
  coordIndex: number
}