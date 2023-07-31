import { Plus } from '@styled-icons/entypo'
import { Edit, Trash, Save, Detail, Devices } from '@styled-icons/boxicons-solid'
import { SearchAlt2 } from '@styled-icons/boxicons-regular'
import { Button, Form, Modal } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import axios from 'axios';
import APP_CONFIG from '../../utils/APP_CONFIG';
import TokenUtil from '../../utils/TokenUtil';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import { tableCustomStyles } from '../../styles/tableCustomStyles';
import { ToastContainer } from 'react-toastify';
import ResponseHandler from '../../utils/ResponseHandler';
import DateUtil from '../../utils/DateUtil';
import { Calendar } from '@mantine/dates';
import './../../styles/react-calendar.css'
import { modals } from '@mantine/modals';
import "react-data-table-component-extensions/dist/index.css";

export default function EmployeesPage() {

    /**
     * Main Data State
     * 
     */
    const [employees, setEmployees] = useState([])
    const [jobs, setJobs] = useState([])
    const [branches, setBranches] = useState([])

    /**
     * Create Data State
     * 
     */
    const [show, setShow] = useState(false);
    const [jobPositionUuid, setJobPositionUuid] = useState('')
    const [branchUuid, setBranchUuid] = useState('')
    const [nameAdd, setNameAdd] = useState('')
    const [whatsappNumberAdd, setWhatsappNumberAdd] = useState('')
    const [nikAdd, setNikAdd] = useState('')
    const [nrpAdd, setNrpAdd] = useState('')
    const [emailAdd, setEmailAdd] = useState('')
    const [passwordAdd, setPasswordAdd] = useState('')
    const [passwordConfirmationAdd, setPasswordConfirmationAdd] = useState('')
    const [imageAdd, setImageAdd] = useState(null)

    /**
     * Edit Data State
     * 
     */
    const [showEdit, setShowEdit] = useState(false);
    const [employeeObjEdit, setEmployeeObjEdit] = useState('')
    const [imageEdit, setImageEdit] = useState(null)

    /**
     * Show Data State
     * 
     */
    const [showEmployee, setShowEmployee] = useState(false);
    const [employeeObj, setEmployeeObj] = useState('')

    /**
     * Show Calendar State
     * 
     */
    const [showCalendarEmployee, setShowCalendarEmployee] = useState(false);
    const [employeeCalendar, setEmployeeCalendar] = useState([])

    /**
     * Data table
     * 
     */
    const [currentRowsPerPage, setCurrentRowsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    /**
     * Data Table
     * 
     */
    const columns = [
        {
            name: '#',
            selector: (row, index) => {
                return currentPage == 1 ? index + 1 : (currentRowsPerPage * (currentPage - 1)) + index + 1
            },
            width: '100px'
        },
        {
            name: 'Foto',
            cell: (row) => {
                return (
                    <img className="py-1 img-fluid wid-70" src={row.photo} alt="User image" />
                )
            }
        },
        {
            name: 'NRP',
            selector: row => row.nrp,
        },
        {
            name: 'Nama',
            sortable: true,
            selector: row => row.name,
        },
        {
            name: 'Cabang',
            sortable: true,
            selector: row => row.branch.name,
        },
        {
            name: 'Jabatan',
            sortable: true,
            selector: row => row.job_position.name,
        },
        {
            name: 'email',
            sortable: true,
            selector: row => row.email,
        },
        {
            name: 'Device ID',
            sortable: true,
            selector: (row) => {
                return row.device_id ? row.device_id : '-'
            },
        },
        {
            name: 'Device Name',
            sortable: true,
            selector: (row) => {
                return row.device_name ? row.device_name : '-'
            },
        },
        {
            name: 'Aksi',
            width: '400px',
            cell: (row) => {
                return (
                    <div className='d-flex justify-content-center align-items-center'>
                        <button className='mr-1 btn btn-sm btn-info' onClick={() => {
                            handleShowCalendarEmployee(row)
                        }}><SearchAlt2 className='mr-1' />Lihat Absen</button>
                        <button className='btn btn-sm btn-primary mr-1' onClick={() => {
                            handleShowEdit(row)
                        }}><Edit className='mr-1' />Edit</button>
                        <button className='btn btn-sm btn-success' onClick={() => {
                            handleShowEmployee(row)
                        }}><Detail className='mr-1' />Lihat</button>
                        <button className='btn btn-sm btn-danger mx-1' onClick={() => {
                            handleDeleteData(row.uuid)
                        }}><Trash className='mr-1' />Hapus</button>
                        <button className='btn btn-sm btn-dark' onClick={() => {
                            handleRefreshDevice(row.uuid)
                        }}><Devices className='mr-1' />Refresh Device</button>
                    </div>
                )
            }
        }
    ];

    /**
     * Handle Refresh Device
     * 
     */
    const handleRefreshDevice = (employee_uuid) => {
        axios.patch(APP_CONFIG.API_URL + 'employees/refresh-device/' + employee_uuid, {}, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            ResponseHandler.successHandler(res)
            loadMainData()
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    /**
     * First Render
     * 
     */
    useEffect(() => {
        loadMainData()
        loadJobs()
        loadBranches()
    }, [])

    /**
     * Show Calendar Func
     * 
     */
    const handleShowCalendarEmployee = (employee) => {
        axios.get(APP_CONFIG.API_URL + `calendar?date=${DateUtil.getCurrentYear()}-${DateUtil.getCurrentMonth()}&employee_uuid=${employee.uuid}`, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setEmployeeCalendar(res.data.data)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })

        setShowCalendarEmployee(employee)
    }

    const handleCloseShowModalCalendarEmployee = () => {
        setShowCalendarEmployee(false)
    }

    /**
     * Main Data Func
     * 
     */
    const loadJobs = () => {
        axios.get(APP_CONFIG.API_URL + 'job-positions', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setJobs(res.data.data.jobPositions)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    const loadBranches = () => {
        axios.get(APP_CONFIG.API_URL + 'branches', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setBranches(res.data.data.branches)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    const loadMainData = () => {
        axios.get(APP_CONFIG.API_URL + 'employees', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setEmployees(res.data.data.employees)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })

    }

    /**
     * Create Data Func
     * 
     */
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSaveData = () => {
        const formData = new FormData()

        formData.append('job_position_uuid', jobPositionUuid)
        formData.append('name', nameAdd)
        formData.append('email', emailAdd)
        formData.append('password', passwordAdd)
        formData.append('password_confirmation', passwordConfirmationAdd)
        formData.append('photo', imageAdd)
        formData.append('nik', nikAdd)
        formData.append('nrp', nrpAdd)
        formData.append('whatsapp_number', whatsappNumberAdd)
        formData.append('branch_uuid', branchUuid)

        axios.post(APP_CONFIG.API_URL + 'employees', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            handleClose();
            ResponseHandler.successHandler(res)
            loadMainData()

            setJobPositionUuid('')
            setNameAdd('')
            setEmailAdd('')
            setPasswordAdd('')
            setPasswordConfirmationAdd('')
            setImageAdd(null)
            setNikAdd('')
            setNrpAdd('')
            setWhatsappNumberAdd('')
            setBranchUuid('')
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    /**
     * Show Data Func
     * 
     */
    const handleCloseEmployee = () => setShowEmployee(false)
    const handleShowEmployee = (employee) => {
        setEmployeeObj(employee)
        setShowEmployee(true)
    }

    /**
     * Edit Data Func
     * 
     */
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = (employee) => {
        setEmployeeObjEdit(employee)
        setShowEdit(true)
    };
    const handleUpdateData = () => {
        const formData = new FormData()

        formData.append('branch_uuid', employeeObjEdit.branch_uuid)
        formData.append('job_position_uuid', employeeObjEdit.job_position_uuid)
        formData.append('name', employeeObjEdit.name)
        formData.append('email', employeeObjEdit.email)
        formData.append('nik', employeeObjEdit.nik)
        formData.append('nrp', employeeObjEdit.nrp)
        formData.append('whatsapp_number', employeeObjEdit.whatsapp_number)

        if (employeeObjEdit.password) {
            formData.append('password', employeeObjEdit.password ? employeeObjEdit.password : '')
            formData.append('password_confirmation', employeeObjEdit.password_confirmation ? employeeObjEdit.password_confirmation : '')
        }

        if (imageEdit) {
            formData.append('photo', imageEdit)
        }

        axios.patch(APP_CONFIG.API_URL + `employees/${employeeObjEdit.uuid}`, formData, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken(),
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            ResponseHandler.successHandler(res)
            handleCloseEdit();
            loadMainData()

            setEmployeeObjEdit({})
            setImageEdit(null)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    /**
     * Delete Data Func
     * 
     */
    const handleDeleteData = (uuid) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Data Karyawan akan terhapus, secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yakin!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(APP_CONFIG.API_URL + `employees/${uuid}`, {
                    headers: {
                        Authorization: 'Bearer ' + TokenUtil.getApiToken()
                    }
                }).then((res) => {
                    ResponseHandler.successHandler(res)
                    loadMainData()
                }).catch((err) => {
                    ResponseHandler.errorHandler(err)
                })
            }
        })
    }

    /**
     * UI Render
     * 
     */
    const _renderChooseJobPositions = () => {
        if (jobs) {
            return jobs.map((e) => {
                return (
                    <option value={e.uuid}>{e.name}</option>
                )
            })
        }
    }

    const _renderChooseBranches = () => {
        if (branches) {
            return branches.map((e) => {
                return (
                    <option value={e.uuid}>{e.name}</option>
                )
            })
        }
    }

    return (
        <div>
            <ToastContainer />
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Karyawan</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">List Karyawan</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create Data  */}
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header>
                    <Modal.Title>Tambah Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col-lg-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Cabang</Form.Label>
                                    <Form.Select aria-label="Pilih Cabang" value={branchUuid} onChange={(e) => { setBranchUuid(e.target.value) }}>
                                        <option selected value={''} disabled>Pilih Cabang</option>
                                        {_renderChooseBranches()}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Jabatan</Form.Label>
                                    <Form.Select aria-label="Pilih Jabatan" value={jobPositionUuid} onChange={(e) => { setJobPositionUuid(e.target.value) }}>
                                        <option selected value={''} disabled>Pilih Jabatan</option>
                                        {_renderChooseJobPositions()}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nama Karyawan</Form.Label>
                                    <Form.Control type="text" placeholder="Nama Karyawan" value={nameAdd} onChange={(event) => { setNameAdd(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>NIK</Form.Label>
                                    <Form.Control type="number" placeholder="NIK" value={nikAdd} onChange={(event) => { setNikAdd(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>NRP</Form.Label>
                                    <Form.Control type="text" placeholder="NRP" value={nrpAdd} onChange={(event) => { setNrpAdd(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nomor Whatsapp</Form.Label>
                                    <Form.Control type="text" placeholder="Nomor Whatsapp" autoComplete='off' value={whatsappNumberAdd} name='whatsapp_number' onChange={(event) => { setWhatsappNumberAdd(event.target.value) }} />
                                </Form.Group>
                            </div>
                            <div className="col-lg-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Email" autoComplete='off' name='email' value={emailAdd} onChange={(event) => { setEmailAdd(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" value={passwordAdd} autoComplete='off' onChange={(event) => { setPasswordAdd(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password Konfirmasi</Form.Label>
                                    <Form.Control type="password" placeholder="Password Konfirmasi" value={passwordConfirmationAdd} autoComplete='off' onChange={(event) => { setPasswordConfirmationAdd(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Foto</Form.Label>
                                    <br />
                                    <img src={imageAdd ? URL.createObjectURL(imageAdd) : require('./../../assets/images/samples/no-photo.png')} alt="image" style={{ width: 100, marginBottom: 10 }} />
                                    <Form.Control type="file" accept='image/*' onChange={(event) => { setImageAdd(event.target.files[0]) }} />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Tutup
                    </Button>
                    <Button variant="primary" onClick={handleSaveData}>
                        <Save /> Simpan
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Modal Create Data */}

            {/* Modal Show Data  */}
            <Modal show={showEmployee} onHide={handleCloseEmployee} size="md">
                <Modal.Header>
                    <Modal.Title>Detail Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex justify-content-center'>
                        <img src={employeeObj.photo ? employeeObj.photo : require('./../../assets/images/samples/no-photo.png')} alt="photo" style={{ width: 200 }} />
                    </div>
                    <table className='mt-4 table'>
                        <tr>
                            <th>NIK</th>
                            <th>:</th>
                            <td>{employeeObj.nik}</td>
                        </tr>
                        <tr>
                            <th>NRP</th>
                            <th>:</th>
                            <td>{employeeObj.nrp}</td>
                        </tr>
                        <tr>
                            <th>Nama</th>
                            <th>:</th>
                            <td>{employeeObj.name}</td>
                        </tr>
                        <tr>
                            <th>Cabang</th>
                            <th>:</th>
                            <td>{employeeObj.branch ? employeeObj.branch.name : ''}</td>
                        </tr>
                        <tr>
                            <th>Jabatan</th>
                            <th>:</th>
                            <td>{employeeObj.job_position ? employeeObj.job_position.name : ''}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <th>:</th>
                            <td>{employeeObj.email}</td>
                        </tr>
                        <tr>
                            <th>Nomor Whatsapp</th>
                            <th>:</th>
                            <td>{employeeObj.whatsapp_number}</td>
                        </tr>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEmployee}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Modal Show Data */}

            {/* Modal Show Calendar Employee  */}
            <Modal show={showCalendarEmployee} onHide={handleCloseShowModalCalendarEmployee} size="md" onShow={() => {
                document.querySelector('button.mantine-CalendarHeader-calendarHeaderLevel').setAttribute('disabled', true)
            }}>
                <Modal.Header>
                    <Modal.Title>Absen Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Calendar
                        previousDisabled={true}
                        previousIcon={<></>}
                        previousLabel=''

                        __onDayClick={(event) => {

                            if (event.target.style.paddingLeft) {
                                let dateDate = event.target.innerText

                                const absenDate = employeeCalendar.find((e, i) => {
                                    if (e.absen) {
                                        return e.absen.date == dateDate
                                    }
                                })

                                setShowCalendarEmployee(false)

                                modals.open({
                                    title: 'Detail absensi tanggal ' + absenDate.absen.date,
                                    children: (
                                        <table className='table'>
                                            <tr>
                                                <th>Absen Masuk</th>
                                                <th>:</th>
                                                <td>{absenDate.absen.presence_entry_hour ? absenDate.absen.presence_entry_hour : '-'}</td>
                                            </tr>
                                            <tr>
                                                <th>Absen Pulang</th>
                                                <th>:</th>
                                                <td>{absenDate.absen.presence_exit_hour ? absenDate.absen.presence_exit_hour : '-'}</td>
                                            </tr>
                                        </table>
                                    ),
                                    centered: true,
                                });
                            }
                        }}

                        renderDay={(dateObj) => {
                            const dateDate = dateObj.getDate() > 9 ? `${dateObj.getDate()}` : `0${dateObj.getDate()}`;

                            let bgColor = null
                            let borderColor = null
                            let component = null

                            const absenDate = employeeCalendar.find((e, i) => {
                                if (e.absen) {
                                    return e.absen.date == dateDate
                                }
                            })

                            if (absenDate) {
                                if (absenDate.absen.presence_entry_status == 'on_time') {
                                    bgColor = '#22c55e'
                                } else if (absenDate.absen.presence_entry_status == 'late') {
                                    bgColor = '#dc2626'
                                } else if (absenDate.absen.presence_entry_status == 'not_present') {
                                    bgColor = '#FFFFFF'
                                } else if (absenDate.absen.presence_entry_status == 'not_valid') {
                                    bgColor = '#000000'
                                }

                                if (!absenDate.absen.presence_exit_status) {
                                    borderColor = '#d1d5db'
                                } else if (absenDate.absen.presence_exit_status == 'early') {
                                    borderColor = '#fca5a5'
                                } else if (absenDate.absen.presence_exit_status == 'on_time') {
                                    borderColor = '#22c55e'
                                } else if (absenDate.absen.presence_exit_status == 'not_present') {
                                    borderColor = '#FFFFFF'
                                }

                                component = <div style={{ background: borderColor, padding: '5px' }}>
                                    <div style={{ background: bgColor, paddingLeft: '3px', paddingRight: '3px', color: '#FFF' }}>
                                        {dateDate}
                                    </div>
                                </div>
                            }

                            return component ? component : dateDate
                        }}

                        nextDisabled={true}
                        nextIcon={<></>}
                        nextLabel=''
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseShowModalCalendarEmployee}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Modal Show Calendar Employee */}

            {/* Modal Edit Data  */}
            <Modal show={showEdit} onHide={handleCloseEdit} size="xl">
                <Modal.Header>
                    <Modal.Title>Edit Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col-lg-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Cabang</Form.Label>
                                    <Form.Select aria-label="Default select example" value={employeeObjEdit.branch_uuid} onChange={(e) => {
                                        setEmployeeObjEdit(() => {
                                            let obj = Object.assign({}, employeeObjEdit)
                                            obj.branch_uuid = e.target.value

                                            return obj
                                        })
                                    }}>
                                        <option selected value={''} disabled>Pilih Cabang</option>
                                        {_renderChooseBranches()}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Jabatan</Form.Label>
                                    <Form.Select aria-label="Default select example" value={employeeObjEdit.job_position_uuid} onChange={(e) => {
                                        setEmployeeObjEdit(() => {
                                            let obj = Object.assign({}, employeeObjEdit)
                                            obj.job_position_uuid = e.target.value

                                            return obj
                                        })
                                    }}>
                                        <option selected value={''} disabled>Pilih Jabatan</option>
                                        {_renderChooseJobPositions()}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nama Karyawan</Form.Label>
                                    <Form.Control type="text" placeholder="Nama Karyawan" value={employeeObjEdit.name} onChange={(event) => {
                                        setEmployeeObjEdit(() => {
                                            let obj = Object.assign({}, employeeObjEdit)
                                            obj.name = event.target.value

                                            return obj
                                        })
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>NIK</Form.Label>
                                    <Form.Control type="text" placeholder="NIK" value={employeeObjEdit.nik} onChange={(event) => {
                                        setEmployeeObjEdit(() => {
                                            let obj = Object.assign({}, employeeObjEdit)
                                            obj.nik = event.target.value

                                            return obj
                                        })
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>NRP</Form.Label>
                                    <Form.Control type="number" placeholder="NRP" value={employeeObjEdit.nrp} onChange={(event) => {
                                        setEmployeeObjEdit(() => {
                                            let obj = Object.assign({}, employeeObjEdit)
                                            obj.nrp = event.target.value

                                            return obj
                                        })
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nomor Whatsapp</Form.Label>
                                    <Form.Control type="text" placeholder="Nomor Whatsapp" value={employeeObjEdit.whatsapp_number} onChange={(event) => {
                                        setEmployeeObjEdit(() => {
                                            let obj = Object.assign({}, employeeObjEdit)
                                            obj.whatsapp_number = event.target.value

                                            return obj
                                        })
                                    }} />
                                </Form.Group>
                            </div>
                            <div className="col-lg-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Email" value={employeeObjEdit.email} autoComplete='off' onChange={(event) => {
                                        setEmployeeObjEdit(() => {
                                            let obj = Object.assign({}, employeeObjEdit)
                                            obj.email = event.target.value

                                            return obj
                                        })
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" autoComplete='off' onChange={(event) => {
                                        setEmployeeObjEdit(() => {
                                            let obj = Object.assign({}, employeeObjEdit)
                                            obj.password = event.target.value

                                            return obj
                                        })
                                    }} />
                                    <small>Biarkan kosong jika tidak mengubah kata sandi</small>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password Konfirmasi</Form.Label>
                                    <Form.Control type="password" placeholder="Password Konfirmasi" autoComplete='off' onChange={(event) => {
                                        setEmployeeObjEdit(() => {
                                            let obj = Object.assign({}, employeeObjEdit)
                                            obj.password_confirmation = event.target.value

                                            return obj
                                        })
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Foto</Form.Label>
                                    <br />
                                    <img src={imageEdit ? URL.createObjectURL(imageEdit) : (employeeObjEdit.photo ? employeeObjEdit.photo : require('./../../assets/images/samples/no-photo.png'))} alt="image" style={{ width: 100, marginBottom: 10 }} />
                                    <Form.Control type="file" accept='image/*' onChange={(event) => { setImageEdit(event.target.files[0]) }} />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateData}>
                        <Save /> Update
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Modal Edit Data */}

            <div className="row">
                <div className="col-12">
                    <h3 className='mt-3 mb-3'>List Karyawan</h3>
                </div>
                <div className="col">
                    <button type='button' onClick={handleShow} className="btn btn-success d-flex align-items-center justify-content-center" style={{ gap: '.3rem' }}><Plus /> Tambah Karyawan</button>

                    <div className="card mt-3">
                        <div className="card-body">
                            <DataTableExtensions
                                columns={columns}
                                data={employees}
                                export={false}
                                print={false}
                                filterPlaceholder={'Cari'}
                            >
                                <DataTable
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight={'550px'}
                                    customStyles={tableCustomStyles}
                                    columns={columns}
                                    data={employees}
                                    pagination
                                    onChangePage={(page) => {
                                        setCurrentPage(page)
                                    }}
                                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                                        setCurrentPage(currentPage)
                                        setCurrentRowsPerPage(currentRowsPerPage)
                                    }}
                                />
                            </DataTableExtensions>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}