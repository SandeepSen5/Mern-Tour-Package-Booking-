import * as React from 'react';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";

const userSchema = yup.object().shape({
    name: yup.string().required("Name is required").trim(), // Adding .trim() to remove leading/trailing whitespaces
    email: yup.string().email("Invalid email format").required("Email is required").trim(),
    number: yup
        .string()
        .required("Number is required")
        .min(10, "Number must be 10 characters")
        .max(10, "Number can't exceed 10 characters")
        .trim(),
})
    .test('blank-check', 'Please fill out all fields.', (values) => {
        // Check if any of the fields are blank (empty or whitespace-only)
        return Object.values(values).every((value) => value.trim() !== '');
    });


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {

    const notify = (error) => toast.info(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    const [value, setValue] = React.useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [oldpassword, setPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get('/getuserdetails').then((response) => {
            setName(response.data.name);
            setEmail(response.data.email);
            setNumber(response.data.number);
        })

    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await userSchema.validate({ name, email, number }, { abortEarly: false });
            await axios.post('/updateuser', {
                name, email, number
            });
            notify("Update Successfully")

        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            } else {
                notify(error.response.data);
            }
        }
    }

    async function registerPassword(ev) {
        ev.preventDefault();
        try {
            await axios.post('/updatepassword', {
                oldpassword, newpassword, confirmpassword
            });
            notify("Update Successfully")
           
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            } else {
                notify(error.response.data);
            }
        }
    }

    return (
        <div className="mx-20">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Profile Update" {...a11yProps(0)} />
                        <Tab label="Password Update" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <h1 className='text-2xl m-2 text-green-600 font-bold'># Profile Update</h1>
                    <form className="max-w-md mx-auto" onSubmit={registerUser}>
                        <input type="text" placeholder="Name"
                            value={name}
                            onChange={(ev) => setName(ev.target.value)} />
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                        <input type="email" placeholder="Email"
                            value={email}
                            onChange={(ev) => setEmail(ev.target.value)} />
                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                        <input type="text" placeholder="Phone Number"
                            value={number}
                            onChange={(ev) => setNumber(ev.target.value)} />
                        {errors.number && <div className="text-red-500">{errors.number}</div>}
                        <button className="primary">Save</button>
                    </form>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <form className="max-w-md mx-auto" onSubmit={registerPassword}>
                        <input type="password" placeholder="Enter Password"
                            value={oldpassword}
                            onChange={(ev) => setPassword(ev.target.value)} />
                        <input type="password" placeholder="New Password"
                            value={newpassword}
                            onChange={(ev) => setNewPassword(ev.target.value)} />
                        <input type="password" placeholder="confirm Password"
                            value={confirmpassword}
                            onChange={(ev) => setConfirmPassword(ev.target.value)} />
                        <button className="primary">Save</button>
                    </form>
                </CustomTabPanel>
            </Box>
            <ToastContainer />
        </div>
    );
}

