import logo from './../../assets/images/logo/logo.svg'
import logoSm from './../../assets/images/logo/logo-sm.svg'
import { Link, NavLink } from 'react-router-dom'
import { Home, PackageIcon, Gift, User, LogOut } from '@styled-icons/feather'

export default function SidebarLayout() {
    return (
        <nav className="pc-sidebar ">
            <div className="navbar-wrapper">
                <div className="m-header">
                    <Link to={"/panel/dashboard"} className="b-brand">
                        <img src={logo} alt="" className="logo logo-lg" />
                        <img src={logoSm} alt="" className="logo logo-sm" />
                    </Link>
                </div>
                <div className="navbar-content">
                    <ul className="pc-navbar">
                        <li className="pc-item pc-caption">
                            <label>Navigation</label>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/dashboard"} className="pc-link ">
                                <span className="pc-micon">
                                    <Home />
                                </span>
                                <span className="pc-mtext">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/common-product"} className="pc-link">
                                <span className="pc-micon">
                                    <PackageIcon />
                                </span>
                                <span className="pc-mtext">Produk</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/special-product"} className="pc-link ">
                                <span className="pc-micon">
                                    <Gift />
                                </span>
                                <span className="pc-mtext">Produk Spesial</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/profile"} className="pc-link ">
                                <span className="pc-micon">
                                    <User />
                                </span>
                                <span className="pc-mtext">Profil</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/login"} className="pc-link ">
                                <span className="pc-micon">
                                    <LogOut />
                                </span>
                                <span className="pc-mtext">Logout</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav >
    )
}

const styles = {
    aHref: {
        backgroundColor: 'red'
    }
}