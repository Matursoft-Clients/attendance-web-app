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

export default function BannersPage() {

    const [show, setShow] = useState(false);
    const [banners, setBanners] = useState([])
    const [nameAdd, setNameAdd] = useState('')
    const [imageAdd, setImageAdd] = useState(null)

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
            name: 'Nama',
            sortable: true,
            selector: row => row.name,
        },
        {
            name: 'Banner',
            cell: (row) => {
                return (
                    <img className="py-1 img-fluid wid-80" src={row.image} alt="User image" />
                )
            }
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
        axios.get(APP_CONFIG.API_URL + 'banners', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setBanners(res.data.data.banners)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })

    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSaveData = () => {
        const formData = new FormData()
        formData.append('name', nameAdd)
        formData.append('image', imageAdd)

        axios.post(APP_CONFIG.API_URL + 'banners', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            handleClose();
            ResponseHandler.successHandler(res)
            loadMainData()

            setNameAdd('')
            setImageAdd(null)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    const handleDeleteData = (uuid) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Data Banner akan terhapus, secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yakin!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(APP_CONFIG.API_URL + `banners/${uuid}`, {
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
                                <h5 className="m-b-10">Banner</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">List Banner</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create Data  */}
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>Tambah Banner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Judul Banner</Form.Label>
                            <Form.Control type="text" placeholder="Judul Banner" onChange={(event) => { setNameAdd(event.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Banner</Form.Label>
                            <br />
                            <img src={imageAdd ? URL.createObjectURL(imageAdd) : require('./../../assets/images/samples/no-image.jpg')} alt="image" style={{ width: 100, marginBottom: 10 }} />
                            <Form.Control type="file" accept='image/*' onChange={(event) => { setImageAdd(event.target.files[0]) }} />
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

            <div className="row">
                <div className="col-12">
                    <h3 className='mt-3 mb-3'>List Banner</h3>
                </div>
                <div className="col">
                    <button type='button' onClick={handleShow} className="btn btn-success d-flex align-items-center justify-content-center" style={{ gap: '.3rem' }}><Plus /> Tambah Banner</button>

                    <div className="card mt-3">
                        <div className="card-body">
                            <DataTableExtensions
                                columns={columns}
                                data={banners}
                                export={false}
                                print={false}
                                filterPlaceholder={'Cari'}
                            >
                                <DataTable
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight={'550px'}
                                    customStyles={tableCustomStyles}
                                    columns={columns}
                                    data={banners}
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