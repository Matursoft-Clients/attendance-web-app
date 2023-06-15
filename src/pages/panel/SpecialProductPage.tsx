import { Plus } from '@styled-icons/entypo'
import { Barcode, Edit, Trash, Spreadsheet, Save, Paint, PaintRoll } from '@styled-icons/boxicons-solid'
import { Button, Form, Modal } from 'react-bootstrap'
import { useState } from 'react';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';

export default function SpecialProductPage() {

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
        Swal.fire({
            title: 'Berhasil!',
            text: 'Produk telah ditambahkan',
            icon: 'success',
        })

        handleClose();
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

    return (
        <div>
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Produk Spesial</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">List Produk Spesial</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className='mt-3 mt-lg-5 mb-3'>List Produk Spesial</h3>

            {/* Modal Create Product  */}
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>Tambah Produk</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="product_name">
                            <Form.Label>Nama Produk</Form.Label>
                            <Form.Control type="text" placeholder="Nama Produk" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="product_code">
                            <Form.Label>Kode Produk</Form.Label>
                            <Form.Control type="text" placeholder="Kode Produk" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Harga</Form.Label>
                            <Form.Control type="number" placeholder="Harga" />
                        </Form.Group>
                        <Form.Group controlId="image" className="mb-3">
                            <Form.Label>Gambar</Form.Label>
                            <Form.Control type="file" />
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
                                        <th>Link URL</th>
                                        <th>Generator</th>
                                        <th className='text-center'>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>
                                            <img src="https://ae01.alicdn.com/kf/H3af1e6c21bcc4cd9a7ab4d884aa373f3F/Buku-Catatan-Tangan-Notebook-Cherry-Blossom-A6-Gesper-Magnetik-Buku-Harian-Anak-Perempuan-Buku-Catatan-Lucu.jpg" width={80} className='img-thumbnail' alt="" />
                                        </td>
                                        <td>Cherry Blossoms</td>
                                        <td>SNMT-261</td>
                                        <td>RP10.000</td>
                                        <td><a href="https://google.com">https://some-http-url.com</a></td>
                                        <td>
                                            <button className='btn btn-sm btn-warning' onClick={handleShowGenerateLabel}><Barcode className='mr-1' />Generate Label</button>
                                        </td>
                                        <td>
                                            <div className='d-flex justify-content-center align-items-center'>
                                                <button className='btn btn-sm btn-primary' onClick={handleShowEdit}><Edit className='mr-1' />Edit</button>
                                                <button className='btn btn-sm btn-danger mx-1' onClick={handleDeleteProduct}><Trash className='mr-1' />Hapus</button>
                                                <Link to={'/panel/special-product-history'} className='btn btn-sm btn-info'><Spreadsheet className='mr-1' />History</Link>
                                                <button className='btn btn-sm btn-dark ml-1'><PaintRoll className='mr-1' />Custom Tema</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}