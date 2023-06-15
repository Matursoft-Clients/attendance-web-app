import Accordion from 'react-bootstrap/Accordion';
import { Link } from 'react-router-dom';
import { Printer } from 'styled-icons/boxicons-solid';

export default function SpecialProductHistoryDetailPage() {
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
                                <li className="breadcrumb-item"><Link to={'/panel/special-product'}>List Produk Spesial</Link></li>
                                <li className="breadcrumb-item"><Link to={'/panel/special-product-history'}>Riwayat Generate Label</Link></li>
                                <li className="breadcrumb-item">Detail Generate Label 2023-06-15</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className='mt-3 mt-lg-5 mb-3'>Detail Generate Label 2023-06-15</h3>

            <div className="card">
                <div className="card-body">
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
            </div>

            <h3 className='mt-3 mt-lg-1 mb-3'>List Generate Label 2023-06-15</h3>

            <div className="row">
                <div className="col">
                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <div className='mr-2'>
                                    <span className="badge badge-primary badge-pill">1</span>
                                </div>
                                <b className='text-primary'>12:25:31</b>
                            </Accordion.Header>
                            <Accordion.Body>
                                <table className="table table-bordered ">
                                    <thead className='thead-dark'>
                                        <tr>
                                            <th>#</th>
                                            <th>SN</th>
                                            <th>QR</th>
                                            <th className='text-center'>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>SNMT-261-2002712732173798</td>
                                            <td><img src="https://socs.binus.ac.id/files/2018/12/aswin-1.jpg" alt="qr" className="img-thumbnail" width={70} /></td>
                                            <td className='text-center'>
                                                <a href="https://html.spec.whatwg.org/print.pdf" target="_blank" className="btn btn-sm btn-primary"><Printer className="mr-1" /> Cetak</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <div className='mr-2'>
                                    <span className="badge badge-primary badge-pill">2</span>
                                </div>
                                <b className='text-primary'>13:45:11</b>
                            </Accordion.Header>
                            <Accordion.Body>
                                <table className="table table-bordered ">
                                    <thead className='thead-dark'>
                                        <tr>
                                            <th>#</th>
                                            <th>SN</th>
                                            <th>QR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>SNMT-261-2002712732173798</td>
                                            <td><img src="https://socs.binus.ac.id/files/2018/12/aswin-1.jpg" alt="qr" className="img-thumbnail" width={70} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </div>
    )
}