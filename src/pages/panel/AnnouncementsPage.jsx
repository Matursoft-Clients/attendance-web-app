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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import noImage from './../../assets/images/samples/no-image.jpg'
import './../../styles/ckeditor.css'

export default function AnnouncementsPage() {

    /**
     * Main Data State
     * 
     */
    const [announcements, setAnnouncements] = useState([])

    /**
     * Create Data Stats
     * 
     */
    const [show, setShow] = useState(false);
    const [titleAdd, setTitleAdd] = useState('')
    const [contentAdd, setContentAdd] = useState('')
    const [thumbnailAdd, setThumbmnailAdd] = useState(null)

    /**
     * Edit Data State
     * 
     */
    const [showEdit, setShowEdit] = useState(false);
    const [announcementObjEdit, setAnnouncementObjEdit] = useState('')
    const [thumbnailEdit, setThumbmnailEdit] = useState(null)

    /**
     * Datatable State
     * 
     */
    const columns = [
        {
            name: '#',
            selector: (row, index) => {
                return index + 1
            },
            width: '100px'
        },
        {
            name: 'Thumbnail',
            cell: (row) => {
                return (
                    <img src={row.thumbnail ? row.thumbnail : noImage} className='img-thumnail' width={100} style={{ paddingBottom: '10px', paddingTop: '10px' }} />
                )
            }
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

    /**
     * First Render
     * 
     */
    useEffect(() => {
        loadMainData()
    }, [])

    /**
     * Main Data Func
     * 
     */
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

    /**
     * Create Data Func
     * 
     */
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSaveData = () => {
        const formData = new FormData()

        formData.append('title', titleAdd)
        formData.append('content', contentAdd)
        formData.append('thumbnail', thumbnailAdd)

        axios.post(APP_CONFIG.API_URL + 'announcements', formData, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken(),
                "Content-Type": "multipart/form-data",
            }
        }).then((res) => {
            handleClose();
            ResponseHandler.successHandler(res)
            loadMainData()

            setTitleAdd('')
            setContentAdd('')
            setThumbmnailAdd(null)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    /**
     * Edit Data Func
     * 
     */
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

    const handleUpdateData = () => {

        const formData = new FormData()

        formData.append('title', announcementObjEdit.title)
        formData.append('content', announcementObjEdit.content)
        if (thumbnailEdit) {
            formData.append('thumbnail', thumbnailEdit)
        }

        axios.patch(APP_CONFIG.API_URL + `announcements/${announcementObjEdit.uuid}`, formData, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken(),
                "Content-Type": "multipart/form-data",
            }
        }).then((res) => {
            ResponseHandler.successHandler(res)
            handleCloseEdit();
            loadMainData()

            setAnnouncementObjEdit({
                content: ''
            })
            setThumbmnailEdit(null)
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
            <Modal enforceFocus={false} show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>Tambah Pengumuman</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Thumbnail</Form.Label>
                            <br />
                            <img src={thumbnailAdd ? URL.createObjectURL(thumbnailAdd) : noImage} className='img-thumbnail' width={100} alt="" />
                            <Form.Control type="file" className='mt-2' accept='image/*' onChange={(event) => {
                                setThumbmnailAdd(event.target.files[0])
                            }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Judul Pengumuman</Form.Label>
                            <Form.Control type="text" placeholder="Judul Pengumuman" onChange={(event) => { setTitleAdd(event.target.value) }} />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label>Isi Pengumuman</Form.Label>
                            <CKEditor
                                config={{
                                    toolbar: {
                                        items: [
                                            'undo', 'redo',
                                            '|', 'heading',
                                            '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                            '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                                            '|', 'link', 'blockQuote', 'codeBlock',
                                            '|', 'bulletedList', 'numberedList'
                                        ],
                                        shouldNotGroupWhenFull: false
                                    },
                                    placeholder: 'Isi Pengumuman...'
                                }}
                                editor={ClassicEditor}
                                data={contentAdd}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setContentAdd(data)
                                }}
                            />
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
                            <Form.Label>Thumbnail</Form.Label>
                            <br />
                            <img src={thumbnailEdit ? URL.createObjectURL(thumbnailEdit) : (announcementObjEdit.thumbnail ? announcementObjEdit.thumbnail : noImage)} className='img-thumbnail' width={100} alt="" />
                            <Form.Control type="file" className='mt-2' accept='image/*' onChange={(event) => {
                                setThumbmnailEdit(event.target.files[0])
                            }} />
                        </Form.Group>
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
                            <CKEditor
                                config={{
                                    toolbar: {
                                        items: [
                                            'undo', 'redo',
                                            '|', 'heading',
                                            '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                            '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                                            '|', 'link', 'blockQuote', 'codeBlock',
                                            '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                                        ],
                                        shouldNotGroupWhenFull: false
                                    },
                                    placeholder: 'Isi Pengumuman...'
                                }}
                                editor={ClassicEditor}
                                data={announcementObjEdit.content}
                                onChange={(event, editor) => {
                                    const data = editor.getData();

                                    setAnnouncementObjEdit(() => {
                                        let obj = Object.assign({}, announcementObjEdit)
                                        obj.content = data

                                        return obj
                                    })
                                }}
                            />
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