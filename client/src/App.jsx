import { Routes, Route } from "react-router-dom";
import './App.css';
import Layout from "./Layout";
import AgentLayout from "./components/AgentLayout";
import LoginPage from "./pages/user/LoginPage";
import IndexPages from "./pages/user/IndexPages";
import RegisterPage from "./pages/user/RegisterPage";
import Account from "./pages/user/AccountPage"
import AgentLogin from "./pages/Agents/AgentLogin";
import AgentRegister from "./pages/Agents/AgentRegister";
import AgentProfile from "./pages/Agents/AgentProfile"
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import { AgentContextProvider } from "./AgentContext"
import PlacesPage from "./pages/Agents/PlacesPage";
import PlacesFormpage from "./pages/Agents/PlacesFormpage";

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <AgentContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPages />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account/:subpage?" element={<Account />} />
            <Route path="/account/:subpage/:action" element={<Account />} />
          </Route>
          <Route path="/agent" element={<AgentLayout />}>
            <Route index element={<AgentLogin />} />
            <Route path="/agent/login" element={<AgentLogin />} />
            <Route path="/agent/register" element={<AgentRegister />} />
            <Route path="/agent/profile" element={<AgentProfile />} />
            <Route path="/agent/bookings" element={<PlacesPage />} />
            <Route path="/agent/places" element={<PlacesPage />} />
            <Route path="/agent/places/new" element={<PlacesFormpage />} />
            <Route path="/agent/places/:id" element={<PlacesFormpage />} />

          </Route>
        </Routes>
      </AgentContextProvider>
    </UserContextProvider>
  )
}

export default App



