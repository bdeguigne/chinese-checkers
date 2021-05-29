export abstract class Board {
  abstract coords: number[][][];
  abstract emptyIndex: number;
  abstract colors: string[];
}
