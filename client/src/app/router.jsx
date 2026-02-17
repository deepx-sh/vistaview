import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "../components/common/ProtectedRoutes";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
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
         path: "/dashboard",
        // element: (
        //     <ProtectedRoutes allowedRoles={["owner", "admin"]}>
        //         <Dashboard/>
        //     </ProtectedRoutes>
        // )
    }
])