import { FC, useState } from "react";
import "./styles/HomePage.css";
import "../core/styles/core-styles.css";
import EnterNameInput from "../EnterNameInput/EnterValueInput";
import { useAppDispatch } from "../../redux/hooks";
import { createPlayer } from "../../redux/player/player-thunks";
import { Divider, Button } from "antd";
import { GameAvatar } from "../GameAvatar/GameAvatar";
import { RouteChildrenProps } from "react-router-dom";
import { Routes } from "../../App";
// import { io, Socket } from "socket.io-client";

const HomePage: FC<RouteChildrenProps> = (props) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [seed, setSeed] = useState("");

  const joinRoom = (playerName: string, avatar: Avatar) => {
    dispatch(createPlayer(playerName, avatar, Routes.rooms, props.history));
  };

  const createRoom = (playerName: string, avatar: Avatar) => {
    dispatch(createPlayer(playerName, avatar, Routes.room, props.history));
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
              onSeedChanged={(seed) => setSeed(seed)}
            />
          </div>
          <div className="content__container">
            <EnterNameInput
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
              className="home-page__join-button"
              onClick={() => createRoom(name, { type: "human", seed })}
            >
              Create a private room
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
