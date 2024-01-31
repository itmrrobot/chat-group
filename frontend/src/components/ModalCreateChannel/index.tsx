import { Modal, Typography } from "antd";
import styles from "./ModalCreateChannel.module.scss";
import classNames from "classnames/bind";
import searchIcon from "../../assets/imgs/magnifying-glass-solid.svg";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { AuthState } from "../../context";
import { ChangeEvent, useState } from "react";
import { IUser } from "../../@types/user";
import closeIcon from "../../assets/imgs/xmark-solid.svg";
import * as io from "socket.io-client";

const cx = classNames.bind(styles);

interface Props {
  isModalCreateOpen: boolean;
  setIsModalCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModalCreateChannel(props: Props) {
  const { isModalCreateOpen, setIsModalCreateOpen } = props;
  const { profile } = AuthState();
  const [searchValue, setSearchValue] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userString = localStorage.getItem("user");
  const parsedUser = userString ? JSON.parse(userString) : null;
  const [chooseUsers, setChooseUsers] = useState<IUser[]>([]);
  const [inputName,setInputName] = useState('');
  const [inputDescription,setInputDescription] = useState('');
  const socket  = io.connect(`${BASE_URL}`,{extraHeaders:{Authorization: `${profile?.access_token}`}});
  const handleCancel = () => {
    setIsModalCreateOpen(false);
  };
  // document.addEventListener("click",function() {
  //   setIsDropdownOpen(false);
  // })
  const handleDeleteOk = () => {};
  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const res = await axios.get(
        BASE_URL + `/api/user/find-by-username?username=${e.target.value}`,
        {
          headers: {
            Authorization: `Bearer ${profile?.access_token}`,
          },
        }
      );
      setSearchValue(res.data);
      setIsDropdownOpen(true);
      const newData = res.data?.filter((d: IUser) =>
        d?.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      console.log(e.target.value.toLowerCase());
      if (newData?.length === 0) {
        setIsDropdownOpen(false);
      }
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  const removeDuplicates = (array: IUser[]) => {
    const seen = new Set();
    const uniqueArray = array.filter(obj => {
        const key = JSON.stringify(obj);
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
      return uniqueArray;
  }
  const listChooseUsers = removeDuplicates(chooseUsers);
  const handleChoose = (item: IUser) => {
    if(chooseUsers.length===0) {
      delete parsedUser?.access_token;  
      delete parsedUser?.password;
      chooseUsers.push(parsedUser);
    }
    chooseUsers.push(item);
    setChooseUsers(removeDuplicates(chooseUsers));
    console.log(chooseUsers);
  };
  const handleDeleteChoose = (i:number) => {
    listChooseUsers.splice(i,1);
    setChooseUsers(listChooseUsers);
    console.log(listChooseUsers)
  }
  const updatedArray = listChooseUsers.map((obj) => {
    const { _id , ...rest} = obj;
    return { id: _id, ...rest};
  });
  console.log(updatedArray)
  const handleCreateChannel = () => {
    socket.emit('createRoom',{ name: inputName, desc: inputDescription,connectedUsers:updatedArray});
    console.log(inputName,inputDescription);
    setIsModalCreateOpen(false);
    setInputDescription('');
    setInputName('');
    setIsDropdownOpen(false);
  }
  return (
    <>
      <Modal
        closeIcon={false}
        onCancel={handleCancel}
        okText="Delete"
        open={isModalCreateOpen}
        footer={null}
        width={594}
        onOk={handleDeleteOk}
        className={cx("modal-create")}
      >
        <Typography.Text className={cx("model-create-title mb-16")}>
          NEW CHANNEL
        </Typography.Text>
        <div className={cx("form")}>
          <input
            type="text"
            className={cx("form-input")}
            placeholder="Channel name"
            name="name"
            onChange={(e) => setInputName(e.target.value)}
            autoComplete="off"
            value={inputName}
          />
          <textarea
            name="desc"
            rows={4}
            placeholder="Channel description"
            className={cx("form-input", "rs")}
            onChange={(e) => setInputDescription(e.target.value)}
            autoComplete="off"
            value={inputDescription}
          ></textarea>
          <div className={cx("wrap-search", "form-input")}>
            <input
              type="text"
              placeholder="Add members"
              name="searchValue"
              className={cx("input-search")}
              onChange={handleSearch}
              autoComplete="off"
            />
            <img src={searchIcon} alt="searchIcon" className={cx("icon")} />
            {isDropdownOpen && (
              <div className={cx("dropdown")}>
                {searchValue?.map((item: IUser, index) => {
                  return (
                    <div
                      className={cx("item")}
                      key={index}
                      onClick={() => handleChoose(item)}
                    >
                      <div className={cx("sign")}>{item?.name?.charAt(0)}</div>{" "}
                      {item?.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {listChooseUsers.length!==0&&<div className={cx("list-choose")}>
            {listChooseUsers?.map((i,index) => {
              return <div className={cx("item-choose")} key={index}>{i?.name}<img src={closeIcon} alt="close-icon" className={cx("close-icon")} onClick={() => handleDeleteChoose(index)}/></div>;
            })}
          </div>}
          <div className={cx("wrap-btn")}>
            <button className={cx("btn-save")} onClick={handleCreateChannel}>Save</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalCreateChannel;
