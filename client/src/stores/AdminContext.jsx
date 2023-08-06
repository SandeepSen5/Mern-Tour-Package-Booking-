import { useEffect } from "react";
import { createContext, useState } from "react";
import axios from "axios";
export const AdminContext = createContext({});
export function AdminContextProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [adminready, setAdminReady] = useState(false);

    useEffect(() => {
        if (!admin) {
            axios.get('/admin/profile').then(({ data }) => {
                console.log(data,"admininfo")
                setAdmin(data);
                setAdminReady(true);
            })
        }
    }, [])
    return (
        <AdminContext.Provider value={{ admin, setAdmin, adminready, setAdminReady }} >
            {children}
        </AdminContext.Provider>
    )
}


