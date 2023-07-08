import { Plus } from '@styled-icons/entypo'
import { Barcode, Edit, Trash, Spreadsheet, Save } from '@styled-icons/boxicons-solid'
import { Button, Form, Modal } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import axios from 'axios';
import APP_CONFIG from '../../utils/APP_CONFIG';
import { ToastContainer, toast } from 'react-toastify';
import StringUtil from '../../utils/StringUtil';

export default function CommonProductPage() {

    useEffect(() => {
        loadProducts()
    }, [])

    const [products, setProducts] = useState([])

    const [addProductName, setAddProductName] = useState('');
    const [addProductCode, setAddProductCode] = useState('');
    const [addPrice, setAddPrice] = useState('');
    const [addPhoto, setAddPhoto] = useState('');

    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showGenerateLabel, setShowGenerateLabel] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    const handleCloseGenerateLabel = () => setShowGenerateLabel(false);
    const handleShowGenerateLabel = () => setShowGenerateLabel(true);

    const handleSaveCreateProduct = () => {
        const token = localStorage.getItem('api_token')
        const formData = new FormData();

        formData.append('product_name', addProductName)
        formData.append('product_code', addProductCode)
        formData.append('price', addPrice)
        formData.append("photo", addPhoto);

        axios.post(APP_CONFIG.API_URL + 'products', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': "Bearer " + token
            },
        }).then((res) => {
            Swal.fire({
                title: 'Berhasil!',
                text: 'Produk telah ditambahkan',
                icon: 'success',
            })

            handleClose();
            loadProducts()
        }).catch((err) => {
            if (err.response.status == 422) {
                toast(`${err.response.data.msg} ${err.response.data.error ? ', ' + err.response.data.error : ''}`, {
                    type: 'error',
                });
            }
        })
    }

    const loadProducts = () => {
        const token = localStorage.getItem('api_token')

        axios.get(APP_CONFIG.API_URL + 'products', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            setProducts(res.data.data.products.data)
        })
    }

    const handleSaveGenerateLabel = () => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Generate Label berhasil dilakukan',
            icon: 'success',
        })

        handleCloseGenerateLabel();
        window.open('https://html.spec.whatwg.org/print.pdf', '_blank');
    }

    const handleUpdateProduct = () => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Produk telah diupdate',
            icon: 'success',
        })

        handleCloseEdit();
    }

    const handleDeleteProduct = () => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Data produk akan terhapus, secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yakin!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Produk telah dihapus',
                    icon: 'success',
                })
            }
        })
    }

    const _renderProducts = () => {
        return products.map((product, i) => {
            return (
                <tr>
                    <td>{i + 1}</td>
                    <td>
                        <img src={product.photo} width={80} className='img-thumbnail' alt="" />
                    </td>
                    <td>{product.product_name}</td>
                    <td>{product.product_code}</td>
                    <td>Rp{StringUtil.formatRupiah(product.price)}</td>
                    <td>
                        <button className='btn btn-sm btn-warning' onClick={handleShowGenerateLabel}><Barcode className='mr-1' />Generate Label</button>
                    </td>
                    <td>
                        <div className='d-flex justify-content-center align-items-center'>
                            <button className='btn btn-sm btn-primary' onClick={handleShowEdit}><Edit className='mr-1' />Edit</button>
                            <button className='btn btn-sm btn-danger mx-1' onClick={handleDeleteProduct}><Trash className='mr-1' />Hapus</button>
                            <Link to={'/panel/common-product-history'} className='btn btn-sm btn-info'><Spreadsheet className='mr-1' />History</Link>
                        </div>
                    </td>
                </tr>
            )
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
                                <h5 className="m-b-10">Produk</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">List Produk</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className='mt-3 mt-lg-5 mb-3'>List Produk</h3>

            {/* Modal Create Product  */}
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>Tambah Produk</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="product_name">
                            <Form.Label>Nama Produk</Form.Label>
                            <Form.Control type="text" placeholder="Nama Produk" onChange={(event) => { setAddProductName(event.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="product_code">
                            <Form.Label>Kode Produk</Form.Label>
                            <Form.Control type="text" placeholder="Kode Produk" onChange={(event) => { setAddProductCode(event.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Harga</Form.Label>
                            <Form.Control type="number" placeholder="Harga" onChange={(event) => { setAddPrice(event.target.value) }} />
                        </Form.Group>
                        <Form.Group controlId="image" className="mb-3">
                            <Form.Label>Gambar</Form.Label>
                            <Form.Control type="file" onChange={(event) => { setAddPhoto(event.target.files[0]) }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveCreateProduct}>
                        <Save /> Save
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Modal Create Product */}

            {/* Modal Edit Product  */}
            <Modal show={showEdit} onHide={handleCloseEdit} size="lg">
                <Modal.Header>
                    <Modal.Title>Edit Produk</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="product_name">
                            <Form.Label>Nama Produk</Form.Label>
                            <Form.Control type="text" placeholder="Nama Produk" defaultValue={'Cherry Blossoms'} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="product_code">
                            <Form.Label>Kode Produk</Form.Label>
                            <Form.Control type="text" placeholder="Kode Produk" defaultValue={'SNMT-261'} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Harga</Form.Label>
                            <Form.Control type="number" placeholder="Harga" defaultValue={10000} />
                        </Form.Group>
                        <Form.Group controlId="image" className="mb-3">
                            <Form.Label>Gambar</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateProduct}>
                        <Save /> Update
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Modal Edit Product */}

            {/* Modal Generate Label  */}
            <Modal show={showGenerateLabel} onHide={handleCloseGenerateLabel} size="lg">
                <Modal.Header>
                    <Modal.Title>Generate Label</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className='p-4 border'>
                            <table className='table' style={{ tableLayout: 'auto' }}>
                                <thead>
                                    <tr>
                                        <td><b>Nama Produk</b></td>
                                        <td><b>:</b></td>
                                        <td>Cherry Blossoms</td>
                                    </tr>
                                    <tr>
                                        <td><b>Kode Produk</b></td>
                                        <td><b>:</b></td>
                                        <td>SNMT-261</td>
                                    </tr>
                                    <tr>
                                        <td><b>Harga</b></td>
                                        <td><b>:</b></td>
                                        <td>RP10.000</td>
                                    </tr>
                                    <tr>
                                        <td><b>Gambar</b></td>
                                        <td><b>:</b></td>
                                        <td>
                                            <img src="https://ae01.alicdn.com/kf/H3af1e6c21bcc4cd9a7ab4d884aa373f3F/Buku-Catatan-Tangan-Notebook-Cherry-Blossom-A6-Gesper-Magnetik-Buku-Harian-Anak-Perempuan-Buku-Catatan-Lucu.jpg" width={80} className='img-thumbnail' alt="" />
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        <Form.Group className="mb-3 mt-3" controlId="amount">
                            <Form.Label>Jumlah</Form.Label>
                            <Form.Control type="number" placeholder="Jumlah" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseGenerateLabel}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveGenerateLabel}>
                        <Barcode /> Generate Label
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Modal Generate Label */}

            <div className="row">
                <div className="col">
                    <button type='button' onClick={handleShow} className="btn btn-success d-flex align-items-center justify-content-center" style={{ gap: '.3rem' }}><Plus /> Tambah Produk</button>

                    <div className="card mt-3">
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Gambar</th>
                                        <th>Nama Produk</th>
                                        <th>Kode Produk</th>
                                        <th>Harga</th>
                                        <th>Generator</th>
                                        <th className='text-center'>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {_renderProducts()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}