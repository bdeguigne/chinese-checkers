import { MoveInfo, Movements, Pawn, PownIndex } from "./engine-types";
import { Hex, Layout, OffsetCoord, Point } from "./hex.lib";
import { defaultBoardCoords, PawnInfo } from "./default-board-coords";

export class ChineseCheckersEngine {
  r = 22;
  layout: Layout;
  boardCoordinates: number[][][];

  constructor() {
    this.boardCoordinates = defaultBoardCoords;
    this.layout = new Layout(
      Layout.pointy,
      new Point(this.r, this.r),
      new Point(400, 325)
    );
  }

  public setBoardCoordinates(newBoard: number[][][]) {
    this.boardCoordinates = newBoard;
  }

  public boardToPawns(board: number[][][]): Pawn[] {
    const pawns: Pawn[] = [];
    const colors: string[] = [
      "green",
      "white",
      "yellow",
      "red",
      "black",
      "blue",
      "lightgrey",
    ];

    board.forEach((playerCoords, index) => {
      playerCoords.forEach((coords) => {
        const hex = OffsetCoord.roffsetToCube(
          -1,
          new OffsetCoord(coords[0], coords[1])
        );
        var coord = this.layout.hexToPixel(hex);
        pawns.push({
          hex,
          x: coord.x,
          y: coord.y,
          color: colors[index],
        });
      });
    });

    return pawns;
  }

  public defaultBoard(): Pawn[] {
    return this.boardToPawns(defaultBoardCoords);
  }

  public isCoordsEqualOffset = (coords: number[], offset: OffsetCoord) => {
    if (coords[0] === offset.col && coords[1] === offset.row) {
      return true;
    }
    return false;
  };

  public isHexInsidePawns = (
    hex: Hex,
    pawnsInfoCoords: number[][]
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
      let hexNeighbor = hex.neighbor(direction);
      if (
        this.isHexInsidePawns(
          hexNeighbor,
          this.boardCoordinates[PawnInfo.empty]
        )
      ) {
        movements.neighborCoords.push(hexNeighbor);
      }
      let movementCount = 1;
      let checkHex: Hex = hexNeighbor;

      while (true) {
        if (
          this.isHexInsidePawns(checkHex, this.boardCoordinates[PawnInfo.empty])
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
            this.boardCoordinates[PawnInfo.empty]
          )
        ) {
          break;
        }
      }
      if (
        this.isHexInsidePawns(checkHex, this.boardCoordinates[PawnInfo.empty])
      ) {
        movements.jumpCoords.push(checkHex);
      }
    }

    return movements;
  }

  public playerCanMoveThisPawn(pawnInfo: PawnInfo, hex: Hex): boolean {
    return this.isHexInsidePawns(hex, this.boardCoordinates[pawnInfo]);
  }

  public playerCanGoToThisHex(
    availableMovements: Hex[] | null,
    playerHex: Hex
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
      boardIndex < this.boardCoordinates.length;
      boardIndex++
    ) {
      const boardPlayer = this.boardCoordinates[boardIndex];
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
    var posTmp = this.boardCoordinates[first.boardIndex][first.coordIndex];

    this.boardCoordinates[first.boardIndex][first.coordIndex] =
      this.boardCoordinates[second.boardIndex][second.coordIndex];
    this.boardCoordinates[second.boardIndex][second.coordIndex] = posTmp;
  }

  public move = (posHex: Hex, destHex: Hex): MoveInfo => {
    let posIndex = this.getPawnIndexInBoard(posHex);
    let destIndex = this.getPawnIndexInBoard(destHex);
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

    return { board: this.boardToPawns(this.boardCoordinates), isNeighbor };
  };
}
