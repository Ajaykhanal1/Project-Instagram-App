import { Routes, Route } from "react-router-dom";
import MainContent from "./main_content";
import Home from "./Home/Home";
import Reels from "./Reels/Reels";
import Explore from "./Explore/Explore";
import Messages from "./Messages/Messages";
import Profile from "./Profile/Profile";
import Login from "./Login_Register_Forgot_Page/Login";
import Register from "./Login_Register_Forgot_Page/Register";
import Forgot_Password from "./Login_Register_Forgot_Page/Forgot_Password";
import ResetPassword from "./Login_Register_Forgot_Page/Reset_Password";
import ProtectedRoute from "./Protected_Route/Protected_Route";
import SearchProfile from"./Search/searchProfile";

export default function App() {
  return (

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot_Password />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />


      <Route element={<MainContent />}>
        <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:userId" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/searchProfile/:userId" element={<SearchProfile />} />
      </Route>

    </Routes>
  );
}



