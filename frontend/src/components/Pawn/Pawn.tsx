import React, { useContext, useState } from "react";
import { EngineContext } from "../../context/engine-hook";
import { PawnInfo } from "../../engine/default-board-coords";
import { Pawn } from "../../engine/engine-types";
import { Hex } from "../../engine/hex.lib";
import {
  storeAvailableMovements,
  storeSelectedPawn,
} from "../../redux/game/game-thunks";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { hexTypeArrayToHexArray } from "../core/convert";

interface Props {
  pawn: Pawn;
  showAvailableMovements(availableMovements: Hex[]): void;
  move(posPawn: Pawn): void;
}

export const DrawPawn = (props: Props) => {
  const dispatch = useAppDispatch();
  const storedAvailableMovements = useAppSelector(
    (state) => state.game.availableMovements
  );

  const [isHover, setIsHover] = useState(false);
  const engine = useContext(EngineContext);

  const onClicked = () => {
    if (engine.playerCanMoveThisPawn(PawnInfo.playerOne, props.pawn.hex)) {
      dispatch(storeSelectedPawn(props.pawn));
      const availableMovements = engine.availableMovements(props.pawn.hex);
      dispatch(storeAvailableMovements(availableMovements));
      props.showAvailableMovements(availableMovements);
    } else if (
      storedAvailableMovements &&
      engine.playerCanGoToThisHex(
        hexTypeArrayToHexArray(storedAvailableMovements),
        props.pawn.hex
      )
    ) {
      props.move(props.pawn);
    }
  };

  return (
    <circle
      onMouseEnter={() => {
        if (engine.playerCanMoveThisPawn(PawnInfo.playerOne, props.pawn.hex)) {
          return setIsHover(true);
        } else if (
          storedAvailableMovements &&
          engine.playerCanGoToThisHex(
            hexTypeArrayToHexArray(storedAvailableMovements),
            props.pawn.hex
          )
        ) {
          return setIsHover(true);
        }
      }}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClicked}
      cx={props.pawn.x}
      cy={props.pawn.y}
      r="12"
      stroke="black"
      strokeWidth="1"
      fill={isHover ? "grey" : props.pawn.color}
    />
  );
};
