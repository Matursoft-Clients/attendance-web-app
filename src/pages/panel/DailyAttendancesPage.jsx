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
            name: 'Judul',
            selector: row => row.title,
        },
        {
            name: 'Dibuat Pada',
            selector: (row) => {
                return DateUtil.formatYmdHisFromDate(row.created_at)
            },
        },
        {
            name: 'Aksi',
            cell: (row) => {
                return (
                    <></>
                    // <div className='d-flex justify-content-center align-items-center'>
                    //     <button className='btn btn-sm btn-primary' onClick={() => {
                    //         handleShowEdit(row.uuid)
                    //     }}><Edit className='mr-1' />Edit</button>
                    //     <button className='btn btn-sm btn-danger mx-1' onClick={() => {
                    //         handleDeleteData(row.uuid)
                    //     }}><Trash className='mr-1' />Hapus</button>
                    // </div>
                )
            }
        }
    ];

    useEffect(() => {
        loadMainData()
    }, [])

    const loadMainData = () => {
        axios.get(APP_CONFIG.API_URL + 'daily-attendances', {
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