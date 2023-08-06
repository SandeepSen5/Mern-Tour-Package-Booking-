import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import Menu from "./Menu";
import "../../styles/global.scss"

export default function  AdminLayout() {
    return(
    <div className="main">
        <AdminHeader />
        <div className="container">
            <div className="menuContainer">
                <Menu />
            </div>
            <div className="contentContainer">
                <Outlet />
            </div>
        </div>
        <AdminFooter />
    </div>
    );
}



