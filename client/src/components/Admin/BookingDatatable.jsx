import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BookingDatatable({ rows, setUpdate }) {

    const notify = (error) => toast.success('Update Success!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    function makeRequest(id, status) {
        console.log(id, 'idididid');
        console.log(status, 'statusidididid');
        axios.patch('/admin/bookingstatus', { id, status }).then((response) => {
            notify('Update Success');
            setUpdate((prev) => !prev);
        })
    }


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 130 },
        { field: 'guestno', headerName: 'Guest No', width: 130 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'orderstatus', headerName: 'Payment Status', width: 130 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'total', headerName: 'Total Price', width: 130 },
        { field: 'deliverystatus', headerName: 'Package Staus', width: 130 },
        {
            field: 'status',
            headerName: 'Update Status',
            width: 120,
            renderCell: (params) => (
                <select
                    value=" "
                    onChange={(e) => {
                        params.api.setEditCellValue({
                            id: params.id,
                            field: 'status',
                            value: e.target.value,
                        });
                        makeRequest(params.row.keyid, e.target.value)
                    }}
                >
                    <option value=" " disabled>
                        Select
                    </option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Success">Success</option>
                </select>
            ),
        },
        { field: ' reason', headerName: 'reason', width: 130 },
    ];



    return (
        <div style={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
            <ToastContainer />
        </div>
    );
}

