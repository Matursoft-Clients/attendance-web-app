import { Outlet } from "react-router-dom";
import HeaderLayout from "./partials/HeaderLayout";
import LoaderLayout from "./partials/LoaderLayout";
import NavLayout from "./partials/NavLayout";
import SidebarLayout from "./partials/SidebarLayout";
import './../assets/css/global.css'

export default function AppLayout() {
    return (

        <div>
            <LoaderLayout />
            <HeaderLayout />
            <SidebarLayout />
            <NavLayout />

            <div className="pc-container">
                <div className="pcoded-content" style={{ paddingBottom: '15rem' }}>
                    <Outlet />
                </div>
            </div>
        </div>

    )
}