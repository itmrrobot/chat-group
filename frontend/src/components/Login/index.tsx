import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import googleIcon from "../../assets/imgs/google.svg";
import facebookIcon from "../../assets/imgs/facebook.svg";
import twitterIcon from "../../assets/imgs/twitter.svg";
import githubIcon from "../../assets/imgs/github.svg";
import lockIcon from "../../assets/imgs/lock-solid.svg";
import emailIcon from "../../assets/imgs/envelope-solid.svg";
import logo from "../../assets/imgs/logo.svg";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants";
import { validate } from "../../utils";
import { AuthState } from "../../context";

const cx = classNames.bind(styles);

function Login() {
  const initialValue = { email: "", password: "" };
  const { setProfile, setIsAuthen,setIsShowMess } = AuthState();
  const [formValue, setFormValue] = useState(initialValue);
  const [formError, setFormError] = useState(initialValue);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(validate(formValue));
    try {
      const res = await axios.post(BASE_URL + "/api/auth/login", formValue);
      const access_token=res?.data?.access_token;
      console.log(res);
      setProfile({...res.data?.data,access_token});
      setIsAuthen(true);
      setIsShowMess(true)
      localStorage.setItem("user", JSON.stringify({...res.data?.data,access_token}));
      navigate("/account",{replace:true});
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div className={cx("wrap")}>
        <div className={cx("form-wrap")}>
          <img src={logo} alt="" className={cx("logo")} />
          <form className={cx("form")} onSubmit={handleLogin}>
            <h3 className={cx("title")}>Login</h3>
            <div
              className={cx("form-group", {
                "border-danger":
                  formError.email !== "" && formError.password !== ""
                    ? true
                    : false,
              })}
            >
              <img src={emailIcon} alt="emailIcon" className={cx("icon")} />
              <input
                type="text"
                className={cx("form-input")}
                placeholder="Email"
                onChange={handleChange}
                name="email"
                value={formValue.email}
              />
            </div>
            {formError && <p className={cx("danger")}>{formError.email}</p>}
            <div
              className={cx("form-group", {
                "border-danger":
                  formError.email !== "" && formError.password !== ""
                    ? true
                    : false,
              })}
            >
              <img src={lockIcon} alt="lockIcon" className={cx("icon")} />
              <input
                type="password"
                className={cx("form-input")}
                placeholder="Password"
                onChange={handleChange}
                value={formValue.password}
                name="password"
              />
            </div>
            {formError && <p className={cx("danger")}>{formError.password}</p>}
            <button className={cx("btn-login")}>Login</button>
          </form>
          <div className={cx("wrap-social")}>
            <p className={cx("text")}>or continue with these social profile</p>
            <div className={cx("group-btn")}>
              <div className={cx("item")}>
                <img
                  src={googleIcon}
                  alt="googleIcon"
                  className={cx("social-icon")}
                />
              </div>
              <div className={cx("item")}>
                <img
                  src={facebookIcon}
                  alt="facebookIcon"
                  className={cx("social-icon")}
                />
              </div>
              <div className={cx("item")}>
                <img
                  src={twitterIcon}
                  alt="twitterIcon"
                  className={cx("social-icon")}
                />
              </div>
              <div className={cx("item")}>
                <img
                  src={githubIcon}
                  alt="githubIcon"
                  className={cx("social-icon")}
                />
              </div>
            </div>
            <p className={cx("text")}>
              Don’t have an account yet?{" "}
              <Link to="/register" className={cx("link")}>
                Register
              </Link>
            </p>
          </div>
        </div>
        <div className={cx("wrapper")}>
          <p className={cx("author")}>created by username</p>
          <p className={cx("name")}>devChallenges.io</p>
        </div>
      </div>
    </>
  );
}

export default Login;
