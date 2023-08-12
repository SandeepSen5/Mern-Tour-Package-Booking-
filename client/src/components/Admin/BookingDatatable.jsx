import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function BookingDatatable({ rows }) {

    function makeRequest(id, status) {
        console.log(id, 'idididid');
        console.log(status, 'statusidididid');
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 130 },
        { field: 'guestno', headerName: 'Guest No', width: 130 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'orderstatus', headerName: 'Payment Status', width: 130 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'total', headerName: 'Total Price', width: 130 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <select
                    value={params.row.status}
                    onChange={(e) => {
                        params.api.setEditCellValue({
                            id: params.id,
                            field: 'status',
                            value: e.target.value,
                        });
                        makeRequest(params.row.keyid, e.target.value)
                    }}
                >
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
        </div>
    );
}

