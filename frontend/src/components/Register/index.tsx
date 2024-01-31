import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import googleIcon from "../../assets/imgs/google.svg";
import facebookIcon from "../../assets/imgs/facebook.svg";
import twitterIcon from "../../assets/imgs/twitter.svg";
import githubIcon from "../../assets/imgs/github.svg";
import lockIcon from "../../assets/imgs/lock-solid.svg";
import emailIcon from "../../assets/imgs/envelope-solid.svg";
import logo from "../../assets/imgs/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { validate } from "../../utils";
import { ChangeEvent, FormEvent, useState } from "react";
import Helmet from "../HelmetTitle/Helmet";

const cx = classNames.bind(styles);

function Register() {
  const initialValue = { email: "", password: "" };
  //const { setProfile } = AuthState();
  const [formValue, setFormValue] = useState(initialValue);
  const [formError, setFormError] = useState(initialValue);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(validate(formValue));
    console.log(formValue);
    try {
      const res = await axios.post(BASE_URL + "/api/auth/register", formValue);
      //setProfile(res.data);
      console.log(res.data);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
    <Helmet children="Register"/>
    <div className={cx("wrap")}>
      <div className={cx("form-wrap")}>
        <img src={logo} alt="logo" className={cx("logo")} />
        <form className={cx("form")} onSubmit={handleRegister}>
          <h3 className={cx("title")}>
            Join thousands of learners from around the world{" "}
          </h3>
          <div className={cx("desc")}>
            Master web development by making real-life projects. There are
            multiple paths for you to choose
          </div>
          <div className={cx("form-group",{"border-danger":formError.email!==""&&formError.password!==""?true:false})}>
            <img src={emailIcon} alt="emailIcon" className={cx("icon")} />
            <input
              type="text"
              className={cx("form-input")}
              placeholder="Email"
              onChange={handleChange}
              name="email"
              value={formValue.email}
              autoComplete="off"
            />
          </div>
          {formError&&<p className={cx('danger')}>{formError.email}</p>}
          <div className={cx("form-group",{"border-danger":formError.email!==""&&formError.password!==""?true:false})}>
            <img src={lockIcon} alt="lockIcon" className={cx("icon")} />
            <input
              type="password"
              className={cx("form-input")}
              placeholder="Password"
              onChange={handleChange}
              value={formValue.password}
              name="password"
              autoComplete="off"
            />
          </div>
          {formError&&<p className={cx('danger')}>{formError.password}</p>}
          <button className={cx("btn-login")}>Start coding now </button>
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
            <Link to="/" className={cx("link")}>
              Login
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

export default Register;
