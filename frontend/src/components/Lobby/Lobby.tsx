import { Avatar, Button, Col, Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import "./styles/lobby.css";
import "../core/styles/core-styles.css";
import { RouteComponentProps } from "react-router-dom";
import { FC, useContext, useEffect, useState } from "react";
import { addPlayer, getRoom } from "../../redux/room/room-thunks";
import { SocketContext } from "../../context/socket";
import { Routes } from "../../App";

type TParams = { id: string };

enum lobbyEvents {
  joinLobby = "join-lobby",
  play = "play",
}

export const Lobby: FC<RouteComponentProps<TParams>> = (props) => {
  const dispatch = useAppDispatch();
  const room = useAppSelector((state) => state.room.currentRoom);
  const hasJoin = useAppSelector((state) => state.room.hasJoin);
  const player = useAppSelector((state) => state.player.player);

  const socket = useContext(SocketContext);

  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [connectedToSocket, setConnectedToSocket] = useState(false);

  useEffect(() => {
    dispatch(getRoom(props.match.params.id, props.history));
  }, [dispatch, props.history, props.match.params.id]);

  const fillRoomWithPlaceholderPlayers = async (room: Room) => {
    const playersCount = room.playersCount;
    const players = room.players;
    const playersTmp: Player[] = [];

    playersTmp.push(...players);

    for (let i = playersCount; i < 6; i++) {
      playersTmp.push({
        _id: "placeholder",
        avatar: { seed: "", type: "" },
        name: "placeholder",
      });
    }
    setPlayersData(playersTmp);
  };

  const addPlayerToRoom = (player: Player) => {
    dispatch(addPlayer(props.match.params.id, player._id, props.history));
  };

  useEffect(() => {
    fillRoomWithPlaceholderPlayers(room);
  }, [room]);

  useEffect(() => {
    if (hasJoin === true && connectedToSocket === false) {
      console.log("HAS JOIN TRUE");
      if (socket) {
        socket.emit("lobby", {
          event: lobbyEvents.joinLobby,
          roomId: room._id,
        });
        socket.on("lobby", (message: LobbyResponse) => {
          if (message.event === lobbyEvents.joinLobby) {
            console.log("GET ROOM");
            dispatch(getRoom(props.match.params.id, props.history));
          }
          if (message.event === lobbyEvents.play) {
            props.history.push(Routes.game + "/" + room._id);
          }
        });
        setConnectedToSocket(true);
      }
    }
  }, [
    hasJoin,
    socket,
    room._id,
    player.name,
    dispatch,
    props.match.params.id,
    props.history,
    connectedToSocket,
  ]);

  useEffect(() => {
    if (player._id !== "" && hasJoin === false) {
      addPlayerToRoom(player);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, hasJoin]);

  const playButtonClicked = () => {
    socket.emit("lobby", {
      event: lobbyEvents.play,
      roomId: room._id,
    });
  };

  return (
    <div className="create-room__container">
      <div className="content__container">
        <Row gutter={16}>
          {playersData.map((player, i) => {
            if (player._id !== "placeholder") {
              return (
                <Col className="gutter-row" span={8} key={i}>
                  <div className="lobby-user-card--container">
                    <Avatar
                      size={100}
                      src={
                        <img
                          src={`https://avatars.dicebear.com/api/${player.avatar.type}/${player.avatar.seed}.svg`}
                          alt="avatar"
                        />
                      }
                    ></Avatar>
                    <p>{player.name}</p>
                  </div>
                </Col>
              );
            } else {
              return (
                <Col className="gutter-row" span={8} key={i}>
                  <div className="lobby-user-card--container">
                    <Avatar
                      size={100}
                      src={<img src={"/assets/placeholder.png"} alt="avatar" />}
                    ></Avatar>
                    <p>Waiting for a player</p>
                  </div>
                </Col>
              );
            }
          })}
        </Row>

        <div className="lobby__play-button__container">
          <Button
            type="primary"
            className="lobby__play-button"
            onClick={() => playButtonClicked()}
          >
            Play !
          </Button>
        </div>
      </div>
    </div>
  );
};
