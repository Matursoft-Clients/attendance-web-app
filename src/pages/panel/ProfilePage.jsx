import { Save } from 'styled-icons/boxicons-solid'
import avatar from './../../assets/images/samples/no-photo.png'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import APP_CONFIG from '../../utils/APP_CONFIG'
import TokenUtil from '../../utils/TokenUtil'
import ResponseHandler from '../../utils/ResponseHandler'
import { ToastContainer } from 'react-toastify'

export default function ProfilePage() {

    const [user, setUser] = useState({})
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [photo, setPhoto] = useState()
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

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
            setName(res.data.data.user.name)
            setEmail(res.data.data.user.email)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    const doUpdate = () => {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)

        if (photo) {
            formData.append('photo', photo)
        }

        if (password) {
            formData.append('password', password)
            formData.append('password_confirmation', passwordConfirmation)
        }

        axios.patch(APP_CONFIG.API_URL + 'users/' + user.uuid, formData, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            ResponseHandler.successHandler(res)
            loadUser()
            document.getElementById('avatar').value = ''
            setPhoto(null)
            setPassword('')
            setPasswordConfirmation('')
            setTimeout(() => {
                window.location.reload()
            }, 500);
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    return (
        <div>
            <ToastContainer />
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
                            <div className="media user-about-block align-items-center mt-0">
                                <div className="position-relative w-100 d-inline-block">
                                    <div className='d-flex flex-column align-items-center'>
                                        <img className="img-radius img-fluid wid-80" src={user.photo ? user.photo : avatar} alt="User image" />
                                        <div className="media-body mt-3">
                                            <h6 className="mb-1">{user.name}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <span className="f-w-500"><i className="feather icon-mail m-r-10"></i>Email</span>
                                <a href="mailto:demo@sample" className="float-right text-body">{user.email}</a>
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
                                    <label htmlFor="name">Nama</label>
                                    <input type="text" name="name" id="name" className='form-control' placeholder='Nama' value={name} onChange={(event) => { setName(event.target.value) }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="text" name="email" id="email" className='form-control' placeholder='Email' value={email} onChange={(event) => { setEmail(event.target.value) }} />
                                </div>
                                <div className="form-group">
                                    <div>
                                        <img src={photo ? URL.createObjectURL(photo) : (user.photo ? user.photo : avatar)} alt="" className='img-thumbnail' width={'100px'} />
                                    </div>
                                    <label htmlFor="email" className='mt-2'>Foto</label>
                                    <input type="file" accept='image/*' name="avatar" id="avatar" className='form-control' placeholder='Avatar' onChange={(event) => { setPhoto(event.target.files[0]) }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Kata Sandi</label>
                                    <input type="password" name="password" id="password" className='form-control' placeholder='Kata Sandi' value={password} onChange={(event) => { setPassword(event.target.value) }} />

                                    <small>Biarkan kosong, jika tidak mengubah kata sandi</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password_confirmation">Konfirmasi Kata Sandi</label>
                                    <input type="password" name="password_confirmation" id="password_confirmation" className='form-control' placeholder='Konfirmasi Kata Sandi' value={passwordConfirmation} onChange={(event) => { setPasswordConfirmation(event.target.value) }} />
                                </div>
                                <div className="form-group">
                                    <button className='btn btn-primary w-100' type='button' onClick={() => {
                                        doUpdate()
                                    }}><Save /> Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}