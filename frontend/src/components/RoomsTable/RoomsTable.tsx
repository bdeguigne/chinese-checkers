import { Table, Button, Tooltip } from "antd";
import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addPlayer, getAllRooms } from "../../redux/room/room-thunks";
import "./styles/rooms-table.css";
import { ReloadOutlined } from "@ant-design/icons";
import { RouteChildrenProps } from "react-router-dom";
import { Routes } from "../../App";

export const RoomsTable: FC<RouteChildrenProps> = (props) => {
  const dispatch = useAppDispatch();
  const [roomsData, setRoomsData] = useState<Room[]>([]);
  const rooms = useAppSelector((state) => state.room.rooms);
  const player = useAppSelector((state) => state.player.player);

  useEffect(() => {
    dispatch(getAllRooms());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const results = rooms.map((room) => ({
      key: room._id,
      ...room,
    }));
    setRoomsData(results);
  }, [rooms]);

  const onRefreshClicked = () => dispatch(getAllRooms());

  const columns = [
    {
      title: "Created by",
      dataIndex: "creatorName",
      key: "name",
    },
    {
      title: "players",
      dataIndex: "playersCount",
      key: "players",
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: any) => <Button>Join this room</Button>,
    },
  ];

  return (
    <>
      <div className="rooms-table__container">
        <div className="home-page-top__container">
          <h2>Join a room</h2>
        </div>
        <div className="rooms-table__table-container">
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  dispatch(addPlayer(record._id, player._id, props.history));
                  props.history.push(Routes.room + "/" + record._id);
                }, // click row
                onDoubleClick: (event) => {}, // double click row
                onContextMenu: (event) => {}, // right button click row
                onMouseEnter: (event) => {}, // mouse enter row
                onMouseLeave: (event) => {}, // mouse leave row
              };
            }}
            scroll={{ y: 260 }}
            columns={columns}
            dataSource={roomsData}
            pagination={false}
            tableLayout="auto"
          />
          <Tooltip
            title="Refresh rooms list"
            className="rooms-table__refresh-button"
          >
            <Button
              type="ghost"
              shape="circle"
              icon={<ReloadOutlined />}
              onClick={onRefreshClicked}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
};
