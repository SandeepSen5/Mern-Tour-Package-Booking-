import { Routes, Route } from "react-router-dom";
import './App.css';
import Layout from "./components/User/Layout";
import AgentLayout from "./components/Agent/AgentLayout";
import LoginPage from "./pages/user/LoginPage";
import IndexPages from "./pages/user/IndexPages";
import RegisterPage from "./pages/user/RegisterPage";
import Account from "./pages/user/AccountPage"
import AgentLogin from "./pages/Agents/AgentLogin";
import AgentRegister from "./pages/Agents/AgentRegister";
import AgentProfile from "./pages/Agents/AgentProfile"
import AdminHome from "./pages/Admin/Home/AdminHome";
import axios from "axios";
import { UserContextProvider } from "./stores/UserContext";
import { AgentContextProvider } from "./stores/AgentContext"
import { AdminContextProvider } from "./stores/AdminContext";
import PlacesPage from "./pages/Agents/PlacesPage";
import PlacesFormpage from "./pages/Agents/PlacesFormpage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminUser from "./pages/Admin/UserManagement/AdminUser";
import AdminLogin from "./pages/Admin/AdminLogin"
import AdminAgent from "./pages/Admin/AgentManagement/AdminAgent"
import SinglePackage from "./pages/user/SinglePackage";
import Payments from "./pages/user/Payment";
import Success from "./pages/user/Success";
import CategoryPage from "./pages/Admin/CategoryPage";
import CategoryList from "./pages/Admin/CategoryList";
import BookingList from "./pages/user/BookingsList";
import AdminBooking from "./pages/Admin/Booking Management/AdminBooking";
import AdminPackage from "./pages/Admin/PackageManagement/AdminPackage";
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <AgentContextProvider>
        <AdminContextProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<IndexPages />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<Account />} />
              <Route path="/favourites" element={<Account />} />
              <Route path="/contact" element={<Account />} />
              <Route path="/package/:id" element={<SinglePackage />} />
              <Route path="/payment/:id" element={<Payments />} />
              <Route path="/success" element={<Success />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/account/:subpage?" element={<Account />} />
              <Route path="/account/:subpage/:action" element={<Account />} />
            </Route>
            <Route path="/agent" element={<AgentLayout />}>
              <Route index element={<AgentProfile />} />
              <Route path="/agent/login" element={<AgentLogin />} />
              <Route path="/agent/register" element={<AgentRegister />} />
              <Route path="/agent/profile" element={<AgentProfile />} />
              <Route path="/agent/bookings" element={<PlacesPage />} />
              <Route path="/agent/places" element={<PlacesPage />} />
              <Route path="/agent/places/new" element={<PlacesFormpage />} />
              <Route path="/agent/places/:id" element={<PlacesFormpage />} />
            </Route>
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path='/admin' element={<AdminHome />} />
              <Route path='/admin/user' element={<AdminUser />} />
              <Route path='/admin/agent' element={<AdminAgent />} />
              <Route path='/admin/category' element={<CategoryPage />} />
              <Route path='/admin/category/new' element={<CategoryList />} />
              <Route path='/admin/category/:id' element={<CategoryList />} />
              <Route path='/admin/packages' element={<AdminPackage />} />
              <Route path='/admin/bookings' element={<AdminBooking />} />
            </Route>
          </Routes>
        </AdminContextProvider>
      </AgentContextProvider>
    </UserContextProvider>
  )
}

export default App



