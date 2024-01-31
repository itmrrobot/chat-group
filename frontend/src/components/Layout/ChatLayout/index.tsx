import { ReactElement } from "react";
import styles from "./ChatLayout.module.scss";
import classNames from "classnames/bind";
import SideBarChat from "../../SideBarChat";

const cx = classNames.bind(styles);

function ChatLayout({children}:{children:ReactElement}) {
    return (
        <div className={cx("container")}>
            <SideBarChat/>
            <div className={cx("wrap-chat")}>
                {children}
            </div>
        </div>
    )
}

export default ChatLayout;