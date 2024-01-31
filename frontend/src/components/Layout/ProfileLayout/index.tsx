import { ReactElement } from "react";
import styles from "./ProfileLayout.module.scss";
import classNames from "classnames/bind";
import Header from "../../Header";

const cx = classNames.bind(styles);

function ProfileLayout({children}:{children:ReactElement}) {
    return (<div className={cx("container")}>
    <Header/>
    <div className={cx("body")}>
    {children}
    </div>
    </div>)
}

export default ProfileLayout;