import "./DataTable.scss";
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2'
import axios from "axios";

export default function AgentDatatables({ rows }) {

    const blockagent = (email) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Block!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.patch('/admin/blockagent', { email })
                .then((response) => {
                    Swal.fire(
                        'Blocked!',
                        'Agent has been Blocked.',
                        'success'
                    )
                    location.reload();
                })
                .catch((error) => {
                    Swal.fire(
                        'Failed!',
                        'Agent not Blocked.',
                        'error'
                    )
                });
               
            }
        })
        
    };

    const unBlockagent = (email) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, UnBlock!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.patch('/admin/unblockagent', { email })
                .then((response) => {
                    Swal.fire(
                        'UnBlocked!',
                        'Agent has been UnBlocked.',
                        'success'
                    )
                    location.reload();
                })
                .catch((error) => {
                    Swal.fire(
                        'Failed!',
                        'Agent not UnBloced.',
                        'error'
                    )
                });
               
            }
        })
    
    };

    console.log(rows, "haiiiiiii")
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: false,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 150,
            editable: false,
        },
        {
            field: 'number',
            headerName: 'Number',
            width: 150,
            editable: false,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            editable: false,
            type: 'boolean',
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                console.log(params.row.email, "asdasdasda");
                return <div className="action flex gap-1">
                    < div className="view " >
                        <button onClick={(ev) => { blockagent(params.row.email)  }} className=" rounded-full" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div >
                    <div className="view ">
                        <button onClick={(ev) => { unBlockagent(params.row.email) }} className=" rounded-2xl " >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>
                </div >
            },
        }

    ];

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                className="dataGrid"
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 9,
                        },
                    },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnFilter
                disableDensitySelector
                disableColumnSelector
            />
        </Box>
    );
}







