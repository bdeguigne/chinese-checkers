import { Button, Input } from "antd";
import React, { ChangeEvent } from "react";
import { useState } from "react";
import "./styles/EnterNameInput.css"

interface EnterNameInputProps {
  createPlayer(player: string): void;
}

const EnterNameInput: React.FC<EnterNameInputProps> = ({ createPlayer }) => {
  const [playerName, setPlayerName] = useState("");

  const onNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  };

  const onPlayClicked = () => {
    createPlayer(playerName);
    setPlayerName("");
  };

  return (
    <>
      <Input
        className="home-page__input"
        onChange={onNameChanged}
        size="large"
        placeholder="Enter your name"
      />
      <Button className="home-page__button" type="primary" onClick={onPlayClicked}>
        Play !
      </Button>
    </>
  );
};

export default EnterNameInput;
