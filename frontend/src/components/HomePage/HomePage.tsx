import { FC, useState } from "react";
import "./styles/HomePage.css";
import "../core/styles/core-styles.css";
import EnterNameInput from "../EnterNameInput/EnterValueInput";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createPlayer } from "../../redux/player/player-thunks";
import { activateGuestMode } from "../../redux/player/player-slice";
import { Divider, Button } from "antd";
import { GameAvatar } from "../GameAvatar/GameAvatar";
import { RouteChildrenProps } from "react-router-dom";
import { Routes } from "../../App";
import { createRoom as createRoomThunks } from "../../redux/room/room-thunks";
// import { io, Socket } from "socket.io-client";

const HomePage: FC<RouteChildrenProps> = (props) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [seed, setSeed] = useState("");

  const player = useAppSelector((state) => state.player.player);

  const joinRoom = (playerName: string, avatar: Avatar) => {
    if (player.name === "") {
      dispatch(createPlayer(playerName, avatar, Routes.rooms, props.history));
    } else {
      props.history.push(Routes.rooms);
    }
  };

  const createRoom = (playerName: string, avatar: Avatar) => {
    if (player.name === "") {
      dispatch(createPlayer(playerName, avatar, Routes.room, props.history));
    } else {
      dispatch(createRoomThunks(player._id, props.history));
    }
  };

  const guestMode = () => {
    dispatch(activateGuestMode());
  };

  return (
    <>
      <div className="home-page-top__container">
        <h1>Chinese Checkers</h1>
      </div>
      <div className="home-page__container">
        <div className="home-page__input-container">
          <div className="home-page__avatar-container">
            <GameAvatar
              showReloadButton={true}
              type="big"
              seed={player.avatar.seed !== "" ? player.avatar.seed : undefined}
              onSeedChanged={(seed) => setSeed(seed)}
            />
          </div>
          <div className="content__container">
            <EnterNameInput
              showInput={player.name === ""}
              customClassName="home-page__input"
              onButtonPressed={(name) =>
                joinRoom(name, { type: "human", seed })
              }
              onInputChanged={(value) => setName(value)}
              buttonLabel="Join a room"
              placeholder="Enter your name"
            />
            <Divider />
            <Button
              disabled={player.name === "" && name.length === 0}
              className="home-page__join-button"
              onClick={() => createRoom(name, { type: "human", seed })}
            >
              Create a private room
            </Button>
            {player.name !== "" && (
              <>
                <Divider />
                <Button
                  className="home-page__join-button"
                  type="dashed"
                  onClick={guestMode}
                >
                  Guest Mode
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
