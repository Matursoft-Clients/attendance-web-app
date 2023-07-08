import axios from "axios";
import { useNavigate } from "react-router-dom";
import APP_CONFIG from "../../utils/APP_CONFIG";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export default function LoginPage() {

    const [email, setEmail] = useState('admin@mail.com')
    const [password, setPassword] = useState('admin@456#')

    const navigate = useNavigate()

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
        <div className="auth-wrapper">
            <ToastContainer />

            <div className="auth-content">
                <div className="card">
                    <div className="row align-items-center text-center">
                        <div className="col-md-12">
                            <div className="card-body">
                                <img src="assets/images/logo-dark.svg" alt="" className="img-fluid mb-4" />
                                <h4 className="mb-3 f-w-400">Signin</h4>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i data-feather="mail"></i></span>
                                    </div>
                                    <input type="email" className="form-control" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
                                </div>
                                <div className="input-group mb-4">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i data-feather="lock"></i></span>
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
        </div>
    )

}