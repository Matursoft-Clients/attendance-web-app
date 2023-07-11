import { Save } from 'styled-icons/boxicons-solid'
import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import APP_CONFIG from '../../utils/APP_CONFIG'
import TokenUtil from '../../utils/TokenUtil'
import ResponseHandler from '../../utils/ResponseHandler'
import { MapContainer, Marker, Popup, TileLayer, Circle, CircleMarker } from 'react-leaflet'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import './../../styles/leafletStyle.css'

export default function SettingsPage() {

    const [uuid, setUuid] = useState('')
    const [officeName, setOfficeName] = useState('')
    const [officeLogo, setOfficeLogo] = useState('')
    const [presenceEntryStart, setPresenceEntryStart] = useState('')
    const [presenceEntryEnd, setPresenceEntryEnd] = useState('')
    const [presenceExit, setPresenceExit] = useState('')
    const [presenceAddress, setPresenceAddress] = useState('')
    const [presenceMeterRadius, setPresenceMeterRadius] = useState('')
    const [marker, setMarker] = useState([])
    const [officeLogoObj, setOfficeLogoObj] = useState()
    const markerRef = useRef(null)

    useEffect(() => {
        loadSettings()

        loadIcon()
    }, [])

    const loadIcon = () => {
        let DefaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
        });

        L.Marker.prototype.options.icon = DefaultIcon;
    }

    const doUpdate = () => {

        const formData = new FormData
        formData.append('office_name', officeName)
        if (officeLogoObj) {
            formData.append('office_logo', officeLogoObj)
        }
        formData.append('presence_entry_start', presenceEntryStart.length == 5 ? `${presenceEntryStart}:00` : presenceEntryStart)
        formData.append('presence_entry_end', presenceEntryEnd.length == 5 ? `${presenceEntryEnd}:00` : presenceEntryEnd)
        formData.append('presence_exit', presenceExit.length == 5 ? `${presenceExit}:00` : presenceExit)
        formData.append('presence_location_address', presenceAddress)
        formData.append('presence_meter_radius', presenceMeterRadius)
        formData.append('presence_location_latitude', marker[0])
        formData.append('presence_location_longitude', marker[1])

        axios.patch(APP_CONFIG.API_URL + 'settings/' + uuid, formData, {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken(),
                "Content-Type": "multipart/form-data",
            }
        }).then((res) => {
            ResponseHandler.successHandler(res)
            loadSettings()
            setTimeout(() => {
                window.location.reload()
            }, 500);
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
    }

    const loadSettings = () => {
        axios.get(APP_CONFIG.API_URL + 'settings', {
            headers: {
                Authorization: 'Bearer ' + TokenUtil.getApiToken()
            }
        }).then((res) => {
            const settings = res.data.data.settings

            setMarker([settings.presence_location_latitude, settings.presence_location_longitude])
            setOfficeName(settings.office_name)
            setPresenceEntryStart(settings.presence_entry_start)
            setPresenceEntryEnd(settings.presence_entry_end)
            setPresenceExit(settings.presence_exit)
            setPresenceAddress(settings.presence_location_address)
            setPresenceMeterRadius(settings.presence_meter_radius)
            setOfficeLogo(settings.office_logo)
            setUuid(settings.uuid)
        }).catch((err) => {
            ResponseHandler.errorHandler(err)
        })
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
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Pengaturan</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">Pengaturan</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col">
                    <h3 className='mt-3 mb-3'>Edit Pengaturan</h3>
                    <div className="card">
                        <div className="card-body">
                            <form action="">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="office_name">Nama Perusahaan</label>
                                            <input type="text" name="office_name" id="office_name" className='form-control' placeholder='Nama Perusahaan' value={officeName} onChange={(e) => setOfficeName(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <img className="img-fluid wid-80" src={officeLogo ? officeLogo : require('./../../assets/images/samples/no-image.jpg')} alt="User image" />
                                            <br />
                                            <label className='mt-2' htmlFor="office_logo">Logo Perusahaan</label>
                                            <input type="file" name="office_logo" id="office_logo" accept='image/*' className='form-control' onChange={(e) => {
                                                let file = e.target.files[0]
                                                setOfficeLogoObj(file)
                                                setOfficeLogo(URL.createObjectURL(file))
                                            }} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="presence_entry_start">Jam Masuk Awal</label>
                                            <input type="time" name="presence_entry_start" id="presence_entry_start" className='form-control' placeholder='Jam Masuk Awal' value={presenceEntryStart} onChange={(e) => { setPresenceEntryStart(e.target.value) }} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="presence_entry_end">Jam Masuk Akhir</label>
                                            <input type="time" name="presence_entry_end" id="presence_entry_end" className='form-control' placeholder='Jam Masuk Akhir' value={presenceEntryEnd} onChange={(e) => { setPresenceEntryEnd(e.target.value) }} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="presence_exit">Jam Pulang</label>
                                            <input type="time" name="presence_exit" id="presence_exit" className='form-control' placeholder='Jam Masuk Akhir' value={presenceExit} onChange={(e) => { setPresenceExit(e.target.value) }} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="presence_location_address">Alamat Absensi</label>
                                            <textarea name="presence_location_address" id="presence_location_address" className='form-control' style={{ height: '200px' }} placeholder='Alamat Absensi' cols="30" rows="10" value={presenceAddress} onChange={(e) => { setPresenceAddress(e.target.value) }} ></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Lokasi Absensi</label>
                                            {
                                                marker.length > 0 ?
                                                    <MapContainer center={marker} zoom={20} scrollWheelZoom={true}>
                                                        <TileLayer
                                                            attribution="Google Maps"
                                                            url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                                                        />
                                                        <Marker position={marker} draggable={true} eventHandlers={eventHandlers} ref={markerRef}>
                                                            <Popup>
                                                                A pretty CSS3 popup. <br /> Easily customizable.
                                                            </Popup>
                                                            <Circle
                                                                center={{ lat: marker[0], lng: marker[1] }}
                                                                fillColor="red"
                                                                radius={presenceMeterRadius}>
                                                                <Popup>
                                                                    A pretty CSS3 popup. <br /> Easily customizable.
                                                                </Popup>
                                                            </Circle>
                                                        </Marker>
                                                    </MapContainer> : <></>
                                            }
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="presence_location_latitude">Latitude</label>
                                                    <input type="text" name="presence_location_latitude" readOnly id="presence_location_latitude" className='form-control' placeholder='Latitude' value={marker[0]} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="presence_location_longitude">Longitude</label>
                                                    <input type="text" name="presence_location_longitude" readOnly id="presence_location_longitude" className='form-control' placeholder='Longitude' value={marker[1]} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="presence_meter_radius">Radius</label>
                                            <input type="text" name="presence_meter_radius" id="presence_meter_radius" className='form-control' placeholder='Radius' value={presenceMeterRadius} onChange={(e) => { setPresenceMeterRadius(e.target.value) }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <button className='btn btn-primary w-100' type='button' onClick={() => { doUpdate() }}><Save /> Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}