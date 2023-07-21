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

export default function DailyAttendancesPage() {

    const [dailyAttendances, setDailyAttendances] = useState([])
    const [arrCSVDownload, setArrCsvDownload] = useState([])
    const [startDate, setStartDate] = useState(`${DateUtil.formatYmdFromDate(new Date())}`)
    const [endDate, setEndDate] = useState(`${DateUtil.formatYmdFromDate(new Date())}`)
    const [status, setStatus] = useState('today')

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
            name: 'Jam Absen Masuk',
            selector: row => row.presence_entry_hour ? row.presence_entry_hour : '-',
        },
        {
            name: 'Status Absen Masuk',
            selector: row => row.presence_entry_status ? row.presence_entry_status.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : '-',
        },
        {
            name: 'Jam Absen Pulang',
            selector: row => row.presence_exit_hour ? row.presence_exit_hour : '-',
        },
        {
            name: 'Status Absen Pulang',
            selector: row => row.presence_exit_status ? row.presence_exit_status.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : '-',
        },
        {
            name: 'Tanggal',
            selector: (row) => {
                return DateUtil.formatYmdHisFromDate(row.date)
            },
        }
    ];

    const loadCsvData = () => {
        if (dailyAttendances) {
            let arrCSVDownloadTemp = [
                [
                    'Karyawan', 'Jam Absen Masuk', 'Status Absen Masuk', 'Jam Absen Pulang', 'Status Absen Pulang', 'Tanggal'
                ]
            ]

            dailyAttendances.forEach((e) => {
                arrCSVDownloadTemp.push([
                    e.employee.name,
                    e.presence_entry_hour,
                    e.presence_entry_status,
                    e.presence_exit_hour,
                    e.presence_exit_status,
                    e.date,
                ]);
            });

            setArrCsvDownload(arrCSVDownloadTemp)
        }
    }

    useEffect(() => {
        loadMainData()
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

                            <DataTable
                                customStyles={tableCustomStyles}
                                columns={columns}
                                data={dailyAttendances}
                                pagination
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}