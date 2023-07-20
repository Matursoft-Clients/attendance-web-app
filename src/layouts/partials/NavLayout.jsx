import { Link, NavLink, useNavigate } from 'react-router-dom'
import avatar from './../../assets/images/samples/no-photo.png'
import { useEffect, useState } from 'react'

export default function NavLayout(props) {

    const [user, setUser] = useState({})

    useEffect(() => {
        setUser(props.user)
    }, [props.user])

    const navigate = useNavigate()

    return (
        Object.keys(user).length > 0 ?
            <header className="pc-header ">
                <div className="header-wrapper">
                    <div className="ml-auto">
                        <ul className="list-unstyled">
                            <li className="dropdown pc-h-item">
                                <a className="pc-head-link dropdown-toggle arrow-none mr-0" data-toggle="dropdown" href="#"
                                    role="button" aria-haspopup="false" aria-expanded="false">
                                    <img src={user.photo ? user.photo : avatar} alt="user-image" className="user-avtar" />
                                    <span>
                                        <span className="user-name">{user.name}</span>
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
                                    <a href="#!" className="dropdown-item" onClick={() => {
                                        localStorage.removeItem('api_token')
                                        navigate('/login')
                                    }}>
                                        <i data-feather="power"></i>
                                        <span>Logout</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </header> : <></>
    )

}