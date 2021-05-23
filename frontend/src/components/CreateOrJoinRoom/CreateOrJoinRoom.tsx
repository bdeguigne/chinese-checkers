import { Divider, Space } from "antd";
import EnterNameInput from "../EnterNameInput/EnterValueInput";
import { RoomsTable } from "./RoomsTable/RoomsTable";
import "./styles/CreateOrJoinRoom.css";

interface Props {}

export const CreateOrJoinRoom = (props: Props) => {
  // const dispatch = useAppDispatch();

  return (
    <div className="create-room__container">
      <Space size="large">
        <div className="create-room__element">
          <p>Create a room</p>
          <EnterNameInput
            customClassName="create-room__button "
            onButtonPressed={() => null}
            placeholder="Enter a name for this room"
            buttonLabel="Create a new room"
          />
        </div>
        <Divider type="vertical">OR</Divider>
        <div className="create-room__element">
          <p>Join a room</p>
        </div>
      </Space>
    </div>
  );
};
