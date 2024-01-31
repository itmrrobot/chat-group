import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import logo from "../../assets/imgs/logo.svg";
import dropdownIcon from "../../assets/imgs/caret-down-solid.svg";
import usersIcon from "../../assets/imgs/users-solid.svg";
import userCircleIcon from "../../assets/imgs/circle-user-solid.svg";
import logoutIcon from "../../assets/imgs/right-from-bracket-solid.svg";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthState } from "../../context";
import axios from "axios";
import { BASE_URL } from "../../constants";

const cx = classNames.bind(styles);

function Header() {
  const {profile,setProfile} = AuthState();
  const navigate = useNavigate();
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
      label: <Link className={cx("btn-link")} to={"/account"}> <img src={userCircleIcon} className={cx("icon")}/> <div className={cx("text")}>My Profile</div></Link>,
      key: "0",
    },
    {
      label: <Link className={cx("btn-link")} to={"/chat"}><img src={usersIcon} className={cx("icon")}/><div className={cx("text")}>Group chat</div></Link>,
      key: "1",
    },
    {
        label: <div className={cx("btn-logout")} onClick={handleLogout}><img src={logoutIcon} className={cx("icon")}/><div className={cx("text")}>Logout</div></div>,
        key: "2",
      },
  ];
  return (
    <div className={cx("wrapper")}>
      <img src={logo} alt="logo" className={cx("logo")} />
      <div className={cx("wrap")}>
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          className="more-icon"
          placement="bottomRight"
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Space>
            {profile?.avatar !== null ? (
                  <img src={profile?.avatar} alt="" className={cx("avatar")} />
                ) : (
                  <Avatar shape="square" size={36} icon={<UserOutlined />} />
                )}
              <div className={cx("account-name")}>{profile?.name===null?`User_${profile?._id.slice(0,4)}`:profile?.name}</div>
              <img
                src={dropdownIcon}
                alt="dropdownIcon"
                className="arrow-icon"
              />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
