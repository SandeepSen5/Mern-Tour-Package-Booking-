import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import axios from "axios";

export default function PackageDatatables({ rows, setUpdate }) {

    const blockPackage = (title) => {
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
                axios.patch(import.meta.env.VITE_ADMIN_PD_BLOCK_PACKAGES, { title })
                    .then((response) => {
                        Swal.fire(
                            'Blocked!',
                            'Agent has been Blocked.',
                            'success'
                        )
                        setUpdate((prev) => !prev);
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

    const unblockPackage = (title) => {
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
                axios.patch(import.meta.env.VITE_ADMIN_PD_UNBLOCK_PACKAGES, { title })
                    .then((response) => {
                        Swal.fire(
                            'UnBlocked!',
                            'Agent has been UnBlocked.',
                            'success'
                        )
                        setUpdate((prev) => !prev);
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

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 130 },
        { field: 'category', headerName: 'Category', width: 130 },
        { field: 'price', headerName: 'Price', width: 130 },
        {
            field: 'photos', headerName: 'Images', width: 130, renderCell: (params) => {
                return (
                    <div className='userListUser'>
                        <img className='userList' src={"https://www.letsgo.uno/uploads/" + params.row.photos} alt='' />
                    </div>
                )
            }
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
                return (<div className="action flex gap-1">
                    {params.row.status &&
                        < div className="view " >
                            <button onClick={(ev) => { blockPackage(params.row.title) }} className="bg-red-400 rounded-full" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div >
                    }
                    {!params.row.status &&
                        <div className="view ">
                            <button onClick={(ev) => { unblockPackage(params.row.title) }} className=" rounded-2xl " >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                    }
                </div >)
            },
        }
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                disableRowSelectionOnClick
                columns={columns}
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