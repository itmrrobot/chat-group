import styles from "./Chat.module.scss";
import classNames from "classnames/bind";
import { UserOutlined } from '@ant-design/icons';
import sendIcon from "../../assets/imgs/paper-plane-top.svg";
import * as io from "socket.io-client";
import { useEffect, useState } from "react";
import { AuthState } from "../../context";
import { ChannelState } from "../../context/channel";
import { BASE_URL } from "../../constants";
import { IMessage } from "../../@types/message";
import { formatDate } from "../../utils";
import { Avatar } from "antd";

const cx = classNames.bind(styles);

function Chat() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInput,setMessageInput] =useState("");
  const [newMessage,setNewMessage] = useState("");
  const {profile} = AuthState();
  const {channel} = ChannelState();
  
  useEffect(() => {
    const socket  = io.connect(`${BASE_URL}`,{extraHeaders:{Authorization: `${profile?.access_token}`}});
    socket.emit('joinRoom',channel);
    // Handle Socket.IO events
    socket.on('messages', (data) => {
      setMessages(data);
      if(messageInput==="") {
        setMessages(data);
      }
    });
    socket.on('messageAdded', (data) => {
      setNewMessage(data);
    });
    return () => {
      socket.disconnect();
    };
  }, [channel, profile?.access_token, messageInput,newMessage]);
  const handleSendMessage = () => {
    const socket  = io.connect(`${BASE_URL}`,{extraHeaders:{Authorization: `${profile?.access_token}`}});
    socket.emit('addMessage',{text: messageInput,user: profile,channel});
    setMessageInput("");
  }
  console.log(messages);
  return (
    <div className={cx("wrapper")}>
      <div className={cx("head")}>{channel?.name}</div>
      <div className={cx("list-chat")}>
        {messages.map((mess:IMessage,index) => {
          return (
            <div className={cx("item")} key={index}>
          {mess.user?.avatar !== null ?<img src={mess.user?.avatar} alt="" className={cx("avatar")} />
          :<Avatar shape="square" size={42} icon={<UserOutlined />} />}
          <div className={cx("item-wrap")}>
            <div className={cx("wrap")}>
              <div className={cx("name")}>{mess.user?.name === null
                  ? `User_${mess.user?._id.slice(0, 4)}`
                  : mess.user?.name}</div>
              <div className={cx("date")}>{formatDate(mess.createdAt)}</div>
            </div>
            <div className={cx("message")}>{mess.text}</div>
          </div>
        </div>
          )
        })}
      </div>
      <div className={cx("input-message")}>
        <input type="text" className={cx("input")} placeholder="Type a message here" name="message" onChange={(e) => setMessageInput(e.target.value)} value={messageInput}/>
        <button className={cx("btn-send")} onClick={handleSendMessage}>
            <img src={sendIcon} alt="" className="icon-send" />
        </button>
      </div>
    </div>
  );
}

export default Chat;
