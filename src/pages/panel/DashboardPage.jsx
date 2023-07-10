import { useEffect, useState } from "react"
import ResponseHandler from "../../utils/ResponseHandler"
import APP_CONFIG from "../../utils/APP_CONFIG"
import TokenUtil from "../../utils/TokenUtil"
import axios from "axios"

export default function DashboardPage() {

    const [user, setUser] = useState({})

    useEffect(() => {
        loadUser()
    }, [])

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