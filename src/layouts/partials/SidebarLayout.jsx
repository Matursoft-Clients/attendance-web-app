import logo from './../../assets/images/logo/logo.svg'
import logoSm from './../../assets/images/logo/logo-sm.svg'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, PackageIcon, Gift, User, LogOut, Send, Sidebar, Map, Tv, Briefcase, Users, Calendar, Airplay } from '@styled-icons/feather'
import { useEffect, useState } from 'react'

export default function SidebarLayout(props) {

    const [settings, setSettings] = useState({})

    useEffect(() => {
        setSettings(props.settings)
    }, [])

    const navigate = useNavigate()

    return (
        <nav className="pc-sidebar ">
            <div className="navbar-wrapper">
                <div className="m-header">
                    <Link to={"/panel/dashboard"} className="b-brand">
                        <img src={settings.office_logo ? settings.office_logo : null} alt="logo" style={{ width: '45px' }} className="logo logo-lg" />
                        <h4 className='text-white'>{settings.office_name}</h4>
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
                            <NavLink to={"/panel/daily-attendances"} className="pc-link ">
                                <span className="pc-micon">
                                    <Calendar />
                                </span>
                                <span className="pc-mtext">Absen Harian</span>
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
                            <NavLink to={"/panel/announcements"} className="pc-link ">
                                <span className="pc-micon">
                                    <Send />
                                </span>
                                <span className="pc-mtext">Pengumuman</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/jobs"} className="pc-link ">
                                <span className="pc-micon">
                                    <Briefcase />
                                </span>
                                <span className="pc-mtext">Jabatan</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/banners"} className="pc-link ">
                                <span className="pc-micon">
                                    <Sidebar />
                                </span>
                                <span className="pc-mtext">Banner</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/custom-attendance-locations"} className="pc-link ">
                                <span className="pc-micon">
                                    <Map />
                                </span>
                                <span className="pc-mtext">Lokasi Absen Kustom</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/branchs"} className="pc-link ">
                                <span className="pc-micon">
                                    <Airplay />
                                </span>
                                <span className="pc-mtext">Cabang</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/employees"} className="pc-link ">
                                <span className="pc-micon">
                                    <Users />
                                </span>
                                <span className="pc-mtext">Karyawan</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <NavLink to={"/panel/settings"} className="pc-link ">
                                <span className="pc-micon">
                                    <Tv />
                                </span>
                                <span className="pc-mtext">Pengaturan</span>
                            </NavLink>
                        </li>
                        <li className="pc-item">
                            <span style={{ cursor: 'pointer' }} className="pc-link " onClick={() => {
                                localStorage.removeItem('api_token')
                                navigate('/login')
                            }}>
                                <span className="pc-micon">
                                    <LogOut />
                                </span>
                                <span className="pc-mtext">Logout</span>
                            </span>
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