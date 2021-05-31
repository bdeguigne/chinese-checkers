import { MoveInfo, Movements, Pawn, PownIndex } from './engine-types';
import { Hex, Layout, OffsetCoord, Point } from './hex.lib';
import { SixPlayersBoard } from './boards/six-players-board-coords';
import { TwoPlayersBoard } from './boards/two-players-board-coords';
import { Board } from './boards/board';
import { FourPlayersBoard } from './boards/four-players-board-coords';

export class ChineseCheckersEngine {
  r = 22;
  public layout: Layout;
  public board: Board;
  // boardCoordinates: number[][][];

  constructor(numberOfPlayers: number) {
    if (numberOfPlayers === 2) {
      this.board = new TwoPlayersBoard();
    } else if (numberOfPlayers === 4) {
      this.board = new FourPlayersBoard();
    } else {
      this.board = new SixPlayersBoard();
    }
    this.layout = new Layout(
      Layout.pointy,
      new Point(this.r, this.r),
      new Point(400, 325),
    );
  }

  public setBoardType(numberOfPlayers: number, board?: number[][][]) {
    if (numberOfPlayers === 2) {
      this.board = new TwoPlayersBoard(board);
    } else if (numberOfPlayers === 4) {
      this.board = new FourPlayersBoard(board);
    } else {
      this.board = new SixPlayersBoard(board);
    }
  }

  public setBoardCoordinates(board: number[][][]) {
    this.board.coords = board;
  }

  public printHex(hex: Hex) {
    const hexOffset = OffsetCoord.roffsetFromCube(OffsetCoord.ODD, hex);
    console.log(hexOffset.col, hexOffset.row);
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
    let coordStore = -1;
    let boardStore = -1;
    let gobreak = false;

    for (
      let boardIndex = 0;
      boardIndex < this.board.coords.length;
      boardIndex++
    ) {
      const boardPlayer = this.board.coords[boardIndex];

      let coordIndex = 0;
      for (coordIndex = 0; coordIndex < boardPlayer.length; coordIndex++) {
        const coords = boardPlayer[coordIndex];
        if (this.isCoordsEqualOffset(coords, hexOffset)) {
          boardStore = boardIndex;
          coordStore = coordIndex;
          gobreak = true;
          break;
          // return { boardIndex: boardStore, coordIndex: coordStore };
        }
      }
      if (gobreak === true) {
        break;
      }
      // console.log("BOARD INDEX ", boardStore, "coordIndex", coordStore);

      // if (coordStore === -1 || boardStore === -1) {
      //   return null;
      // } else {
      //   return { boardIndex: boardStore, coordIndex: coordStore };
      // }
    }
    if (coordStore !== -1 || boardStore !== -1) {
      return { boardIndex: boardStore, coordIndex: coordStore };
    } else {
      return null;
    }
  }

  public swapPawn(first: PownIndex, second: PownIndex): number[][][] {
    const posTmp = this.board.coords[first.boardIndex][first.coordIndex];

    this.board.coords[first.boardIndex][first.coordIndex] =
      this.board.coords[second.boardIndex][second.coordIndex];
    this.board.coords[second.boardIndex][second.coordIndex] = posTmp;
    return this.board.coords;
  }

  public checkWin(playerid: string): string | null {
    console.log('Check win ??');
    let winPlayerId: string | null = null;
    this.board.coords.forEach((coord, playerIndex) => {
      if (this.board.emptyIndex !== playerIndex) {
        const winPlayer = this.board.winPegs[playerIndex];
        if (winPlayer.sort().join(',') === coord.sort().join(',')) {
          winPlayerId = playerid;
        }
      }
    });

    return winPlayerId;
  }

  public move = (
    posHex: Hex,
    destHex: Hex,
    playerId: string,
  ): MoveInfo | null => {
    const posIndex = this.getPawnIndexInBoard(posHex);
    const destIndex = this.getPawnIndexInBoard(destHex);
    console.log('POS INDEX', posIndex);
    console.log('destIndex INDEX', destIndex);
    let isNeighbor = false;
    for (let direction = 0; direction < 6; direction++) {
      const hex = posHex.neighbor(direction);

      if (this.isHexEqual(hex, destHex)) {
        isNeighbor = true;
      }
    }
    if (posIndex && destIndex) {
      const boardCoords = this.swapPawn(posIndex, destIndex);
      const winPlayerId = this.checkWin(playerId);
      return { board: this.boardToPawns(boardCoords), isNeighbor, winPlayerId };
    }

    return null;
  };
}
