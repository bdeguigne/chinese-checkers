import React, { useContext, useEffect, useState } from "react";
import { DrawPawn } from "../Pawn/Pawn";
import { Pawn } from "../../engine/engine-types";
import { EngineContext } from "../../context/engine-hook";
import { Hex } from "../../engine/hex.lib";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { moveFinished } from "../../redux/game/game-slice";
// import { useAppSelector } from "../../redux/hooks";

interface Props {}

export const Board = (props: Props) => {
  const dispatch = useAppDispatch();
  const [currentPawns, setCurrentPawns] = useState<Pawn[]>([]);
  const [pawns, setPawns] = useState<Pawn[]>([]);
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
      updatePawns(engine.move(storedSelectedPawnHex, pawn.hex));
      dispatch(moveFinished());
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
