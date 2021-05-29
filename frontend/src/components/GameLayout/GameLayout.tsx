import { FC, useContext, useEffect, useState } from "react";
import { Layout, message as messageSnackbar, Modal } from "antd";
import { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { RouteComponentProps } from "react-router-dom";
import { SocketContext } from "../../context/socket";
import { setCurrentPlayerIndex } from "../../redux/game/game-slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Board } from "../Board/Board";
import { getRoom } from "../../redux/room/room-thunks";
import { PlayersTable } from "./PlayersTable/PlayersTable";
import "./styles/GameLayout.css";
import { leaveRoom } from "src/redux/room/room-slice";
import { Routes } from "src/App";
import {
  playerWinRequest,
  playerLoseRequest,
} from "src/redux/player/player-thunks";

type TParams = { id: string };

enum gameEvents {
  connected = "connected",
  start = "start",
  notReady = "not-ready",
  moveFinished = "move-finished",
  updateBoard = "update-board",
  nextPlayer = "next-player",
  playerWins = "player-wins",
}

export const GameLayout: FC<RouteComponentProps<TParams>> = (props) => {
  const socket = useContext(SocketContext);
  const player = useAppSelector((state) => state.player.player);
  const playerIndex = useAppSelector((state) => state.player.playerIndex);
  const dispatch = useAppDispatch();
  const [updatedBoard, setUpdatedBoard] = useState<number[][][] | null>(null);
  const [ready, setReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [winPlayerData, setWinPlayerData] =
    useState<WinPlayerType | null>(null);

  useEffect(() => {
    dispatch(getRoom(props.match.params.id, props.history));
    if (player._id && props.match.params.id && socket) {
      socket.emit("game", {
        event: gameEvents.connected,
        roomId: props.match.params.id,
        playerId: player._id,
      });

      socket.on("game", (message: SocketResponse<GameResponse>) => {
        if (message.event === gameEvents.start) {
          setReady(true);
          setShowModal(true);
          console.log("START", message.data);
          if (message.data.playerIndex !== undefined) {
            dispatch(setCurrentPlayerIndex(message.data.playerIndex));
          }
          if (message.data.board !== undefined) {
            setUpdatedBoard(message.data.board);
            // dispatch(setBoard(message.data.board));
          }
        }

        if (message.event === gameEvents.notReady) {
          setReady(false);
          console.log("NOT READY");
        }

        if (message.event === gameEvents.updateBoard) {
          if (message.data.board) {
            setUpdatedBoard(message.data.board);
            console.log("UPDATE BOARD", message.data.board);
          }
        }

        if (message.event === gameEvents.nextPlayer) {
          console.log("NEXT PLAYER DATA", message.data);
          if (message.data.playerIndex !== undefined) {
            if (playerIndex === message.data.playerIndex) {
              messageSnackbar.info("It's your turn !");
            }
            dispatch(setCurrentPlayerIndex(message.data.playerIndex));
          }
        }

        if (message.event === gameEvents.playerWins) {
          if (message.data.playerId && message.data.playerName) {
            dispatch(
              message.data.playerId === player._id
                ? playerWinRequest(player._id)
                : playerLoseRequest(player._id)
            );
            setWinPlayerData({
              playerId: message.data.playerId,
              playerName: message.data.playerName,
            });
          }
        }
      });

      socket.on("exception", (error: SocketError) => {
        messageSnackbar.error(error.message);
        console.log("Error from socket", error.message);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, player._id, props.match.params.id, socket]);

  const moveFinished = (board: number[][][]) => {
    const roomId = props.match.params.id;

    socket.emit("game", {
      event: gameEvents.moveFinished,
      roomId,
      board,
    });

    console.log("Move finished ! board :", board);
  };

  const playerWin = (playerId: string) => {
    const roomId = props.match.params.id;
    socket.emit("game", {
      event: gameEvents.playerWins,
      roomId,
      playerName: player.name,
      playerId,
    });
  };

  return (
    <Layout className="game-layout__layout">
      <Layout className="game-layout__content-layout">
        <Content>
          <Board
            moveFinished={moveFinished}
            board={updatedBoard}
            playerWin={playerWin}
          />
        </Content>
        <Sider
          width={250}
          className="game--layout__sider game-layout--box-shadow"
        >
          <PlayersTable />
        </Sider>
      </Layout>
      {showModal && (
        <Modal
          title="A player has been disconnected"
          centered
          visible={!ready}
          closable={false}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          The game will resume once all players are connected
        </Modal>
      )}
      {showModal && (
        <Modal
          title="A player has been disconnected"
          centered
          visible={!ready}
          closable={false}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          The game will resume once all players are connected
        </Modal>
      )}

      {winPlayerData !== null && (
        <Modal
          title={
            winPlayerData.playerId === player._id ? "You win !" : "You lose :("
          }
          centered
          visible={winPlayerData !== null}
          closable={false}
          cancelButtonProps={{ style: { display: "none" } }}
          okText="Return to homepage"
          onOk={() => {
            dispatch(leaveRoom());
            props.history.push(Routes.home);
          }}
        >
          {`Congratulations ${winPlayerData.playerName} !`}
        </Modal>
      )}
    </Layout>
  );
};
