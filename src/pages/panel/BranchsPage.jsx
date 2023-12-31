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
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import './../../styles/leafletStyle.css'
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import AsyncSelect from 'react-select/async';

export default function BranchsPage() {

    /**
     * State Modal Create Data
     * 
     */
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [address, setAddress] = useState('');
    const [marker, setMarker] = useState([-7.727989, 109.005913])
    const [cityUuid, setCityUuid] = useState(null)

    /**
     * State Main Data
     * 
     */
    const [branches, setBranches] = useState([])
    const [presenceMeterRadius, setPresenceMeterRadius] = useState('')
    const markerRef = useRef(null)

    /**
     * State Modal Edit Data
     * 
     */
    const [showEdit, setShowEdit] = useState(false);
    const [branchObjEdit, setBranchObjEdit] = useState('')
    const [markerEdit, setMarkerEdit] = useState([-7.727989, 109.005913])

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

    /**
     * Func Modal Edit
     * 
     */
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = (employee) => {
        setBranchObjEdit(employee)
        setMarkerEdit([employee.presence_location_latitude, employee.presence_location_longitude])
        setShowEdit(true)
    };

    /**
     * Render Main Data
     * 
     */
    const columns = [
        {
            name: '#',
            selector: (row, index) => {
                return currentPage == 1 ? index + 1 : (currentRowsPerPage * (currentPage - 1)) + index + 1
            },
            width: '100px'
        },
        {
            name: 'Kode Cabang',
            sortable: true,
            selector: row => row.code,
        },
        {
            name: 'Nama Cabang',
            sortable: true,
            selector: row => row.name,
        },
        {
            name: 'Kabupaten/Kota',
            selector: row => row.city ? row.city.name : '-',
        },
        {
            name: 'Alamat',
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
        loadSettings()
        loadMainData()

        let DefaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
        });

        L.Marker.prototype.options.icon = DefaultIcon;
    }, [])

    const loadOptionsCities = (inputValue, cb) => {
        setTimeout(() => {
            if (inputValue.length > 0) {
                axios.get(APP_CONFIG.API_URL + `branches/get-city/${inputValue}`, {
                    headers: {
                        Authorization: 'Bearer ' + TokenUtil.getApiToken()
                    }
                }).then((res) => {
                    cb(res.data.data.cities.map((e) => {
                        return {
                            value: e.uuid,
                            label: e.name
                        }
                    }))
                }).catch((err) => {
                    ResponseHandler.errorHandler(err)
                })
            }
        }, 500)
    }

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
        axios.get(APP_CONFIG.API_URL + 'branches', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            setBranches(res.data.data.branches)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
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
        axios.post(APP_CONFIG.API_URL + 'branches', {
            name: name,
            code: code,
            city_uuid: cityUuid,
            presence_location_address: address,
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
            setName('')
            setCode('')
            setAddress('')
            setMarker([-7.727989, 109.005913])
            setCityUuid(null)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    const handleUpdateData = () => {
        let obj = Object.assign({}, branchObjEdit)
        obj.presence_location_latitude = markerEdit.length > 0 ? markerEdit[0].toString() : null
        obj.presence_location_longitude = markerEdit.length > 0 ? markerEdit[1].toString() : null

        axios.patch(APP_CONFIG.API_URL + `branches/${branchObjEdit.uuid}`, obj, {
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
            text: "Data Cabang akan terhapus, secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yakin!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(APP_CONFIG.API_URL + `branches/${uuid}`, {
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

    const eventHandlersEdit = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    if (marker.getLatLng().lat && marker.getLatLng().lng) {
                        setMarkerEdit([marker.getLatLng().lat, marker.getLatLng().lng])
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
                                <h5 className="m-b-10">Cabang</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">List Cabang</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create Data  */}
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header>
                    <Modal.Title>Tambah Cabang</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col-lg-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Nama Cabang</Form.Label>
                                    <Form.Control type="text" placeholder='Nama Cabang' value={name} onChange={(event) => { setName(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Kode Cabang</Form.Label>
                                    <Form.Control type="text" placeholder='Kode Cabang' value={code} onChange={(event) => { setCode(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Alamat</Form.Label>
                                    <Form.Control as={'textarea'} placeholder='Alamat' value={address} onChange={(event) => { setAddress(event.target.value) }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Kabupaten/Kota</Form.Label>
                                    <AsyncSelect cacheOptions loadOptions={loadOptionsCities} onChange={(e) => {
                                        setCityUuid(e.value)
                                    }} defaultOptions />
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

            {/* Modal Edit Data  */}
            <Modal show={showEdit} onHide={handleCloseEdit} size="xl">
                <Modal.Header>
                    <Modal.Title>Edit Cabang</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col-lg-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Nama Cabang</Form.Label>
                                    <Form.Control type="text" placeholder='Nama Cabang' value={branchObjEdit.name} onChange={(event) => {
                                        setBranchObjEdit(() => {
                                            let obj = Object.assign({}, branchObjEdit)
                                            obj.name = event.target.value

                                            return obj
                                        })
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Kode Cabang</Form.Label>
                                    <Form.Control type="text" placeholder='Kode Cabang' value={branchObjEdit.code} onChange={(event) => {
                                        setBranchObjEdit(() => {
                                            let obj = Object.assign({}, branchObjEdit)
                                            obj.code = event.target.value

                                            return obj
                                        })
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Alamat</Form.Label>
                                    <Form.Control as={'textarea'} placeholder='Alamat' value={branchObjEdit.presence_location_address} onChange={(event) => {
                                        setBranchObjEdit(() => {
                                            let obj = Object.assign({}, branchObjEdit)
                                            obj.presence_location_address = event.target.value

                                            return obj
                                        })
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Kabupaten/Kota</Form.Label>
                                    <AsyncSelect cacheOptions loadOptions={loadOptionsCities} onChange={(e) => {
                                        setBranchObjEdit(() => {
                                            let obj = Object.assign({}, branchObjEdit)
                                            obj.city_uuid = e.value

                                            return obj
                                        })
                                    }} defaultValue={[{ value: branchObjEdit.city ? branchObjEdit.city.uuid : '', label: branchObjEdit.city ? branchObjEdit.city.name : '' }]} defaultOptions={[{ value: branchObjEdit.city ? branchObjEdit.city.uuid : '', label: branchObjEdit.city ? branchObjEdit.city.name : '' }]} />
                                </Form.Group>
                            </div>
                            <div className="col-lg-6">
                                <Form.Group>
                                    <Form.Label>Lokasi</Form.Label>
                                    {
                                        showEdit ?
                                            <MapContainer center={markerEdit} zoom={20} scrollWheelZoom={true}>
                                                <TileLayer
                                                    attribution="Google Maps"
                                                    url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                                                />
                                                <Marker position={markerEdit} draggable={true} eventHandlers={eventHandlersEdit} ref={markerRef}>

                                                    <Circle
                                                        center={{ lat: markerEdit[0], lng: markerEdit[1] }}
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
                                            <Form.Control type="number" placeholder='Latitude' value={markerEdit[0]} onChange={(event) => {
                                                if (event.target.value && event.target.value != '-') {
                                                    setMarkerEdit([event.target.value, markerEdit[1]])
                                                }
                                            }} />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Longitude</Form.Label>
                                            <Form.Control type="number" placeholder='Longitude' value={markerEdit[1]} onChange={(event) => {
                                                if (event.target.value && event.target.value != '-') {
                                                    setMarkerEdit([markerEdit[0], event.target.value])
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
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateData}>
                        <Save /> Update
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Modal Edit Data */}

            {/* Modal Show Location  */}
            <Modal show={showModalLocation} onHide={handleCloseModalViewLocation} size="xl">
                <Modal.Header>
                    <Modal.Title>Cabang</Modal.Title>
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
                    <h3 className='mt-3 mb-3'>List Cabang</h3>
                </div>
                <div className="col">
                    <button type='button' onClick={handleShow} className="btn btn-success d-flex align-items-center justify-content-center" style={{ gap: '.3rem' }}><Plus /> Tambah Cabang</button>

                    <div className="card mt-3">
                        <div className="card-body">
                            <DataTableExtensions
                                columns={columns}
                                data={branches}
                                export={false}
                                print={false}
                                filterPlaceholder={'Cari'}
                            >
                                <DataTable
                                    fixedHeader={true}
                                    fixedHeaderScrollHeight={'550px'}
                                    customStyles={tableCustomStyles}
                                    columns={columns}
                                    data={branches}
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