import { Button, Input } from "antd";
import React, { ChangeEvent } from "react";
import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import "./styles/EnterNameInput.css";

interface EnterValueInputProps {
  customClassName?: string;
  placeholder: string;
  buttonLabel: string;
  onButtonPressed(value: string): void;
  onInputChanged?(value: string): void;
  showInput: boolean;
}

const EnterValueInput: React.FC<EnterValueInputProps> = ({
  onButtonPressed,
  onInputChanged,
  placeholder,
  buttonLabel,
  customClassName,
  showInput,
}) => {
  const [value, setValue] = useState("");
  const player = useAppSelector((state) => state.player.player);

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (onInputChanged) {
      onInputChanged(event.target.value);
    }
    setValue(event.target.value);
  };

  const validate = () => {
    onButtonPressed(value);
    setValue("");
  };

  return (
    <>
      {showInput && (
        <Input
          className={customClassName ? customClassName : ""}
          onChange={inputChanged}
          size="large"
          placeholder={placeholder}
        />
      )}
      <Button
        className="home-page__button"
        type="primary"
        disabled={player.name === "" && value.length === 0}
        onClick={validate}
      >
        {buttonLabel}
      </Button>
    </>
  );
};

export default EnterValueInput;
