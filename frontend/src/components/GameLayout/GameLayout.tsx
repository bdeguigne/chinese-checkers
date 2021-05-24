import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import { PlayersTable } from "./PlayersTable/PlayersTable";
import "./styles/GameLayout.css";
type TParams = { id: string };

export const GameLayout: FC<RouteComponentProps<TParams>> = (props) => {
  return (
    <Layout className="game-layout__layout">
      {/* <Header className="game-layout--box-shadow">Header</Header> */}
      <Layout className="game-layout__content-layout">
        <Content>Content</Content>
        <Sider
          width={250}
          className="game--layout__sider game-layout--box-shadow"
        >
          <PlayersTable />
        </Sider>
      </Layout>
    </Layout>
  );
};
