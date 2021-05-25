import { FC } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.less";
import { RoomsTable } from "./components/RoomsTable/RoomsTable";
import { Lobby } from "./components/Lobby/Lobby";
import HomePage from "./components/HomePage/HomePage";
import { SocketContext, socket } from "./context/socket";
import { EngineContext, engine } from "./context/engine-hook";
import { GameLayout } from "./components/GameLayout/GameLayout";

export enum Routes {
  rooms = "/rooms",
  room = "/room",
  game = "/game",
  home = "/",
}

const App: FC = () => {
  return (
    <SocketContext.Provider value={socket}>
      <EngineContext.Provider value={engine}>
        <Router>
          <Switch>
            <Route path={Routes.rooms} component={RoomsTable} />
            <Route path={Routes.room + "/:id"} component={Lobby}></Route>
            <Route path={Routes.game + "/:id"} component={GameLayout} />
            <Route path={Routes.home} component={HomePage} />
          </Switch>
        </Router>
      </EngineContext.Provider>
    </SocketContext.Provider>
  );
};

export default App;
