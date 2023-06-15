import { useNavigate } from "react-router-dom";

export default function LoginPage() {

    const navigate = useNavigate()

    return (
        <div className="auth-wrapper">
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
                                    <input type="email" className="form-control" placeholder="Email address" defaultValue={'example@mail.com'} />
                                </div>
                                <div className="input-group mb-4">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i data-feather="lock"></i></span>
                                    </div>
                                    <input type="password" className="form-control" placeholder="Password" defaultValue={'maturnuwun'} />
                                </div>
                                <button onClick={() => {
                                    navigate('/panel/dashboard');
                                }} className="btn btn-block btn-primary mb-4">Signin</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}