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
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

export default function JobsPage() {

    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [jobs, setJobs] = useState([])

    const [nameAdd, setNameAdd] = useState('')
    const [codeAdd, setCodeAdd] = useState('')

    const [jobObjEdit, setJobObjEdit] = useState('')

    /**
     * Data table
     * 
     */
    const [currentRowsPerPage, setCurrentRowsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const columns = [
        {
            name: '#',
            selector: (row, index) => {
                return currentPage == 1 ? index + 1 : (currentRowsPerPage * (currentPage - 1)) + index + 1
            },
            width: '100px'
        },
        {
            name: 'Kode Jabatan',
            sortable: true,
            selector: row => row.code,
        },
        {
            name: 'Nama Jabatan',
            sortable: true,
            selector: row => row.name,
        },
        {
            name: 'Dibuat Pada',
            selector: (row) => {
                return DateUtil.formatReadable(row.created_at)
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
    }, [])

    const loadMainData = () => {
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

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = (jobPosition) => {
        setJobObjEdit(jobPosition)
        setShowEdit(true)
    };

    const handleSaveData = () => {
        axios.post(APP_CONFIG.API_URL + 'job-positions', {
            name: nameAdd,
            code: codeAdd,
        }, {
            headers: {
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
        axios.patch(APP_CONFIG.API_URL + `job-positions/${jobObjEdit.uuid}`, {
            name: jobObjEdit.name,
            code: jobObjEdit.code,
        }, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
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
            text: "Data Jabatan akan terhapus, secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yakin!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(APP_CONFIG.API_URL + `job-positions/${uuid}`, {
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

    return (
        <div>
            <ToastContainer />
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Jabatan</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">List Jabatan</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal Create Data  */}
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>Tambah Jabatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Jabatan</Form.Label>
                            <Form.Control type="text" placeholder="Nama Jabatan" onChange={(event) => { setNameAdd(event.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Kode Jabatan</Form.Label>
                            <Form.Control type="text" placeholder="Kode Jabatan" onChange={(event) => { setCodeAdd(event.target.value) }} />
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
                    <Modal.Title>Edit Jabatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Jabatan</Form.Label>
                            <Form.Control type="text" placeholder="Nama Jabatan" value={jobObjEdit.name} onChange={(event) => {
                                setJobObjEdit(() => {
                                    let obj = Object.assign({}, jobObjEdit)
                                    obj.name = event.target.value

                                    return obj
                                })
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Kode Jabatan</Form.Label>
                            <Form.Control type="text" placeholder="Kode Jabatan" value={jobObjEdit.code} onChange={(event) => {
                                setJobObjEdit(() => {
                                    let obj = Object.assign({}, jobObjEdit)
                                    obj.code = event.target.value

                                    return obj
                                })
                            }} />
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
                <div className="col-12">
                    <h3 className='mt-3 mb-3'>List Jabatan</h3>
                </div>
                <div className="col">
                    <button type='button' onClick={handleShow} className="btn btn-success d-flex align-items-center justify-content-center" style={{ gap: '.3rem' }}><Plus /> Tambah Jabatan</button>

                    <div className="card mt-3">
                        <div className="card-body">
                            <DataTableExtensions
                                columns={columns}
                                data={jobs}
                                export={false}
                                print={false}
                                filterPlaceholder={'Cari'}
                            >
                                <DataTable
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight={'550px'}
                                    customStyles={tableCustomStyles}
                                    columns={columns}
                                    data={jobs}
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