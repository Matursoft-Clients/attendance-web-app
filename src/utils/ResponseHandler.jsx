import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ResponseHandler = {
    successHandler: (res) => {
        Swal.fire({
            title: 'Berhasil!',
            text: res.data.msg,
            icon: 'success',
        })
    },
    errorHandler: (err) => {
        if (err.response.status == 400) {
            if (typeof err.response.data.message == 'object') {
                toast(`${err.response.data.message[0]}`, {
                    type: 'error',
                });
            } else {
                toast(`${err.response.data.message}`, {
                    type: 'error',
                });
            }
        }
    }
}

export default ResponseHandler