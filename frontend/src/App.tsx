import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./components/Layout/DefaultLayout";
import { privateRoutes, publicRoutes } from "./routes";
import ProfileLayout from "./components/Layout/ProfileLayout";
import ChatLayout from "./components/Layout/ChatLayout";
import { AuthState } from "./context";

function App() {
  const {profile} = AuthState();
  return (
    <Router>
      <div className="App">
        <Routes>
        {!profile?publicRoutes.map((route,index) => {
            const Layout = DefaultLayout;
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Layout>
              <Page/>
            </Layout>}/>
          }):<Route path="*" element={<Navigate to='/account' replace />} />}
          {/* {profile?privateRoutes.map((route,index) => {
            const Layout =route.path!=="/chat"?ProfileLayout:ChatLayout;
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Layout>
              <Page/>
            </Layout>}/>
          }):<Route path="*" element={<Navigate to='/' replace />} />} */}
          {privateRoutes.map((route,index) => {
            const Layout =route.path!=="/chat"?ProfileLayout:ChatLayout;
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Layout>
              <Page/>
            </Layout>}/>
          })}
        </Routes>
      </div>
    </Router>
  )
}

export default App
