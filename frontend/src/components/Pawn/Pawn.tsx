import React, { useContext, useState } from "react";
import { EngineContext } from "../../context/engine-hook";
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
  moveFinishedHandler(): void;
}

export const DrawPawn = (props: Props) => {
  const dispatch = useAppDispatch();
  const storedAvailableMovements = useAppSelector(
    (state) => state.game.availableMovements
  );
  const currentHexPosition = useAppSelector(
    (state) => state.game.currentHexPosition
  );
  const playerIndex = useAppSelector((state) => state.player.playerIndex);

  const [isHover, setIsHover] = useState(false);
  const engine = useContext(EngineContext);

  const onClicked = () => {
    if (
      storedAvailableMovements !== null &&
      currentHexPosition &&
      engine.isHexEqual(
        props.pawn.hex,
        new Hex(
          currentHexPosition.q,
          currentHexPosition.r,
          currentHexPosition.s
        )
      )
    ) {
      props.moveFinishedHandler();
      props.showAvailableMovements([]);
    } else if (
      !currentHexPosition &&
      playerIndex !== null &&
      engine.playerCanMoveThisPawn(playerIndex, props.pawn.hex)
    ) {
      dispatch(storeSelectedPawn(props.pawn));
      const movements = engine.availableMovements(props.pawn.hex);
      const availableMovements = movements.jumpCoords.concat(
        movements.neighborCoords
      );

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
        if (
          storedAvailableMovements !== null &&
          currentHexPosition &&
          engine.isHexEqual(
            props.pawn.hex,
            new Hex(
              currentHexPosition.q,
              currentHexPosition.r,
              currentHexPosition.s
            )
          )
        ) {
          setIsHover(true);
        } else if (
          !currentHexPosition &&
          playerIndex !== null &&
          engine.playerCanMoveThisPawn(playerIndex, props.pawn.hex)
        ) {
          setIsHover(true);
        } else if (
          storedAvailableMovements &&
          engine.playerCanGoToThisHex(
            hexTypeArrayToHexArray(storedAvailableMovements),
            props.pawn.hex
          )
        ) {
          setIsHover(true);
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
