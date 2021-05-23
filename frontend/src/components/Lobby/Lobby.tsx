import { Avatar, Button, Col, Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import "./styles/lobby.css";
import "../core/styles/core-styles.css";
import { RouteComponentProps } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { addPlayer, getRoom } from "../../redux/room/room-thunks";

type TParams = { id: string };

export const Lobby: FC<RouteComponentProps<TParams>> = (props) => {
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const room = useAppSelector((state) => state.room.currentRoom);
  const player = useAppSelector((state) => state.player.player);
  const dispatch = useAppDispatch();

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
    if (player._id !== "") {
      addPlayerToRoom(player);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

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
          <Button type="primary" className="lobby__play-button">
            Play !
          </Button>
        </div>
      </div>
    </div>
  );
};
