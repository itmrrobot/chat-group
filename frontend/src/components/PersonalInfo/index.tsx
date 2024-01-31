import styles from "./PersonalInfo.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { AuthState } from "../../context";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

const cx = classNames.bind(styles);

function PersonalInfo() {
  const { profile, isShowMess } = AuthState();
  const showNotification = () => {
    toast.success('Login success!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });
  };

  // Trigger the notification automatically
  useEffect(() => {
    if(isShowMess) {
      showNotification();
    }
  }, [isShowMess]);

  console.log(profile);
  return (
    <>
    <ToastContainer />
        <div className={cx("wrapper")}>
          <h3 className={cx("title")}>Personal info</h3>
          <div className={cx("text")}>Basic info, like your name and photo</div>
          <div className={cx("table")}>
            <div className={cx("row", "jc-space-between")}>
              <div className={cx("wrap")}>
                <div className={cx("sub-title")}>Profile</div>
                <div className={cx("sub-text")}>
                  Some info may be visible to other people
                </div>
              </div>
              <Link className={cx("btn-edit")} to={"/account/edit"}>
                Edit
              </Link>
            </div>
            <div className={cx("row")}>
              <div className={cx("name")}>PHOTO</div>
              <div className={cx("info")}>
              {profile?.avatar !== null ? (
                  <img src={profile?.avatar} alt="" className={cx("avatar")} />
                ) : (
                  <Avatar shape="square" size={72} icon={<UserOutlined />} />
                )}
              </div>
            </div>
            <div className={cx("row")}>
              <div className={cx("name", "mg-28")}>NAME</div>
              <div className={cx("info")}>
                {profile?.name === null
                  ? `User_${profile?._id.slice(0, 4)}`
                  : profile?.name}
              </div>
            </div>
            <div className={cx("row")}>
              <div className={cx("name", "mg-28")}>BIO</div>
              <div className={cx("info")}>
                {profile?.bio === null ? "None" : profile?.bio}
              </div>
            </div>
            <div className={cx("row")}>
              <div className={cx("name", "mg-28")}>PHONE</div>
              <div className={cx("info")}>
                {profile?.phone === null ? "None" : profile?.phone}
              </div>
            </div>
            <div className={cx("row")}>
              <div className={cx("name", "mg-28")}>EMAIL</div>
              <div className={cx("info")}>{profile?.email}</div>
            </div>
            <div className={cx("row", "bd-b")}>
              <div className={cx("name", "mg-28")}>PASSWORD</div>
              <div className={cx("info")}>************</div>
            </div>
          </div>
          <div className={cx("df")}>
            <p className={cx("author")}>created by username</p>
            <p className={cx("name")}>devChallenges.io</p>
          </div>
        </div>
    </>
  );
}

export default PersonalInfo;
