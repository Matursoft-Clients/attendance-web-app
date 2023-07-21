import './../assets/landing/css/style.css'
import './../assets/landing/css/responsive.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import APP_CONFIG from '../utils/APP_CONFIG'

export default function HomePage() {

    const [settings, setSettings] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = () => {
        axios.get(APP_CONFIG.API_URL + 'settings', {})
            .then((res) => {
                setSettings(res.data.data.settings)
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <div>
            <header>
                <div className="head_top" style={{ minHeight: '100vh' }}>
                    <div className="header">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 col logo_section">
                                    <div className="full">
                                        <div className="center-desk">
                                            <div className="logo">
                                                <a href="#"><img src={settings.office_logo ? settings.office_logo : require('./../assets/images/samples/no-image.jpg')} style={{ width: 50 }} alt="#" /></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-9 col-lg-9 col-md-9 col-sm-9">
                                    <nav className="navigation navbar navbar-expand-md navbar-dark ">
                                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
                                            <span className="navbar-toggler-icon"></span>
                                        </button>
                                        <div className="collapse navbar-collapse" id="navbarsExample04">
                                            <ul className="navbar-nav mr-auto">
                                                <li className="nav-item">
                                                    <a onClick={() => {
                                                        navigate('/login')
                                                    }} className="nav-link" href="#" style={{ backgroundColor: '#FFF', textAlign: 'center', color: '#333', paddingTop: 10, paddingBlock: 10, borderRadius: 5 }}>Login</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <section className="banner_main" style={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
                        <div className="container">
                            <div className="row d_flex">
                                <div className=" col-xl-8 col-lg-8 col-md-8 col-12-9">
                                    <div className="text-bg">
                                        <h1 style={{ fontWeight: 800 }}>Absensi Pegawai Management System<br /> </h1>
                                        <p>Hadirkan kemudahan dalam mengelola kehadiran karyawan dengan Aplikasi Absensi. Nikmati fitur canggih yang memudahkan Anda dalam memantau kehadiran secara real-time, mengurangi kerumitan administrasi, dan mengoptimalkan efisiensi kerja. Dapatkan kontrol penuh atas kehadiran dengan Aplikasi Absensi kami. Segera coba sekarang dan rasakan perbedaannya!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </header>
        </div >
    )

}