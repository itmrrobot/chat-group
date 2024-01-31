import styles from "./SideBarChat.module.scss";
import classNames from "classnames/bind";
import plusIcon from "../../assets/imgs/plus-solid.svg";
import searchIcon from "../../assets/imgs/magnifying-glass-solid.svg";
import { Link, useNavigate } from "react-router-dom";
import userCircleIcon from "../../assets/imgs/circle-user-solid.svg";
import logoutIcon from "../../assets/imgs/right-from-bracket-solid.svg";
import dropdownIcon from "../../assets/imgs/caret-down-solid.svg";
import backIcon from "../../assets/imgs/back-icon.svg";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { useEffect, useState } from "react";
import ModalCreateChannel from "../ModalCreateChannel";
import * as io from "socket.io-client";
import { AuthState } from "../../context";
import { BASE_URL } from "../../constants";
import { IChannel } from "../../@types/channel";
import { ChannelState } from "../../context/channel";
import { IUser } from "../../@types/user";
import axios from "axios";

const cx = classNames.bind(styles);

function SideBarChat() {
  const { profile, setProfile } = AuthState();
  const navigate = useNavigate();
  const { channel, setChannel, setIsClickChannel, isClickChannel } =
    ChannelState();
    const handleLogout = async() => {
      try {
        await axios.post(BASE_URL+'/api/auth/logout',"",{
          headers: {
            Authorization: `Bearer ${profile?.access_token}`
          }
        })
        setProfile(null);
        localStorage.setItem("user","null");
        navigate('/');
      } catch(e) {
        console.log(e);
      }
  
    }
  const items: MenuProps["items"] = [
    {
      label: (
        <Link className={cx("btn-link")} to={"/account"}>
          {" "}
          <img src={userCircleIcon} className={cx("icon")} />{" "}
          <div className={cx("text")}>My Profile</div>
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <div className={cx("btn-logout")} onClick={handleLogout}>
          <img src={logoutIcon} className={cx("icon")} />
          <div className={cx("text")}>Logout</div>
        </div>
      ),
      key: "1",
    },
  ];
  console.log(channel);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const handleOpenModal = () => {
    setIsModalCreateOpen(true);
  };
  const getFirstLetter = (value: string) => {
    const words = value.split(" ");
    const firstCharacters = words.map((word) => word.charAt(0));
    const result = firstCharacters.join("");
    return result;
  };
  const handleBack = () => {
    setIsClickChannel(false);
  }
  useEffect(() => {
    const socket = io.connect(`${BASE_URL}`, {
      extraHeaders: { Authorization: `${profile?.access_token}` },
    });
    socket.on("channels", (data) => {
      setChannels(data);
    });
    return () => {
      socket.disconnect();
    };
  }, [profile?.access_token]);
  return (
    <div className={cx("wrapper")}>
      {isClickChannel === false ? (
        <>
          <div className={cx("wrap")}>
            <div className={cx("name")}>Channels</div>
            <button className={cx("btn-create")} onClick={handleOpenModal}>
              <img src={plusIcon} alt="plusIcon" className={cx("icon")} />
            </button>
          </div>
          <div className={cx("search")}>
            <img src={searchIcon} alt="searchIcon" className={cx("icon")} />
            <input
              type="text"
              className={cx("search-input")}
              placeholder="Search"
            />
          </div>
          <div className={cx("list-channels")}>
            {channels.map((c: IChannel, index) => {
              return (
                <div
                  className={cx("item")}
                  key={index}
                  onClick={() => {
                    setChannel(c);
                    setIsClickChannel(true);
                  }}
                >
                  <div className={cx("channel-sign")}>
                    {getFirstLetter(c?.name)}
                  </div>
                  <div className={cx("channel-name")}>{c?.name}</div>
                </div>
              );
            })}
            <div className={cx("item")}>
              <div className={cx("channel-sign")}>FD</div>
              <div className={cx("channel-name")}>Front-end developers</div>
            </div>
            <div className={cx("item")}>
              <div className={cx("channel-sign")}>FD</div>
              <div className={cx("channel-name")}>Front-end developers</div>
            </div>
            <div className={cx("item")}>
              <div className={cx("channel-sign")}>FD</div>
              <div className={cx("channel-name")}>Front-end developers</div>
            </div>
            <div className={cx("item")}>
              <div className={cx("channel-sign")}>FD</div>
              <div className={cx("channel-name")}>Front-end developers</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={cx("wrap", "left-jc")}>
            <img src={backIcon} alt="backIcon" className={cx("icon")} onClick={handleBack}/>
            <div className={cx("name")}>All Channels</div>
          </div>
          <h3 className={cx("channel-title")}>{channel?.name}</h3>
          <div className={cx("channel-desc")}>{channel?.desc}</div>
          <h3 className={cx("channel-title")}>Members</h3>
          <div className={cx("list-members")}>
            {channel &&
              channel?.connectedUsers
                .filter((obj) => Object.keys(obj).length !== 0)
                .map((obj: IUser) => {
                  const { _id, ...rest } = obj;
                  return { id: _id, ...rest };
                })
                .map((u, index) => {
                  return (
                    <div className={cx("item-members")} key={index}>
                      {u?.avatar !== null ? (
                        <img
                          src={u?.avatar}
                          alt=""
                          className={cx("avatar-member")}
                        />
                      ) : (
                        <Avatar
                          shape="square"
                          size={42}
                          icon={<UserOutlined />}
                        />
                      )}
                      <div className={cx("member-name")}>
                        {u?.name === null
                          ? `User_${u?.id?.toString()?.slice(0, 4)}`
                          : u?.name}
                      </div>
                    </div>
                  );
                })}
          </div>
        </>
      )}
      <div className={cx("wrap-account")}>
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          className={cx("drop-down")}
          placement="topRight"
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Space className={cx("account")}>
              <div className={cx("account-wrap")}>
                {profile?.avatar !== null ? (
                  <img src={profile?.avatar} alt="" className={cx("avatar")} />
                ) : (
                  <Avatar shape="square" size={42} icon={<UserOutlined />} />
                )}
                <div className={cx("account-name")}>
                  {profile?.name === null
                    ? `User_${profile?._id.slice(0, 4)}`
                    : profile?.name}
                </div>
              </div>
              <img
                src={dropdownIcon}
                alt="dropdownIcon"
                className="arrow-icon"
              />
            </Space>
          </a>
        </Dropdown>
      </div>
      <ModalCreateChannel
        isModalCreateOpen={isModalCreateOpen}
        setIsModalCreateOpen={setIsModalCreateOpen}
      />
    </div>
  );
}

export default SideBarChat;
