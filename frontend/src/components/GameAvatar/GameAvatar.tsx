import React, { useEffect, useState } from "react";
import "./styles/avatar.css";
import { ReloadOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { v4 as uuidv4 } from "uuid";

export const types = {
  big: "big",
  small: "small",
};

type AvatarType = keyof typeof types;

interface Props {
  type: AvatarType;
  showReloadButton?: boolean;
  onReloadButtonPressed?(): void;
  onSeedChanged?(seed: string): void;
}

const defaultProps: Props = {
  type: "small",
  showReloadButton: false,
};

export const GameAvatar = (props: Props & typeof defaultProps) => {
  const [seed, setSeed] = useState(uuidv4());
  const onReloadButtonPressed = () => {
    setSeed(uuidv4());
    if (props.onReloadButtonPressed) {
      props.onReloadButtonPressed();
    }
  };

  useEffect(() => {
    if (props.onSeedChanged) {
      props.onSeedChanged(seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <div className={"avatar__container--" + props.type}>
      <img
        className="avatar__image"
        src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
        alt="avatar"
      ></img>
      {props.showReloadButton && (
        <Tooltip
          title="Generate a new avatar"
          className="avatar__reload-button"
        >
          <Button
            type="ghost"
            shape="circle"
            icon={<ReloadOutlined />}
            onClick={onReloadButtonPressed}
          />
        </Tooltip>
      )}
    </div>
  );
};

GameAvatar.defaultProps = defaultProps;
