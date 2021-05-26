import { Table } from "antd";
import { useAppSelector } from "../../../redux/hooks";
import { GameAvatar } from "../../GameAvatar/GameAvatar";

const columns = [
  {
    title: "Avatar",
    dataIndex: "info",
    key: "avatar",
    render: (player: Player) => <GameAvatar seed={player.avatar.seed} />,
  },
  {
    title: "name",
    dataIndex: "info",
    key: "name",
    render: (player: Player) => player.name,
  },
];

interface Props {}

export const PlayersTable = (props: Props) => {
  const players = useAppSelector((state) => state.room.currentRoom.players);

  return (
    <Table
      columns={columns}
      dataSource={players}
      pagination={false}
      showHeader={false}
    />
  );
};
