import moment from 'moment';
import 'moment-timezone';

export function validate(value: {
  name?: string;
  email?: string;
  password?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
}) {
  const msg = {
    name: "",
    email: "",
    password: "",
    bio: "",
    phone: "",
    avatar: "",
  };
  const regex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
  // const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
  const oneUppercaseRegex = /^(?=.*[A-Z]).+$/;
  const oneUpperLowerCaseRegex = /^(?=.*[A-Z])(?=.*[a-z]).+$/;
  if (!value.name) {
    msg.name = "The name is required";
  }
  if (!value.email) {
    msg.email = "The email is required";
  } else if (!regex.test(value.email)) {
    msg.email = "The email is invalid";
  }
  if (!value.password) {
    msg.password = "The password is required";
  } else if (value.password.length < 6) {
    msg.password = "The password must have least 6 character";
  } else if (!oneUppercaseRegex.test(value.password)) {
    msg.password = "The password should contain at least one uppercase letter";
  } else if (!oneUpperLowerCaseRegex.test(value.password)) {
    msg.password =
      "The password should contain at least one uppercase letter, one lowercase letter";
  }
  return msg;
}

export function formatDate(dateString:string) {
  const date = moment(dateString).tz('Asia/Ho_Chi_Minh');
  const now = moment();

  const timeDiff = now.diff(date, 'minutes');

  if (timeDiff < 60) {
    return `${timeDiff} minutes ago`;
  } else if (timeDiff < 24 * 60) {
    const hoursDiff = Math.floor(timeDiff / 60);
    const minutesRemainder = timeDiff % 60;
    return `today at ${hoursDiff}:${minutesRemainder.toString().padStart(2, '0')} ${date.format('A')}`;
  } else if (timeDiff < 48 * 60) {
    return `yesterday at ${date.format('h:mm A')}`;
  } else {
    return date.format('YYYY-MM-DD [at] h:mm A');
  }
}