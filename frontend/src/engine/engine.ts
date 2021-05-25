import { Pawn, PownIndex } from "./engine-types";
import { Hex, Layout, OffsetCoord, Point } from "./hex.lib";
import { defaultBoardCoords, PawnInfo } from "./default-board-coords";

// TODO Faire une class game engine, qui stock l'etat actuel du board.
// TODO Faire une fonction qui recupere la position d'un pion et return les coordonnées des mouvements disponible (Commencer par les voisins)

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

  public availableMovements(hex: Hex): Hex[] {
    const neighborCoords: Hex[] = [];

    for (let i = 0; i < 6; i++) {
      let hexNeighbor = hex.neighbor(i);
      if (
        this.isHexInsidePawns(
          hexNeighbor,
          this.boardCoordinates[PawnInfo.empty]
        )
      ) {
        neighborCoords.push(hexNeighbor);
      }
    }

    return neighborCoords;
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

  public move = (posHex: Hex, destHex: Hex): Pawn[] => {
    let posIndex = this.getPawnIndexInBoard(posHex);
    let destIndex = this.getPawnIndexInBoard(destHex);

    if (posIndex && destIndex) {
      this.swapPawn(posIndex, destIndex);
    }

    return this.boardToPawns(this.boardCoordinates);
  };
}
