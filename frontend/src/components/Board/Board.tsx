import React, { useContext, useEffect, useState } from "react";
import { DrawPawn } from "../Pawn/Pawn";
import { Pawn } from "../../engine/engine-types";
import { EngineContext } from "../../context/engine-hook";
import { Hex } from "../../engine/hex.lib";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  moveFinished,
  setCurrentHexPosition,
} from "../../redux/game/game-slice";
import { PawnInfo } from "../../engine/default-board-coords";
import {
  storeAvailableMovements,
  storeSelectedPawn,
} from "../../redux/game/game-thunks";
// import { useAppSelector } from "../../redux/hooks";

interface Props {}

export const Board = (props: Props) => {
  const dispatch = useAppDispatch();
  const [currentPawns, setCurrentPawns] = useState<Pawn[]>([]);
  const [pawns, setPawns] = useState<Pawn[]>([]);
  const [checkMoveFinished, setCheckMoveFinished] = useState<Pawn>();
  const [isMoveNeighbor, setIsMoveNeighbor] = useState(false);
  const storedSelectedPawn = useAppSelector((state) => state.game.selectedPawn);

  const engine = useContext(EngineContext);

  const updatePawns = (pawns: Pawn[]) => {
    setPawns(engine.defaultBoard());
    setCurrentPawns(engine.defaultBoard());
  };

  useEffect(() => {
    if (updatePawns) {
      updatePawns(engine.defaultBoard());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  useEffect(() => {
    if (checkMoveFinished && pawns && currentPawns) {
      if (
        engine.playerCanMoveThisPawn(PawnInfo.playerTwo, checkMoveFinished.hex)
      ) {
        dispatch(storeSelectedPawn(checkMoveFinished));
        const movements = engine.availableMovements(checkMoveFinished.hex);
        const availableMovements = movements.jumpCoords;

        if (availableMovements.length === 0 || isMoveNeighbor) {
          dispatch(moveFinished());
        } else {
          dispatch(storeAvailableMovements(availableMovements));
          showAvailableMovements(availableMovements);
        }
        setCheckMoveFinished(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pawns, currentPawns, checkMoveFinished, isMoveNeighbor]);

  const showAvailableMovements = (availableMovements: Hex[]) => {
    let pawnsTmp = Array.from(currentPawns);

    availableMovements.forEach((hex) => {
      const neighbor = hex.toPawn(engine.layout, "purple");
      var foundIndex = pawns.findIndex(
        (element) => element.x === neighbor.x && element.y === neighbor.y
      );
      pawnsTmp[foundIndex] = neighbor;
    });

    setPawns(pawnsTmp);
  };

  const move = (pawn: Pawn) => {
    if (storedSelectedPawn) {
      const storedSelectedPawnHex = new Hex(
        storedSelectedPawn.hex.q,
        storedSelectedPawn.hex.r,
        storedSelectedPawn.hex.s
      );
      const moveInfo = engine.move(storedSelectedPawnHex, pawn.hex);
      updatePawns(moveInfo.board);
      setIsMoveNeighbor(moveInfo.isNeighbor);
      dispatch(
        setCurrentHexPosition({ q: pawn.hex.q, r: pawn.hex.r, s: pawn.hex.s })
      );
      setCheckMoveFinished(pawn);
    }
  };

  return (
    <svg width={800} height={620}>
      {pawns.length > 0 &&
        pawns.map((pawn, i) => {
          return (
            <DrawPawn
              key={i}
              pawn={pawn}
              showAvailableMovements={showAvailableMovements}
              move={move}
            />
          );
        })}
    </svg>
  );
};
