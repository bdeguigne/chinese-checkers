import { FC } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.less";
import { RoomsTable } from "./components/CreateOrJoinRoom/RoomsTable/RoomsTable";
import { Lobby } from "./components/Lobby/Lobby";
import HomePage from "./components/HomePage/HomePage";

export enum Routes {
  rooms = "/rooms",
  room = "/room",
  home = "/",
}

const App: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path={Routes.rooms} component={RoomsTable} />
        <Route path={Routes.room + "/:id"} component={Lobby}></Route>
        <Route path={Routes.home} component={HomePage} />
      </Switch>
    </Router>
  );
};

export default App;
