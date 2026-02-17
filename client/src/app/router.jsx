import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "../components/common/ProtectedRoutes";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
export const router = createBrowserRouter([
    {
        path: "/",
        // element:<Home/>
    },
    {
         path: "/login",
        element:<Login/>
    },
    {
        path: "/register",
        element:<Register/>
    },
    {
        path: "/verify-email",
        element:<VerifyEmail/>
    },
    {
         path: "/dashboard",
        // element: (
        //     <ProtectedRoutes allowedRoles={["owner", "admin"]}>
        //         <Dashboard/>
        //     </ProtectedRoutes>
        // )
    }
])