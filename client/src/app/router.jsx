import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "../components/common/ProtectedRoutes";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PublicRoutes from "../components/common/PublicRoutes";
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import Home from "../pages/Home";
import Places from "../pages/Place";
import PlaceDetails from "../pages/PlaceDetails";
import Wishlist from "../pages/Wishlist";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/places",
        element:<Places/>
      },
      {
        path: "/places/:id",
        element:<PlaceDetails/>
      },
      {
         path: "wishlist",
      element: <ProtectedRoutes>
          <Wishlist/>
      </ProtectedRoutes>
      }
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <PublicRoutes>
            <Login />
          </PublicRoutes>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoutes>
            <Register />
          </PublicRoutes>
        ),
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);
