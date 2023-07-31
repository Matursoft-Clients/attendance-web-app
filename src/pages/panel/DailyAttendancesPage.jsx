import { useEffect, useState } from 'react';
import axios from 'axios';
import APP_CONFIG from '../../utils/APP_CONFIG';
import TokenUtil from '../../utils/TokenUtil';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../styles/tableCustomStyles';
import { ToastContainer } from 'react-toastify';
import ResponseHandler from '../../utils/ResponseHandler';
import DateUtil from '../../utils/DateUtil';
import { CSVLink } from "react-csv";
import { FiletypeCsv, Filter } from '@styled-icons/bootstrap'
import { MapPin } from '@styled-icons/boxicons-solid'
import { Button, Form, Modal } from 'react-bootstrap'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import './../../styles/leafletStyle.css'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

export default function DailyAttendancesPage() {

    const [dailyAttendances, setDailyAttendances] = useState([])
    const [arrCSVDownload, setArrCsvDownload] = useState([])
    const [startDate, setStartDate] = useState(`${DateUtil.formatYmdFromDate(new Date())}`)
    const [endDate, setEndDate] = useState(`${DateUtil.formatYmdFromDate(new Date())}`)
    const [status, setStatus] = useState('today')

    /**
     * State View Modal Location
     * 
     */
    const [latitudeView, setLatitudeView] = useState(0)
    const [longitudeView, setLongitudeView] = useState(0)
    const [showModalLocation, setShowModalLocation] = useState(false);

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
            name: 'Karyawan',
            sortable: true,
            selector: row => row.employee.name,
        },
        {
            name: 'NRP',
            selector: row => row.employee.nrp,
        },
        {
            name: 'Jam Absen Masuk',
            sortable: true,
            center: true,
            selector: row => row.presence_entry_hour ? row.presence_entry_hour : '-',
        },
        {
            name: 'Lokasi Absen Masuk',
            center: true,
            selector: (row) => {
                return row.presence_entry_latitude && row.presence_entry_longitude ?
                    <button className='btn btn-sm btn-success d-flex align-items-center justify-content-center' onClick={() => {
                        handleShowModalViewLocation(row.presence_entry_latitude, row.presence_entry_longitude)
                        setShowModalLocation('Absen Masuk')
                    }} ><MapPin /> Lihat Lokasi</button>
                    : <>-</>
            }
        },
        {
            name: 'Status Absen Masuk',
            center: true,
            selector: (row) => {
                let color = ''

                if (row.presence_entry_status == 'on_time') {
                    color = 'success'
                } else if (row.presence_entry_status == 'late') {
                    color = 'danger'
                } else if (row.presence_entry_status == 'not_present') {
                    color = 'light'
                } else if (row.presence_entry_status == 'not_valid') {
                    color = 'dark'
                }

                return color ? <div className={`badge text-md bg-${color}`}>{row.presence_entry_status.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</div> : '-'
            }
        },
        {
            name: 'Jam Absen Pulang',
            center: true,
            sortable: true,
            selector: row => row.presence_exit_hour ? row.presence_exit_hour : '-',
        },
        {
            name: 'Lokasi Absen Pulang',
            center: true,
            selector: (row) => {
                return row.presence_exit_latitude && row.presence_exit_longitude ?
                    <button className='btn btn-sm btn-success d-flex align-items-center justify-content-center' onClick={() => {
                        handleShowModalViewLocation(row.presence_exit_latitude, row.presence_exit_longitude)
                        setShowModalLocation('Absen Pulang')
                    }} ><MapPin /> Lihat Lokasi</button>
                    : <>-</>
            }
        },
        {
            name: 'Status Absen Pulang',
            center: true,
            selector: (row) => {
                let color = ''

                if (row.presence_exit_status == 'on_time') {
                    color = 'success'
                } else if (row.presence_exit_status == 'late') {
                    color = 'danger'
                } else if (row.presence_exit_status == 'not_present') {
                    color = 'light'
                } else if (row.presence_exit_status == 'not_valid') {
                    color = 'dark'
                }

                return color ? <div className={`badge text-md bg-${color}`}>{row.presence_exit_status.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</div> : '-'
            }
        },
        {
            name: 'Tanggal',
            center: true,
            sortable: true,
            selector: (row) => {
                return DateUtil.formatYmdFromDate(row.date)
            },
        }
    ];

    const handleCloseModalViewLocation = () => setShowModalLocation(false);
    const handleShowModalViewLocation = (latitude, longitude) => {
        setLatitudeView(latitude)
        setLongitudeView(longitude)
    };

    const loadCsvData = () => {
        if (dailyAttendances) {
            let arrCSVDownloadTemp = [
                [
                    'Karyawan', 'NRP', 'Jam Absen Masuk', 'Latitude Absen Masuk', 'Longitude Absen Masuk', 'Status Absen Masuk', 'Jam Absen Pulang', 'Latitude Absen Pulang', 'Longitude Absen Pulang', 'Status Absen Pulang', 'Tanggal'
                ]
            ]

            dailyAttendances.forEach((e) => {
                arrCSVDownloadTemp.push([
                    e.employee.name,
                    e.employee.nrp,
                    e.presence_entry_hour,
                    e.presence_entry_latitude,
                    e.presence_entry_longitude,
                    e.presence_entry_status,
                    e.presence_exit_hour,
                    e.presence_exit_latitude,
                    e.presence_exit_longitude,
                    e.presence_exit_status,
                    e.date,
                ]);
            });

            setArrCsvDownload(arrCSVDownloadTemp)
        }
    }

    useEffect(() => {
        loadMainData()

        let DefaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
        });

        L.Marker.prototype.options.icon = DefaultIcon;
    }, [])

    useEffect(() => {
        loadCsvData()
    }, [dailyAttendances])

    const loadMainData = () => {
        axios.get(APP_CONFIG.API_URL + `daily-attendances?status=${status}&start_date=${startDate}&end_date=${endDate}`, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setDailyAttendances(res.data.data.dailyAttendances)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })

    }

    return (
        <div>
            {/* Modal Show Location  */}
            <Modal show={showModalLocation} onHide={handleCloseModalViewLocation} size="xl">
                <Modal.Header>
                    <Modal.Title>Lokasi {showModalLocation}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Lokasi</Form.Label>
                        {
                            showModalLocation ?
                                <MapContainer center={[latitudeView, longitudeView]} zoom={20} scrollWheelZoom={true}>
                                    <TileLayer
                                        attribution="Google Maps"
                                        url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                                    />
                                    <Marker position={[latitudeView, longitudeView]} >
                                    </Marker>
                                </MapContainer> : <></>
                        }
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalViewLocation}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Modal Show Location */}

            <ToastContainer />
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Absen Harian</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">List Absen Harian</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col-12">
                    <h3 className='mt-3 mb-3'>List Absen Harian</h3>
                </div>
                <div className="col">
                    <div className="card mt-3">
                        <div className="card-body">

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <div className="form-group">
                                                <label htmlFor="status">Jenis</label>
                                                <select name="status" defaultValue={status} value={status} onChange={(event) => {
                                                    setStatus(event.target.value)
                                                }} id="status" className='form-control'>
                                                    <option value="today">Hari Ini</option>
                                                    <option value="date_range">Range Tanggal</option>
                                                </select>
                                            </div>
                                        </div>
                                        {
                                            status == 'date_range' ?
                                                <>
                                                    <div className="col-lg-3">
                                                        <div className="form-group">
                                                            <label htmlFor="start_date">Tanggal Awal</label>
                                                            <input type="date" name="start_date" className='form-control' id="start_date" value={startDate} onChange={(event) => {
                                                                setStartDate(event.target.value)
                                                            }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="form-group">
                                                            <label htmlFor="end_date">Tanggal Akhir</label>
                                                            <input type="date" name="end_date" className='form-control' id="end_date" value={endDate} onChange={(event) => {
                                                                setEndDate(event.target.value)
                                                            }} />
                                                        </div>
                                                    </div>
                                                </> : <></>
                                        }
                                        <div className="col-lg-3">
                                            <div className="form-group">
                                                <label htmlFor="end_date">&nbsp;</label><br />
                                                <button onClick={() => {
                                                    loadMainData()
                                                }} className='btn btn-dark'><Filter /> Filter</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className='d-flex justify-content-end'>
                                        <div className='btn btn-sm btn-success ' style={{ gap: '3px' }}>
                                            <CSVLink filename={`daily_attendance-${status == 'today' ? DateUtil.formatYmdFromDate(new Date()) : `${startDate}~${endDate}`}.csv`} data={arrCSVDownload} style={{ color: 'white' }}>
                                                <FiletypeCsv className='mr-1' />
                                                Download CSV</CSVLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DataTableExtensions
                                columns={columns}
                                data={dailyAttendances}
                                export={false}
                                print={false}
                                filterPlaceholder={'Cari'}
                            >
                                <DataTable
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight={'550px'}
                                    customStyles={tableCustomStyles}
                                    columns={columns}
                                    data={dailyAttendances}
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