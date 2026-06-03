import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

const MainContent = () => {
    return (
        <div className="relative  flex h-screen w-screen bg-black text-white overflow-hidden">

            <Sidebar />

            <Outlet />

        </div>
    );
};

export default MainContent;

