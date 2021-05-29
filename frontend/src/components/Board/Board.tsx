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
import {
  storeAvailableMovements,
  storeSelectedPawn,
} from "../../redux/game/game-thunks";

interface Props {
  moveFinished(board: number[][][]): void;
  board: number[][][] | null;
  playerWin(playerId: string): void;
}

export const Board = (props: Props) => {
  const [currentPawns, setCurrentPawns] = useState<Pawn[]>([]);
  const [pawns, setPawns] = useState<Pawn[]>([]);
  const [checkMoveFinished, setCheckMoveFinished] = useState<Pawn>();
  const [isMoveNeighbor, setIsMoveNeighbor] = useState(false);

  const dispatch = useAppDispatch();
  const storedSelectedPawn = useAppSelector((state) => state.game.selectedPawn);
  const playerIndex = useAppSelector((state) => state.player.playerIndex);
  const player = useAppSelector((state) => state.player.player);
  const currentPlayerIndex = useAppSelector(
    (state) => state.game.currentPlayerIndex
  );
  // var board = useAppSelector((state) => state.game.board);
  const playersCount = useAppSelector(
    (state) => state.room.currentRoom.playersCount
  );

  const engine = useContext(EngineContext);

  const updatePawns = (pawns: Pawn[]) => {
    setPawns(pawns);
    setCurrentPawns(pawns);
  };

  const moveFinishedHandler = () => {
    dispatch(moveFinished());
    props.moveFinished(engine.board.coords);
  };

  useEffect(() => {
    if (props.board) {
      engine.setBoardCoordinates(props.board);
      engine.setBoardType(playersCount, props.board);
      updatePawns(engine.boardToPawns(props.board));
    }
  }, [engine, playersCount, props.board]);

  // useEffect(() => {
  //   if (updatePawns) {
  //     updatePawns(engine.defaultBoard());
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [engine]);

  // useEffect(() => {
  //   if (board) {
  //     engine.setBoardType(playersCount);
  //     updatePawns(engine.boardToPawns(board));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [board, engine]);

  useEffect(() => {
    if (checkMoveFinished && pawns && currentPawns) {
      if (
        playerIndex !== null &&
        engine.playerCanMoveThisPawn(playerIndex, checkMoveFinished.hex)
      ) {
        dispatch(storeSelectedPawn(checkMoveFinished));
        const movements = engine.availableMovements(checkMoveFinished.hex);
        const availableMovements = movements.jumpCoords;

        if (availableMovements.length === 0 || isMoveNeighbor) {
          moveFinishedHandler();
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
      const moveInfo = engine.move(storedSelectedPawnHex, pawn.hex, player._id);
      if (moveInfo) {
        updatePawns(moveInfo.board);
        setIsMoveNeighbor(moveInfo.isNeighbor);
        dispatch(
          setCurrentHexPosition({ q: pawn.hex.q, r: pawn.hex.r, s: pawn.hex.s })
        );
        setCheckMoveFinished(pawn);
        if (moveInfo.winPlayerId !== null) {
          props.playerWin(moveInfo.winPlayerId);
        }
      }
    }
  };

  return (
    <svg width={800} height={620}>
      {pawns.length > 0 &&
        pawns.map((pawn, i) => {
          return (
            <DrawPawn
              isPlayerTurn={currentPlayerIndex === playerIndex}
              key={i}
              pawn={pawn}
              showAvailableMovements={showAvailableMovements}
              moveFinishedHandler={moveFinishedHandler}
              move={move}
            />
          );
        })}
    </svg>
  );
};
