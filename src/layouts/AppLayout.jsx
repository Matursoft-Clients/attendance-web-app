import { Outlet, useNavigate } from "react-router-dom";
import HeaderLayout from "./partials/HeaderLayout";
import LoaderLayout from "./partials/LoaderLayout";
import NavLayout from "./partials/NavLayout";
import SidebarLayout from "./partials/SidebarLayout";
import './../assets/css/global.css'
import { useEffect, useState } from "react";
import ResponseHandler from "../utils/ResponseHandler";
import APP_CONFIG from "../utils/APP_CONFIG";
import axios from "axios";
import TokenUtil from "../utils/TokenUtil";

export default function AppLayout() {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [user, setUser] = useState({})
    const [settings, setSettings] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        loadSettings()
        loadUser()
    }, [])

    const loadUser = () => {
        axios.get(APP_CONFIG.API_URL + 'auth/user', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setUser(res.data.data.user)
            setIsLoggedIn(true)
        }).catch((err) => {
            navigate('/login')
            ResponseHandler.errorHandler(err)
        })
    }

    const loadSettings = () => {
        axios.get(APP_CONFIG.API_URL + 'settings', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setSettings(res.data.data.settings)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    return (

        <div>
            {
                isLoggedIn ?
                    <>
                        <LoaderLayout />
                        <HeaderLayout />
                        <SidebarLayout settings={settings} />
                        <NavLayout user={user} />

                        <div className="pc-container">
                            <div className="pcoded-content" style={{ paddingBottom: '15rem' }}>
                                {
                                    Object.keys(user).length > 0 && Object.keys(settings).length > 0 ?
                                        <Outlet reRenderUser={loadUser} reRenderSettings={loadSettings} />
                                        : <></>
                                }
                            </div>
                        </div>
                    </> : <></>
            }
        </div>

    )
}