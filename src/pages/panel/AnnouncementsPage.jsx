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

export default function AnnouncementsPage() {

    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [announcements, setAnnouncements] = useState([])
    const [titleAdd, setTitleAdd] = useState('')
    const [contentAdd, setContentAdd] = useState('')
    const [announcementObjEdit, setAnnouncementObjEdit] = useState('')

    const columns = [
        {
            name: '#',
            selector: (row, index) => {
                return index + 1
            },
            width: '100px'
        },
        {
            name: 'Judul',
            selector: row => row.title,
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
                            handleShowEdit(row.uuid)
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
        axios.get(APP_CONFIG.API_URL + 'announcements', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setAnnouncements(res.data.data.announcements)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })

    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = (uuid) => {
        axios.get(APP_CONFIG.API_URL + `announcements/${uuid}`, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setAnnouncementObjEdit(res.data.data.announcement)
            setShowEdit(true)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    };

    const handleSaveData = () => {
        axios.post(APP_CONFIG.API_URL + 'announcements', {
            title: titleAdd,
            content: contentAdd
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
        axios.patch(APP_CONFIG.API_URL + `announcements/${announcementObjEdit.uuid}`, {
            title: announcementObjEdit.title,
            content: announcementObjEdit.content
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
            text: "Data Pengumuman akan terhapus, secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yakin!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(APP_CONFIG.API_URL + `announcements/${uuid}`, {
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
                                <h5 className="m-b-10">Pengumuman</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">List Pengumuman</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className='mt-3 mt-lg-5 mb-3'>List Pengumuman</h3>

            {/* Modal Create Data  */}
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>Tambah Pengumuman</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Judul Pengumuman</Form.Label>
                            <Form.Control type="text" placeholder="Judul Pengumuman" onChange={(event) => { setTitleAdd(event.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Isi Pengumuman</Form.Label>
                            <Form.Control as={'textarea'} style={{ height: 300 }} placeholder="Isi Pengumuman" onChange={(event) => { setContentAdd(event.target.value) }} />
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
                    <Modal.Title>Edit Pengumuman</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Judul Pengumuman</Form.Label>
                            <Form.Control type="text" placeholder="Judul Pengumuman" value={announcementObjEdit.title} onChange={(event) => {
                                setAnnouncementObjEdit(() => {
                                    let obj = Object.assign({}, announcementObjEdit)
                                    obj.title = event.target.value

                                    return obj
                                })
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Isi Pengumuman</Form.Label>
                            <Form.Control as={'textarea'} style={{ height: 300 }} placeholder="Isi Pengumuman" value={announcementObjEdit.content} onChange={(event) => {
                                setAnnouncementObjEdit(() => {
                                    let obj = Object.assign({}, announcementObjEdit)
                                    obj.content = event.target.value

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
                <div className="col">
                    <button type='button' onClick={handleShow} className="btn btn-success d-flex align-items-center justify-content-center" style={{ gap: '.3rem' }}><Plus /> Tambah Pengumuman</button>

                    <div className="card mt-3">
                        <div className="card-body">
                            <DataTable
                                customStyles={tableCustomStyles}
                                columns={columns}
                                data={announcements}
                                pagination
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}