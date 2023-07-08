import { Plus } from '@styled-icons/entypo'
import { Edit, Trash, Save } from '@styled-icons/boxicons-solid'
import { Button, Form, Modal } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import axios from 'axios';
import APP_CONFIG from '../../utils/APP_CONFIG';
import TokenUtil from '../../utils/TokenUtil';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../styles/tableCustomStyles';
import { ToastContainer } from 'react-toastify';
import ResponseHandler from '../../utils/ResponseHandler';
import DateUtil from '../../utils/DateUtil';

export default function EmployeesPage() {

    const [show, setShow] = useState(false);
    const [employees, setEmployees] = useState([])
    const [jobs, setJobs] = useState([])
    const [showEdit, setShowEdit] = useState(false);

    const [jobPositionUuid, setJobPositionUuid] = useState('')
    const [nameAdd, setNameAdd] = useState('')
    const [emailAdd, setEmailAdd] = useState('')
    const [passwordAdd, setPasswordAdd] = useState('')
    const [imageAdd, setImageAdd] = useState(null)

    const [employeeObjEdit, setEmployeeObjEdit] = useState('')
    const [imageEdit, setImageEdit] = useState(null)

    const columns = [
        {
            name: '#',
            selector: (row, index) => {
                return index + 1
            },
            width: '100px'
        },
        {
            name: 'Foto',
            cell: (row) => {
                return (
                    <img className="img-fluid wid-80" src={row.photo} alt="User image" />
                )
            }
        },
        {
            name: 'Nama',
            selector: row => row.name,
        },
        {
            name: 'Jabatan',
            selector: row => row.name,
        },
        {
            name: 'email',
            selector: row => row.email,
        },
        {
            name: 'Dibuat Pada',
            selector: (row) => {
                return DateUtil.formatYmdHisFromDate(row.created_at)
            },
        },
        {
            name: 'Aksi',
            cell: (row) => {
                return (
                    <div className='d-flex justify-content-center align-items-center'>
                        <button className='btn btn-sm btn-primary' onClick={() => {
                            handleShowEdit(row)
                        }}><Edit className='mr-1' />Edit</button>
                        <button className='btn btn-sm btn-danger mx-1' onClick={() => {
                            handleDeleteData(row.uuid)
                        }}><Trash className='mr-1' />Hapus</button>
                    </div>
                )
            }
        }
    ];

    useEffect(() => {
        loadMainData()
        loadJobs()
    }, [])

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

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = (employee) => {
        setEmployeeObjEdit(employee)
        setShowEdit(true)
    };

    const handleSaveData = () => {
        const formData = new FormData()

        formData.append('job_position_uuid', jobPositionUuid)
        formData.append('name', nameAdd)
        formData.append('email', emailAdd)
        formData.append('password', passwordAdd)
        formData.append('photo', imageAdd)

        axios.post(APP_CONFIG.API_URL + 'employees', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            handleClose();
            ResponseHandler.successHandler(res)
            loadMainData()
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    const handleUpdateData = () => {
        const formData = new FormData()

        formData.append('job_position_uuid', employeeObjEdit.job_position_uuid)
        formData.append('name', employeeObjEdit.name)
        formData.append('email', employeeObjEdit.email)
        formData.append('password', employeeObjEdit.password)
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
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

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

    const _renderChooseJobPositions = () => {
        if (jobs) {
            return jobs.map((e) => {
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

            <h3 className='mt-3 mt-lg-5 mb-3'>List Karyawan</h3>

            {/* Modal Create Data  */}
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>Tambah Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Jabatan</Form.Label>
                            <Form.Select aria-label="Default select example" value={jobPositionUuid} onChange={(e) => { setJobPositionUuid(e.target.value) }}>
                                <option selected value={''} disabled>Pilih Jabatan</option>
                                {_renderChooseJobPositions()}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Karyawan</Form.Label>
                            <Form.Control type="text" placeholder="Nama Karyawan" onChange={(event) => { setNameAdd(event.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" autoComplete='off' onChange={(event) => { setEmailAdd(event.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" autoComplete='off' onChange={(event) => { setPasswordAdd(event.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Foto</Form.Label>
                            <Form.Control type="file" onChange={(event) => { setImageAdd(event.target.files[0]) }} />
                        </Form.Group>
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

            {/* Modal Edit Data  */}
            <Modal show={showEdit} onHide={handleCloseEdit} size="lg">
                <Modal.Header>
                    <Modal.Title>Edit Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Foto</Form.Label>
                            <Form.Control type="file" onChange={(event) => { setImageEdit(event.target.files[0]) }} />
                        </Form.Group>
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
                <div className="col">
                    <button type='button' onClick={handleShow} className="btn btn-success d-flex align-items-center justify-content-center" style={{ gap: '.3rem' }}><Plus /> Tambah Karyawan</button>

                    <div className="card mt-3">
                        <div className="card-body">
                            <DataTable
                                customStyles={tableCustomStyles}
                                columns={columns}
                                data={employees}
                                pagination
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}