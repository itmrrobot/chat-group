import { Link } from "react-router-dom";
import styles from "./ChangeInfo.module.scss";
import classNames from "classnames/bind";
import arrowIcon from "../../assets/imgs/angle-left-solid.svg";
import { AuthState } from "../../context";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Bounce, ToastContainer, toast } from "react-toastify";

const cx = classNames.bind(styles);

function ChangeInfo() {
  const { profile, setProfile, setIsAuthen, setIsShowMess } = AuthState();
  const initialValue = {
    email: "",
    password: "",
    name: "",
    bio: "",
    phone: "",
    avatar: "",
  };
  const [formValue, setFormValue] = useState(initialValue);
  const [formError] = useState(initialValue);
  const [imageSrc, setImageSrc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [, setUrl] = useState("");
  const [isShowMessSuccess, setIsShowMessSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };
  const saveImage = async () => {
    const data = new FormData();
    data.append("file", image as File);
    data.append("upload_preset", "tpmzgyak");
    data.append("cloud_name", "dya4as3kz");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dzznxekfg/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const cloudData = await res.json();
      setUrl(cloudData.url);
      if (cloudData.url) {
        //success()
      }
      return cloudData.url;
    } catch (error) {
      console.log(error);
    }
  };
  const showNotification = () => {
    if (isShowMessSuccess) {
      toast.success("Update success!", {
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
    } else {
      toast.error("Update failed!", {
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
    }
  };
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    //setFormError(validate(formValue));
    console.log(formValue);
    try {
      const res = await axios.put(BASE_URL + "/api/user/update", formValue, {
        headers: {
          Authorization: `Bearer ${profile?.access_token}`,
        },
      });
      const access_token = profile?.access_token;
      const avatar = await saveImage();
      console.log(res);
      setProfile({ ...res.data, avatar, access_token });
      setIsAuthen(true);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...res.data, avatar, access_token })
      );
      setIsShowMessSuccess(true);
      showNotification();
    } catch (e) {
      setIsShowMessSuccess(false);
      showNotification();
      console.log(e);
    }
  };
  console.log(imageSrc);
  return (
    <>
      <ToastContainer />
      <div className={cx("wrapper")}>
        <Link
          className={cx("btn-back")}
          to={"/account"}
          onClick={() => setIsShowMess(false)}
        >
          <img src={arrowIcon} alt="arrowIcon" className="arrow-icon" />
          <div>Back</div>
        </Link>
        <div className={cx("table")}>
          <div className={cx("row")}>
            <div className={cx("wrap")}>
              <div className={cx("sub-title")}>Change Info</div>
              <div className={cx("sub-text")}>
                Changes will be reflected to every services
              </div>
            </div>
          </div>
          <div className={cx("row", "g-28")}>
            {!imageSrc ? (
              profile?.avatar !== null ? (
                <img
                  src={profile?.avatar}
                  alt=""
                  className={cx("account-img")}
                />
              ) : (
                <Avatar shape="square" size={36} icon={<UserOutlined />} />
              )
            ) : (
              <img
                src={imageSrc}
                alt="account-img"
                className={cx("account-img")}
              />
            )}
            <label htmlFor="upload" className={cx("text-change")}>
              CHANGE PHOTO
            </label>
            <input
              type="file"
              name="myfile"
              id="upload"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </div>
          <div className={cx("row")}>
            <form onSubmit={handleEdit} className={cx("form")}>
              <div className={cx("form-group")}>
                <label htmlFor="" className={cx("form-label")}>
                  Email
                </label>
                <input
                  type="text"
                  value={profile?.email}
                  disabled
                  className={cx("form-input")}
                  placeholder="Enter your name..."
                />
              </div>
              <div className={cx("form-group")}>
                <label htmlFor="" className={cx("form-label")}>
                  Name
                </label>
                <input
                  type="text"
                  className={cx("form-input")}
                  placeholder="Enter your name..."
                  onChange={handleChange}
                  name="name"
                />
              </div>
              <div className={cx("form-group")}>
                <label htmlFor="" className={cx("form-label")}>
                  Bio
                </label>
                <textarea
                  className={cx("form-input", "h-92")}
                  placeholder="Enter your bio..."
                  onChange={handleChange}
                  name="bio"
                ></textarea>
              </div>
              <div className={cx("form-group")}>
                <label htmlFor="" className={cx("form-label")}>
                  Phone
                </label>
                <input
                  type="text"
                  className={cx("form-input")}
                  placeholder="Enter your phone..."
                  onChange={handleChange}
                  name="phone"
                />
              </div>
              <div className={cx("form-group")}>
                <label htmlFor="" className={cx("form-label")}>
                  Password
                </label>
                <input
                  type="password"
                  className={cx("form-input")}
                  placeholder="Enter your new password..."
                  onChange={handleChange}
                  name="password"
                />
                {formError && (
                  <p className={cx("danger")}>{formError.password}</p>
                )}
              </div>
              <div>
                <button className={cx("btn-save")}>Save</button>
              </div>
            </form>
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

export default ChangeInfo;
