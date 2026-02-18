import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "../components/common/ProtectedRoutes";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PublicRoutes from "../components/common/PublicRoutes";
export const router = createBrowserRouter([
    {
        path: "/",
        // element:<Home/>
    },
    {
         path: "/login",
        element: (
            <PublicRoutes>
                <Login />
            </PublicRoutes>
        )
    },
    {
        path: "/register",
        element: (
            <PublicRoutes><Register/></PublicRoutes>
        )
    },
    {
        path: "/verify-email",
        element:<VerifyEmail/>
    },
    {
        path: "/forgot-password",
        element:<ForgotPassword/>
    },
    {
        path: "/reset-password",
        element:<ResetPassword/>
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