import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { FC, useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { SocketContext } from "../../context/socket";
import { setCurrentPlayerIndex } from "../../redux/game/game-slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Board } from "../Board/Board";
import { PlayersTable } from "./PlayersTable/PlayersTable";
import "./styles/GameLayout.css";

type TParams = { id: string };

enum gameEvents {
  connected = "connected",
  start = "start",
  notReady = "not-ready",
  moveFinished = "move-finished",
  updateBoard = "update-board",
}

export const GameLayout: FC<RouteComponentProps<TParams>> = (props) => {
  const socket = useContext(SocketContext);
  const player = useAppSelector((state) => state.player.player);
  const dispatch = useAppDispatch();
  const [updatedBoard, setUpdatedBoard] = useState<number[][][] | null>(null);

  useEffect(() => {
    console.log("HELLO");
    if (player._id && props.match.params.id && socket) {
      socket.emit("game", {
        event: gameEvents.connected,
        roomId: props.match.params.id,
        playerId: player._id,
      });

      socket.on("game", (message: SocketResponse<GameResponse>) => {
        if (message.event === gameEvents.start) {
          if (message.data.playerIndex !== undefined) {
            dispatch(setCurrentPlayerIndex(message.data.playerIndex));
          }
        }
        if (message.event === gameEvents.notReady) {
          console.log("NOT READY");
        }
        if (message.event === gameEvents.updateBoard) {
          if (message.data.board) {
            setUpdatedBoard(message.data.board);
            console.log("UPDATE BOARD", message.data.board);
          }
        }
      });

      socket.on("exception", (error: SocketError) => {
        console.log("Error from socket", error.message);
      });
    }
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

  return (
    <Layout className="game-layout__layout">
      {/* <Header className="game-layout--box-shadow">Header</Header> */}
      <Layout className="game-layout__content-layout">
        <Content>
          <Board moveFinished={moveFinished} board={updatedBoard} />
        </Content>
        <Sider
          width={250}
          className="game--layout__sider game-layout--box-shadow"
        >
          <PlayersTable />
        </Sider>
      </Layout>
    </Layout>
  );
};
