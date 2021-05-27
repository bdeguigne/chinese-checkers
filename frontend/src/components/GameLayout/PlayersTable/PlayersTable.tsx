import { Divider } from "antd";
import { useAppSelector } from "../../../redux/hooks";
import { GameAvatar } from "../../GameAvatar/GameAvatar";
import "./styles/PlayersTable.css";

interface Props {}

export const PlayersTable = (props: Props) => {
  const players = useAppSelector((state) => state.room.currentRoom.players);
  const playerIndex = useAppSelector((state) => state.game.currentPlayerIndex);

  return (
    <>
      {players.map((player, i) => {
        return (
          <div>
            <div
              key={player.info._id}
              className={i === playerIndex ? "players-table__item-container--selected" : "players-table__item-container"}
            >
              <GameAvatar seed={player.info.avatar.seed} />
              <span>{player.info.name}</span>
            </div>
            <Divider className="players-table__divider" />
          </div>
        );
      })}
    </>
  );
};
