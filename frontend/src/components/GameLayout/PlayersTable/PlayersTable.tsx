import { Table } from "antd";
import { GameAvatar } from "../../GameAvatar/GameAvatar";

const columns = [
  {
    title: "Avatar",
    dataIndex: "avatar",
    key: "avatar",
    render: (avatar: Avatar) => <GameAvatar seed={avatar.seed} />,
  },
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    avatar: {
      type: "human",
      seed: "71977cca-83b3-4a1a-b70f-ea8c267cb3bc",
    },
  },
  {
    key: "2",
    name: "Jim Green",
    avatar: {
      type: "human",
      seed: "dd4d5b32-b231-47bc-8522-b359282f9f7e",
    },
  },
  {
    key: "3",
    name: "Joe Black",
    avatar: {
      type: "human",
      seed: "2b74034d-97c3-41d0-8941-e103455482a3",
    },
  },
];

interface Props {}

export const PlayersTable = (props: Props) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      showHeader={false}
    />
  );
};
