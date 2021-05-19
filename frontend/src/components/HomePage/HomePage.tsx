import { FC } from "react";
import "./styles/HomePage.css";
import EnterNameInput from "../EnterNameInput/EnterNameInput";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setName } from "../../redux/player/player-slice";

const HomePage: FC = () => {
  const dispatch = useAppDispatch();
  const playerName = useAppSelector((state) => state.player.name);

  return (
    <div className="home-page__container">
      <h1 className="home-page__title">Chinese Checkers</h1>

      <div className="home-page__input-container">
        <EnterNameInput createPlayer={(name) => dispatch(setName(name))} />
        <p>Welcome {playerName}</p>
      </div>
    </div>
  );
};

export default HomePage;
