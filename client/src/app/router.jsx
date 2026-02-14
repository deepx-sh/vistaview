import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "../components/common/ProtectedRoutes";


const Home = () => <h1>Home</h1>;
const Login = () => <h1>Login</h1>;
const Dashboard = () => <h1>Dashboard</h1>;


export const router = createBrowserRouter([
    {
        path: "/",
        element:<Home/>
    },
    {
         path: "/login",
        element:<Login/>
    },
    {
         path: "/dashboard",
        element: (
            <ProtectedRoutes allowedRoles={["owner", "admin"]}>
                <Dashboard/>
            </ProtectedRoutes>
        )
    }
])