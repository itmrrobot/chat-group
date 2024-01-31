import ChangeInfo from "../components/ChangeInfo";
import Chat from "../components/Chat";
import Login from "../components/Login";
import PersonalInfo from "../components/PersonalInfo";
import Register from "../components/Register";

export const publicRoutes = [
    {path:'/',component:Login},
    {path:'register',component:Register},
];

export const privateRoutes = [
    {path:'/account',component:PersonalInfo},
    {path:'/account/edit',component:ChangeInfo},
    {path:'/chat',component:Chat}
];