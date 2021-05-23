import { Button, Input } from "antd";
import React, { ChangeEvent } from "react";
import { useState } from "react";
import "./styles/EnterNameInput.css";

interface EnterValueInputProps {
  customClassName?: string;
  placeholder: string;
  buttonLabel: string;
  onButtonPressed(value: string): void;
  onInputChanged?(value: string): void;
}

const EnterValueInput: React.FC<EnterValueInputProps> = ({
  onButtonPressed,
  onInputChanged,
  placeholder,
  buttonLabel,
  customClassName,
}) => {
  const [value, setValue] = useState("");

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
      <Input
        className={customClassName ? customClassName : ""}
        onChange={inputChanged}
        size="large"
        placeholder={placeholder}
      />
      <Button className="home-page__button" type="primary" onClick={validate}>
        {buttonLabel}
      </Button>
    </>
  );
};

export default EnterValueInput;
