import { FC, useState } from "react";
import "./styles/HomePage.css";
import "../core/styles/core-styles.css";
import EnterNameInput from "../EnterNameInput/EnterValueInput";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  createPlayer,
  createPlayerAndJoinRoom,
} from "../../redux/player/player-thunks";
import { activateGuestMode } from "../../redux/player/player-slice";
import { Divider, Button } from "antd";
import { GameAvatar } from "../GameAvatar/GameAvatar";
import { RouteChildrenProps } from "react-router-dom";
import { Routes } from "../../App";
import {
  addPlayer,
  createRoom as createRoomThunks,
} from "../../redux/room/room-thunks";
import { setHasJoinWithHomePage } from "src/redux/room/room-slice";
// import { io, Socket } from "socket.io-client";

const HomePage: FC<RouteChildrenProps> = (props) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [seed, setSeed] = useState("");

  const player = useAppSelector((state) => state.player.player);
  const redirectWithLink = useAppSelector(
    (state) => state.room.redirectWithLink
  );
  const currentRoom = useAppSelector((state) => state.room.currentRoom);
  const hasJoin = useAppSelector((state) => state.room.hasJoin);
  const isGuestMode = useAppSelector((state) => state.player.guestMode);

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
      dispatch(setHasJoinWithHomePage(true));
      dispatch(createRoomThunks(player._id, props.history));
    }
  };

  const guestMode = () => {
    dispatch(activateGuestMode());
    dispatch(setHasJoinWithHomePage(true));
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
          <div className="home-page__score-container">
            <p>
              win : {player.win} / lose : {player.lose}
            </p>
          </div>
          <div className="content__container">
            {redirectWithLink === true && hasJoin === true ? (
              isGuestMode ? (
                <EnterNameInput
                  showInput={player.name === ""}
                  customClassName="home-page__input"
                  onButtonPressed={(name) => {
                    dispatch(setHasJoinWithHomePage(true));
                    dispatch(
                      createPlayerAndJoinRoom(
                        name,
                        { type: "human", seed },
                        currentRoom,
                        props.history
                      )
                    );
                    dispatch(addPlayer(currentRoom._id, player._id));
                    props.history.push(Routes.room + "/" + currentRoom._id);
                  }}
                  onInputChanged={(value) => setName(value)}
                  buttonLabel="Join invite room"
                  placeholder="Enter your name"
                />
              ) : player.name === "" ? (
                <EnterNameInput
                  showInput={player.name === ""}
                  customClassName="home-page__input"
                  onButtonPressed={(name) => {
                    dispatch(setHasJoinWithHomePage(true));
                    dispatch(
                      createPlayerAndJoinRoom(
                        name,
                        { type: "human", seed },
                        currentRoom,
                        props.history
                      )
                    );
                    dispatch(addPlayer(currentRoom._id, player._id));
                    props.history.push(Routes.room + "/" + currentRoom._id);
                  }}
                  onInputChanged={(value) => setName(value)}
                  buttonLabel="Join invite room"
                  placeholder="Enter your name"
                />
              ) : (
                <Button
                  type="primary"
                  className="home-page__join-button"
                  disabled={player.name === ""}
                  onClick={() => {
                    dispatch(setHasJoinWithHomePage(true));
                    dispatch(addPlayer(currentRoom._id, player._id));
                    props.history.push(Routes.room + "/" + currentRoom._id);
                  }}
                >
                  Join invite room
                </Button>
              )
            ) : (
              <EnterNameInput
                showInput={player.name === ""}
                customClassName="home-page__input"
                onButtonPressed={(name) => {
                  dispatch(setHasJoinWithHomePage(true));
                  joinRoom(name, { type: "human", seed });
                }}
                onInputChanged={(value) => setName(value)}
                buttonLabel="Join a room"
                placeholder="Enter your name"
              />
            )}

            <Divider />
            <Button
              disabled={player.name === "" && name.length === 0}
              className="home-page__join-button"
              onClick={() => {
                dispatch(setHasJoinWithHomePage(true));
                createRoom(name, { type: "human", seed });
              }}
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
