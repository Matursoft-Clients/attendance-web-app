import { useEffect, useState } from 'react';
import axios from 'axios';
import APP_CONFIG from '../../utils/APP_CONFIG';
import TokenUtil from '../../utils/TokenUtil';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../styles/tableCustomStyles';
import { ToastContainer } from 'react-toastify';
import ResponseHandler from '../../utils/ResponseHandler';
import DateUtil from '../../utils/DateUtil';

export default function DailyAttendancesPage() {

    const [dailyAttendances, setDailyAttendances] = useState([])

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
            name: 'Status Absen Masuk',
            selector: row => row.presence_entry_status,
        },
        {
            name: 'Status Absen Pulang',
            selector: row => row.presence_exit_status ? row.presence_exit_status : 'Belum Pulang',
        },
        {
            name: 'Tanggal',
            selector: (row) => {
                return DateUtil.formatYmdHisFromDate(row.date)
            },
        }
    ];

    useEffect(() => {
        loadMainData()
    }, [])

    const loadMainData = () => {
        axios.get(APP_CONFIG.API_URL + 'daily-attendances?status=today', {
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

            <h3 className='mt-3 mt-lg-5 mb-3'>List Absen Harian</h3>

            <div className="row">
                <div className="col">
                    <div className="card mt-3">
                        <div className="card-body">
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