import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function CategoryDatatables({ rows, setUpdate }) {

    const navigate = useNavigate();
    const blockcategory = (title) => {
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
                axios.patch(import.meta.env.VITE_ADMIN_CD_BLOCKCATEGORY, { title })
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

    const unBlockcategory = (title) => {
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
                axios.patch(import.meta.env.VITE_ADMIN_CD_UNBLOCKCATEGORY, { title })
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

    const editcategory = async (title) => {
        console.log(title);
        await axios.get(import.meta.env.VITE_ADMIN_CD_EDITCATEGORY + `title=${encodeURIComponent(title)}`)
            .then((response) => {
                console.log(response.data);
                navigate(`/admin/category/${response.data._id}`);
            })
    }


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Title', width: 130 },
        { field: 'description', headerName: 'Description', width: 130 },
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
                            <button onClick={(ev) => { blockcategory(params.row.title) }} className="bg-red-400 rounded-full" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div >
                    }
                    {!params.row.status &&
                        <div className="view ">
                            <button onClick={(ev) => { unBlockcategory(params.row.title) }} className=" rounded-2xl " >

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                    }
                    <div className="view ">
                        <button onClick={(ev) => { editcategory(params.row.title) }} className="bg-green-500" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                    </div>
                </div >)
            },
        }
    ];



    return (
        <div style={{ height: 500, width: '100%' }}>
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



