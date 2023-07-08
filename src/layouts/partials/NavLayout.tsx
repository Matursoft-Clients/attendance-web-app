import { Link, NavLink } from 'react-router-dom'
import avatar from './../../assets/images/samples/avatar.jpeg'

export default function NavLayout() {

    return (
        <header className="pc-header ">
            <div className="header-wrapper">
                <div className="ml-auto">
                    <ul className="list-unstyled">
                        <li className="dropdown pc-h-item">
                            <a className="pc-head-link dropdown-toggle arrow-none mr-0" data-toggle="dropdown" href="#"
                                role="button" aria-haspopup="false" aria-expanded="false">
                                <img src={avatar} alt="user-image" className="user-avtar" />
                                <span>
                                    <span className="user-name">MyFRA</span>
                                    <span className="user-desc">Administrator</span>
                                </span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right pc-h-dropdown">
                                <Link to={"/panel/profile"} className="dropdown-item">
                                    <i data-feather="user"></i>
                                    <span>My Account</span>
                                </Link>
                                <NavLink to={"/panel/settings"} className="dropdown-item">
                                    <i data-feather="settings"></i>
                                    <span>Pengaturan</span>
                                </NavLink>
                                <a href="#!" className="dropdown-item">
                                    <i data-feather="power"></i>
                                    <span>Logout</span>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )

}