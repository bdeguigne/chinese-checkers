import { Pawn } from "../../engine/engine-types";
import { Hex } from "../../engine/hex.lib";
import { AppThunk } from "../store";
import { setAvailableMovements, setSelectedPawn } from "./game-slice";

export const storeSelectedPawn =
  (pawn: Pawn): AppThunk =>
  async (dispatch) => {
    dispatch(
      setSelectedPawn({
        color: pawn.color,
        x: pawn.x,
        y: pawn.y,
        hex: {
          q: pawn.hex.q,
          r: pawn.hex.r,
          s: pawn.hex.s,
        },
      })
    );
  };

export const storeAvailableMovements =
  (availableMovements: Hex[]): AppThunk =>
  async (dispatch) => {
    const convertedAvailableMovement: HexType[] = [];
    availableMovements.forEach((hex) => {
      convertedAvailableMovement.push({
        q: hex.q,
        r: hex.r,
        s: hex.s,
      });
    });
    dispatch(setAvailableMovements(convertedAvailableMovement));
  };
