import { useEffect, useState } from "react"
import ResponseHandler from "../../utils/ResponseHandler"
import APP_CONFIG from "../../utils/APP_CONFIG"
import TokenUtil from "../../utils/TokenUtil"
import axios from "axios"

export default function DashboardPage() {

    const [user, setUser] = useState({})
    const [dashboardRecap, setDashboardRecap] = useState({})

    useEffect(() => {
        loadUser()
        loadDashboardRecap()
    }, [])

    const loadDashboardRecap = () => {
        axios.get(APP_CONFIG.API_URL + 'auth/dashboard', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setDashboardRecap(res.data.data)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }



    const loadUser = () => {
        axios.get(APP_CONFIG.API_URL + 'auth/user', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setUser(res.data.data.user)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    return (
        <div>
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Dashboard</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">Dashboard</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <h3 className='mb-3'>Dashboard</h3>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-4">
                    <div className="card prod-p-card background-pattern">
                        <div className="card-body">
                            <div className="row align-items-center m-b-0">
                                <div className="col">
                                    <h6 className="m-b-5">Jumlah Karyawan</h6>
                                    <h3 className="m-b-0">{dashboardRecap.amount_employees}</h3>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-users text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card prod-p-card bg-primary background-pattern-white">
                        <div className="card-body">
                            <div className="row align-items-center m-b-0">
                                <div className="col">
                                    <h6 className="m-b-5 text-white">Jumlah Cabang</h6>
                                    <h3 className="m-b-0 text-white">{dashboardRecap.amount_branches}</h3>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-building text-white"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card prod-p-card background-pattern">
                        <div className="card-body">
                            <div className="row align-items-center m-b-0">
                                <div className="col">
                                    <h6 className="m-b-5">Karyawan Absensi Hari Ini</h6>
                                    <h3 className="m-b-0">{dashboardRecap.amount_daily_attendances}</h3>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-calendar text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            <h1>Selamat Datang {user.name}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}