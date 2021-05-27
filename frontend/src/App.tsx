import { FC, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.less";
import { RoomsTable } from "./components/RoomsTable/RoomsTable";
import { Lobby } from "./components/Lobby/Lobby";
import HomePage from "./components/HomePage/HomePage";
import { SocketContext, socket } from "./context/socket";
import { EngineContext, engine } from "./context/engine-hook";
import { GameLayout } from "./components/GameLayout/GameLayout";
import { useAppDispatch } from "./redux/hooks";
import { getPlayer } from "./redux/player/player-thunks";

export enum Routes {
  rooms = "/rooms",
  room = "/room",
  game = "/game",
  home = "/",
}

const App: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    if (playerId) {
      dispatch(getPlayer(playerId));
      console.log("PLAYER ID IN STORAGE", playerId);
    }
  }, [dispatch]);

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
