import { MoveInfo, Movements, Pawn, PownIndex } from './engine-types';
import { Hex, Layout, OffsetCoord, Point } from './hex.lib';
import { SixPlayersBoard } from './boards/six-players-board-coords';
import { TwoPlayersBoard } from './boards/two-players-board-coords';
import { Board } from './boards/board';
import { FourPlayersBoard } from './boards/four-players-board-coords';

export class ChineseCheckersEngine {
  r = 22;
  layout: Layout;
  board: Board;
  // boardCoordinates: number[][][];

  constructor(numberOfPlayers: number) {
    if (numberOfPlayers === 2) {
      console.log('NB PLAYERS', 2);
      this.board = new TwoPlayersBoard();
    } else if (numberOfPlayers === 4) {
      console.log('NB PLAYERS', 4);
      this.board = new FourPlayersBoard();
    } else {
      console.log('NB PLAYERS', 6);
      this.board = new SixPlayersBoard();
    }
    this.layout = new Layout(
      Layout.pointy,
      new Point(this.r, this.r),
      new Point(400, 325),
    );
  }

  public setBoardType(numberOfPlayers: number) {
    if (numberOfPlayers === 2) {
      this.board = new TwoPlayersBoard();
    }
    if (numberOfPlayers === 4) {
      this.board = new FourPlayersBoard();
    } else {
      this.board = new SixPlayersBoard();
    }
  }

  public setBoardCoordinates(newBoard: number[][][]) {
    this.board.coords = newBoard;
  }

  public boardToPawns(board: number[][][]): Pawn[] {
    const pawns: Pawn[] = [];
    // const colors: string[] = [
    //   "green",
    //   "white",
    //   "yellow",
    //   "red",
    //   "black",
    //   "blue",
    //   "lightgrey",
    // ];

    // const colors: string[] = ["green", "red", "lightgrey"];

    board.forEach((playerCoords, index) => {
      playerCoords.forEach((coords) => {
        const hex = OffsetCoord.roffsetToCube(
          -1,
          new OffsetCoord(coords[0], coords[1]),
        );
        const coord = this.layout.hexToPixel(hex);
        pawns.push({
          hex,
          x: coord.x,
          y: coord.y,
          color: this.board.colors[index],
        });
      });
    });

    return pawns;
  }

  public getBoard(): number[][][] {
    return this.board.coords;
  }

  public defaultBoard(): Pawn[] {
    return this.boardToPawns(this.board.coords);
  }

  public isCoordsEqualOffset = (coords: number[], offset: OffsetCoord) => {
    if (coords[0] === offset.col && coords[1] === offset.row) {
      return true;
    }
    return false;
  };

  public isHexInsidePawns = (
    hex: Hex,
    pawnsInfoCoords: number[][],
  ): boolean => {
    const hexOffset = OffsetCoord.roffsetFromCube(OffsetCoord.ODD, hex);

    for (let i = 0; i < pawnsInfoCoords.length; i++) {
      const coords = pawnsInfoCoords[i];
      if (this.isCoordsEqualOffset(coords, hexOffset)) {
        return true;
      }
    }
    return false;
  };

  public isHexEqual = (destHex: Hex, checkHex: Hex): boolean => {
    if (
      destHex.q === checkHex.q &&
      destHex.r === checkHex.r &&
      destHex.s === checkHex.s
    ) {
      return true;
    }
    return false;
  };

  public availableMovements(hex: Hex): Movements {
    const movements: Movements = {
      neighborCoords: [],
      jumpCoords: [],
    };

    for (let direction = 0; direction < 6; direction++) {
      const hexNeighbor = hex.neighbor(direction);
      if (
        this.isHexInsidePawns(
          hexNeighbor,
          this.board.coords[this.board.emptyIndex],
        )
      ) {
        movements.neighborCoords.push(hexNeighbor);
      }
      let movementCount = 1;
      let checkHex: Hex = hexNeighbor;

      while (true) {
        if (
          this.isHexInsidePawns(
            checkHex,
            this.board.coords[this.board.emptyIndex],
          )
        ) {
          movementCount += 1;
        } else {
          break;
        }
        checkHex = checkHex.add(Hex.directions[direction]);
      }

      for (let i = 0; i < movementCount; i++) {
        checkHex = checkHex.add(Hex.directions[direction]);
        if (
          !this.isHexInsidePawns(
            checkHex,
            this.board.coords[this.board.emptyIndex],
          )
        ) {
          break;
        }
      }
      if (
        this.isHexInsidePawns(
          checkHex,
          this.board.coords[this.board.emptyIndex],
        )
      ) {
        movements.jumpCoords.push(checkHex);
      }
    }

    return movements;
  }

  public playerCanMoveThisPawn(playerIndex: number, hex: Hex): boolean {
    return this.isHexInsidePawns(hex, this.board.coords[playerIndex]);
  }

  public playerCanGoToThisHex(
    availableMovements: Hex[] | null,
    playerHex: Hex,
  ) {
    if (!availableMovements) {
      return false;
    }
    for (let i = 0; i < availableMovements.length; i++) {
      const availableMovement = availableMovements[i];
      if (this.isHexEqual(availableMovement, playerHex)) {
        return true;
      }
    }
    return false;
  }

  public getPawnIndexInBoard(hex: Hex): PownIndex | null {
    const hexOffset = OffsetCoord.roffsetFromCube(OffsetCoord.ODD, hex);
    for (
      let boardIndex = 0;
      boardIndex < this.board.coords.length;
      boardIndex++
    ) {
      const boardPlayer = this.board.coords[boardIndex];
      for (let coordIndex = 0; coordIndex < boardPlayer.length; coordIndex++) {
        const coords = boardPlayer[coordIndex];
        if (this.isCoordsEqualOffset(coords, hexOffset)) {
          return { boardIndex, coordIndex };
        }
      }
    }
    return null;
  }

  public swapPawn(first: PownIndex, second: PownIndex) {
    const posTmp = this.board.coords[first.boardIndex][first.coordIndex];

    this.board.coords[first.boardIndex][first.coordIndex] =
      this.board.coords[second.boardIndex][second.coordIndex];
    this.board.coords[second.boardIndex][second.coordIndex] = posTmp;
  }

  public move = (posHex: Hex, destHex: Hex): MoveInfo => {
    const posIndex = this.getPawnIndexInBoard(posHex);
    const destIndex = this.getPawnIndexInBoard(destHex);
    let isNeighbor = false;
    for (let direction = 0; direction < 6; direction++) {
      const hex = posHex.neighbor(direction);

      if (this.isHexEqual(hex, destHex)) {
        isNeighbor = true;
      }
    }

    if (posIndex && destIndex) {
      this.swapPawn(posIndex, destIndex);
    }

    return { board: this.boardToPawns(this.board.coords), isNeighbor };
  };
}
