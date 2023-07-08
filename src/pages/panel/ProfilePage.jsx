import { Save } from 'styled-icons/boxicons-solid'
import avatar from './../../assets/images/samples/avatar.jpeg'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import APP_CONFIG from '../../utils/APP_CONFIG'
import TokenUtil from '../../utils/TokenUtil'
import ResponseHandler from '../../utils/ResponseHandler'

export default function ProfilePage() {

    const [user, setUser] = useState()

    useEffect(() => {
        loadUser()
    }, [])

    const loadUser = () => {
        axios.get(APP_CONFIG.API_URL + 'announcements', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setUser(res.data.data.announcements)
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
                                <h5 className="m-b-10">Profil</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">Profil</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col-md-4">
                    <h3 className='mt-3 mb-3'>Profile</h3>

                    <div className="card user-card user-card-1">
                        <div className="card-body pb-0">
                            <div className="media user-about-block align-items-center mt-0 mb-3">
                                <div className="position-relative w-100 d-inline-block">
                                    <div className='d-flex flex-column align-items-center'>
                                        <img className="img-radius img-fluid wid-80" src={avatar} alt="User image" />
                                        <div className="media-body mt-3">
                                            <h6 className="mb-1">MyFRA</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <span className="f-w-500"><i className="feather icon-mail m-r-10"></i>Email</span>
                                <a href="mailto:demo@sample" className="float-right text-body">demo@sample.com</a>
                            </li>
                            <li className="list-group-item bg-dark d-flex">
                                <Link to={"/login"} className='w-100'>
                                    <span className="f-w-500 text-white"><i className="feather icon-log-out m-r-10"></i>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-8">
                    <h3 className='mt-3 mb-3'>Edit Profile</h3>
                    <div className="card">
                        <div className="card-body">
                            <form action="">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" name="username" id="username" className='form-control' placeholder='Username' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="text" name="email" id="email" className='form-control' placeholder='Email' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Avatar</label>
                                    <input type="file" name="avatar" id="avatar" className='form-control' placeholder='Avatar' />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Kata Sandi</label>
                                    <input type="password" name="password" id="password" className='form-control' placeholder='Kata Sandi' />

                                    <small>Biarkan kosong, jika tidak mengubah kata sandi</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password_confirmation">Konfirmasi Kata Sandi</label>
                                    <input type="password" name="password_confirmation" id="password_confirmation" className='form-control' placeholder='Konfirmasi Kata Sandi' />
                                </div>
                                <div className="form-group">
                                    <button className='btn btn-primary w-100'><Save /> Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}