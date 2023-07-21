import axios from "axios";
import { useNavigate } from "react-router-dom";
import APP_CONFIG from "../../utils/APP_CONFIG";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Mail, Key } from '@styled-icons/entypo'
import TokenUtil from "../../utils/TokenUtil";

export default function LoginPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [settings, setSettings] = useState({})
    const [checkLogin, setCheckLogin] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        doCheckLogin()
        loadSettings()
    }, [])

    const doCheckLogin = () => {
        const token = TokenUtil.getApiToken()

        if (!token) {
            setCheckLogin(true)
        } else {
            axios.get(APP_CONFIG.API_URL + 'auth/user', {
                headers: {
                    Authorization: 'Bearer ' + TokenUtil.getApiToken()
                }
            }).then((res) => {
                navigate('/panel/dashboard')
            }).catch((err) => {
                setCheckLogin(true)
            })
        }
    }

    const loadSettings = () => {
        axios.get(APP_CONFIG.API_URL + 'settings', {})
            .then((res) => {
                setSettings(res.data.data.settings)
            }).catch((err) => {
                console.log(err)
            })
    }

    const doLogin = () => {
        axios.post(APP_CONFIG.API_URL + 'auth/login', {
            email: email,
            password: password
        }).then((res) => {
            toast(`${res.data.msg}`, {
                type: 'success',
            });
            localStorage.setItem('api_token', res.data.data.token)
            navigate('/panel/dashboard')
        }).catch((err) => {
            if (err.response.status == 422) {
                toast(`${err.response.data.msg} ${err.response.data.error ? ', ' + err.response.data.error : ''}`, {
                    type: 'error',
                });
            }
        })
    }

    return (
        <div>
            {
                checkLogin ?
                    <div className="auth-wrapper">
                        <ToastContainer />

                        <div className="auth-content">
                            <div className="card">
                                <div className="row align-items-center text-center">
                                    <div className="col-md-12">
                                        <div className="card-body">
                                            <img src={settings.office_logo} style={{ width: 100 }} className="img-fluid mb-2" />
                                            <h4 className="mb-3 f-w-400">{settings.office_name}</h4>
                                            <div className="input-group mb-3 mt-1">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><Mail /></span>
                                                </div>
                                                <input type="email" className="form-control" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
                                            </div>
                                            <div className="input-group mb-4">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><Key /></span>
                                                </div>
                                                <input type="password" className="form-control" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                                            </div>
                                            <button onClick={() => {
                                                doLogin()
                                            }} className="btn btn-block btn-primary mb-4">Signin</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <></>
            }
        </div>

    )

}