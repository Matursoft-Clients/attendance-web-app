import { Plus } from '@styled-icons/entypo'
import { Edit, Trash, Save, MapPin } from '@styled-icons/boxicons-solid'
import { Button, Form, Modal } from 'react-bootstrap'
import { useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2'
import axios from 'axios';
import APP_CONFIG from '../../utils/APP_CONFIG';
import TokenUtil from '../../utils/TokenUtil';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../styles/tableCustomStyles';
import { ToastContainer } from 'react-toastify';
import ResponseHandler from '../../utils/ResponseHandler';
import DateUtil from '../../utils/DateUtil';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import './../../styles/leafletStyle.css'



export default function CustomAttendanceLocationsPage() {

    const [show, setShow] = useState(false);
    const [showModalLocation, setShowModalLocation] = useState(false);
    const [customAttendances, setCustomAttendances] = useState([])
    const [employees, setEmployees] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [presenceLocationAddress, setPresenceLocationAddress] = useState('')
    const [marker, setMarker] = useState([-7.727989, 109.005913])
    const [employeeUuid, setEmployeeUuid] = useState('')
    const [latitudeView, setLatitudeView] = useState(0)
    const [longitudeView, setLongitudeView] = useState(0)
    const markerRef = useRef(null)
    const [presenceMeterRadius, setPresenceMeterRadius] = useState('')

    const columns = [
        {
            name: '#',
            selector: (row, index) => {
                return index + 1
            },
            width: '100px'
        },
        {
            name: 'Karyawan',
            selector: row => row.employee.name,
        },
        {
            name: 'Tanggal Awal',
            selector: row => DateUtil.formatYmdFromDate(row.start_date),
        },
        {
            name: 'Tanggal Akhir',
            selector: row => DateUtil.formatYmdFromDate(row.end_date),
        },
        {
            name: 'Alamat Absensi',
            selector: row => row.presence_location_address,
        },
        {
            name: 'Lokasi Absensi',
            cell: (row) => {
                return (
                    <button className='btn btn-sm btn-success d-flex align-items-center justify-content-center' onClick={() => {
                        handleShowModalViewLocation(row.presence_location_latitude, row.presence_location_longitude)
                    }} style={{ gap: '5px' }}><MapPin /> Lihat Lokasi</button>
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
        loadEmployees()
        loadSettings()
        let DefaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
        });

        L.Marker.prototype.options.icon = DefaultIcon;
    }, [])

    const loadSettings = () => {
        axios.get(APP_CONFIG.API_URL + 'settings', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            const settings = res.data.data.settings

            setPresenceMeterRadius(settings.presence_meter_radius)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    const loadMainData = () => {
        axios.get(APP_CONFIG.API_URL + 'custom-attendance-locations', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setCustomAttendances(res.data.data.customAttendanceLocations)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    const loadEmployees = () => {
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

    const _renderChooseKaryawan = () => {
        if (employees) {
            return employees.map((e) => {
                return (
                    <option value={e.uuid}>{e.name}</option>
                )
            })
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseModalViewLocation = () => setShowModalLocation(false);
    const handleShowModalViewLocation = (latitude, longitude) => {
        setLatitudeView(latitude)
        setLongitudeView(longitude)
        setShowModalLocation(true)
    };

    const handleSaveData = () => {
        axios.post(APP_CONFIG.API_URL + 'custom-attendance-locations', {
            employee_uuid: employeeUuid,
            start_date: startDate,
            end_date: endDate,
            presence_location_address: presenceLocationAddress,
            presence_location_latitude: marker.length > 0 ? marker[0] : null,
            presence_location_longitude: marker.length > 0 ? marker[1] : null,
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

    const handleDeleteData = (uuid) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Data Lokasi Absen Kustom akan terhapus, secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yakin!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(APP_CONFIG.API_URL + `custom-attendance-locations/${uuid}`, {
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

    const onDragMap = (e) => {
        setMarker(e.latlng);
        console.log(e)
    }

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    if (marker.getLatLng().lat && marker.getLatLng().lng) {
                        setMarker([marker.getLatLng().lat, marker.getLatLng().lng])
                    }
                }
            },
        }),
        [],
    )

    return (
        <div>
            <ToastContainer />
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Lokasi Absen Kustom</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">List Lokasi Absen Kustom</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create Data  */}
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header>
                    <Modal.Title>Tambah Lokasi Absen Kustom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col-lg-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Karyawan</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(e) => { setEmployeeUuid(e.target.value) }}>
                                        <option selected value={''} disabled>Pilih Karyawan</option>
                                        {_renderChooseKaryawan()}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tanggal Awal</Form.Label>
                                    <Form.Control type="date" onChange={(event) => { setStartDate(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tanggal Akhir</Form.Label>
                                    <Form.Control type="date" onChange={(event) => { setEndDate(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Alamat</Form.Label>
                                    <Form.Control as={'textarea'} placeholder='Alamat' onChange={(event) => { setPresenceLocationAddress(event.target.value) }} />
                                </Form.Group>
                            </div>
                            <div className="col-lg-6">
                                <Form.Group>
                                    <Form.Label>Lokasi</Form.Label>
                                    {
                                        show ?
                                            <MapContainer center={marker} zoom={20} scrollWheelZoom={true}>
                                                <TileLayer
                                                    attribution="Google Maps"
                                                    url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                                                />
                                                <Marker position={marker} draggable={true} eventHandlers={eventHandlers} ref={markerRef}>

                                                    <Circle
                                                        center={{ lat: marker[0], lng: marker[1] }}
                                                        fillColor="red"
                                                        radius={presenceMeterRadius}>

                                                    </Circle>
                                                </Marker>
                                            </MapContainer> : <></>
                                    }
                                </Form.Group>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Latitude</Form.Label>
                                            <Form.Control type="number" placeholder='Latitude' value={marker[0]} onChange={(event) => {
                                                if (event.target.value && event.target.value != '-') {
                                                    setMarker([event.target.value, marker[1]])
                                                }
                                            }} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Longitude</Form.Label>
                                            <Form.Control type="number" placeholder='Longitude' value={marker[1]} onChange={(event) => {
                                                if (event.target.value && event.target.value != '-') {
                                                    setMarker([marker[0], event.target.value])
                                                }
                                            }} />
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                        </div>
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

            {/* Modal Show Location  */}
            <Modal show={showModalLocation} onHide={handleCloseModalViewLocation} size="xl">
                <Modal.Header>
                    <Modal.Title>Lokasi Absen Kustom</Modal.Title>
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
                                    <Marker position={[latitudeView, longitudeView]} ondrag={onDragMap}>

                                        <Circle
                                            center={{ lat: latitudeView, lng: longitudeView }}
                                            fillColor="red"
                                            radius={presenceMeterRadius}>

                                        </Circle>
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

            <div className="row">
                <div className="col-12">
                    <h3 className='mt-3 mb-3'>List Lokasi Absen Kustom</h3>
                </div>
                <div className="col">
                    <button type='button' onClick={handleShow} className="btn btn-success d-flex align-items-center justify-content-center" style={{ gap: '.3rem' }}><Plus /> Tambah Lokasi Absen Kustom</button>

                    <div className="card mt-3">
                        <div className="card-body">
                            <DataTable
                                fixedHeader={true}
                                fixedHeaderScrollHeight={'550px'}
                                customStyles={tableCustomStyles}
                                columns={columns}
                                data={customAttendances}
                                pagination
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}