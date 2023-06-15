import { Link } from "react-router-dom";
import { Detail, Printer } from '@styled-icons/boxicons-solid'

export default function SpecialProductHistoryPage() {
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
                                <li className="breadcrumb-item">Riwayat Generate Label</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className='mt-3 mt-lg-5 mb-3'>Riwayat Generate label Produk Spesial</h3>

            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-body">
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
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tanggal</th>
                                        <th>Jumlah Generate</th>
                                        <th className='text-center'>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>2023-06-15</td>
                                        <td>2000</td>
                                        <td>
                                            <div className='d-flex justify-content-center align-items-center'>
                                                <Link to={'/panel/special-product-history-detail'} className="btn btn-sm btn-success mr-2"><Detail className="mr-1" /> Lihat</Link>
                                                <a href="https://html.spec.whatwg.org/print.pdf" target="_blank" className="btn btn-sm btn-primary"><Printer className="mr-1" /> Cetak</a>
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