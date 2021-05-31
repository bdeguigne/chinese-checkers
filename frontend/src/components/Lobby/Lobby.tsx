import { Avatar, Button, Col, Row, Tooltip } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import "./styles/lobby.css";
import "../core/styles/core-styles.css";
import { RouteComponentProps } from "react-router-dom";
import { FC, useContext, useEffect, useState } from "react";
import { getRoom, removePlayer } from "../../redux/room/room-thunks";
import { SocketContext } from "../../context/socket";
import { Routes } from "../../App";
import { LeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { setRedirectWithLink } from "src/redux/room/room-slice";

type TParams = { id: string };

enum lobbyEvents {
  joinLobby = "join-lobby",
  play = "play",
  leaveLobby = "leave-lobby",
}

export const Lobby: FC<RouteComponentProps<TParams>> = (props) => {
  const dispatch = useAppDispatch();
  const room = useAppSelector((state) => state.room.currentRoom);
  const hasJoin = useAppSelector((state) => state.room.hasJoin);
  const player = useAppSelector((state) => state.player.player);
  const playerIndex = useAppSelector((state) => state.player.playerIndex);
  const hasJoinWithHomePage = useAppSelector(
    (state) => state.room.hasJoinWithHomepage
  );

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

    players.forEach((playerInfo) => {
      playersTmp.push(playerInfo.info);
    });

    for (let i = playersCount; i < 6; i++) {
      playersTmp.push({
        _id: "placeholder",
        avatar: { seed: "", type: "" },
        gameId: "",
        name: "placeholder",
        win: 0,
        lose: 0,
      });
    }
    setPlayersData(playersTmp);
  };

  // const addPlayerToRoom = (player: Player) => {
  //   dispatch(addPlayer(props.match.params.id, player._id, props.history));
  // };

  useEffect(() => {
    fillRoomWithPlaceholderPlayers(room);
    if (hasJoinWithHomePage === false) {
      dispatch(setRedirectWithLink(true));
      props.history.push(Routes.home);
      // if (player.name !== "") {
      //   dispatch(addPlayer(room._id, player._id, props.history));
      // } else {
      //   console.log("Redirect player to special page to create perso")
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, hasJoinWithHomePage, player]);

  useEffect(() => {
    if (hasJoin === true && connectedToSocket === false) {
      console.log("HAS JOIN TRUE");
      if (socket) {
        socket.emit("lobby", {
          event: lobbyEvents.joinLobby,
          roomId: room._id,
          playerId: player._id,
        });
        socket.on("lobby", (message: SocketResponse) => {
          if (message.event === lobbyEvents.joinLobby) {
            // console.log("GET ROOM", message.data.players);
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
    player._id,
  ]);

  const playButtonClicked = () => {
    socket.emit("lobby", {
      event: lobbyEvents.play,
      roomId: room._id,
    });
  };

  const leaveRoom = () => {
    dispatch(
      removePlayer(
        props.match.params.id,
        player._id,
        props.history,
        socket,
        lobbyEvents.leaveLobby
      )
    );
  };

  return (
    <div className="create-room__container">
      <div className="content__container--transparent">
        <div className="lobby__disconnect-container">
          <Button
            type="text"
            icon={<LeftOutlined />}
            className="lobby__disconnect-button"
            onClick={leaveRoom}
          >
            Leave this room
          </Button>
        </div>
        <div className="lobby__main-container">
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
                        src={
                          <img src={"/assets/placeholder.png"} alt="avatar" />
                        }
                      ></Avatar>
                      <p>Waiting for a player</p>
                    </div>
                  </Col>
                );
              }
            })}
          </Row>

          <div className="lobby__play-button__container">
            {player.gameId === room._id ? (
              <Button
                type="primary"
                className="lobby__play-button"
                onClick={() => playButtonClicked()}
              >
                Reconnect !
              </Button>
            ) : playerIndex === 0 ? (
              room.playersCount === 2 ||
              room.playersCount === 4 ||
              room.playersCount === 6 ? (
                <Button
                  type="primary"
                  className="lobby__play-button"
                  onClick={() => playButtonClicked()}
                >
                  Play !
                </Button>
              ) : (
                <Button
                  disabled={true}
                  type="primary"
                  className="lobby__play-button"
                  onClick={() => playButtonClicked()}
                >
                  You can play only with two, four or six players
                </Button>
              )
            ) : (
              <Button
                type="primary"
                className="lobby__play-button"
                disabled={true}
              >
                Waiting for the host
              </Button>
            )}
          </div>

          <div className="lobby__reload-container">
            <Tooltip title="Reload players" className="avatar__reload-button">
              <Button
                type="ghost"
                shape="circle"
                icon={<ReloadOutlined />}
                onClick={() =>
                  dispatch(getRoom(props.match.params.id, props.history))
                }
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
