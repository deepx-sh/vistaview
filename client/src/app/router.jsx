import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "../components/common/ProtectedRoutes";
import ErrorBoundary from "../components/common/ErrorBoundary";
import SectionErrorFallback from "../components/common/SectionErrorFallback";

const withBoundary = (Component) => (
  <ErrorBoundary fallback={({ error, reset }) => (
    <SectionErrorFallback error={error} reset={reset} />
  )}>
    <Component/>
  </ErrorBoundary>
)
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
import Profile from "../pages/Profile";


import OwnerRoute from "../routes/OwnerRoutes";
import OwnerLayout from "../components/layout/OwnerLayout";
import { OwnerDashboard } from "../pages/owner/OwnerDashboard";
import OwnerPlaces from "../pages/owner/OwnerPlaces";
import AddPlace from "../pages/owner/AddPlace";
import EditPlace from "../pages/owner/EditPlace";
import OwnerReviews from "../pages/owner/OwnerReviews";
import OwnerAnalytics from "../pages/owner/OwnerAnalytics";

import AdminRoute from "../routes/AdminRoute";
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminPlaces from "../pages/admin/AdminPlaces";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminOwners from "../pages/admin/AdminOwners";
import AdminReports from "../pages/admin/AdminReports";
import Notifications from "../pages/Notifications";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {index: true,element:withBoundary(Home)},
      {path: "places",element: withBoundary(Places)},
      { path: "places/:id", element: withBoundary(PlaceDetails) },
      { path: "/about", element: withBoundary(About) },
      { path: "/contact", element: withBoundary(Contact) },
      { path: "/privacy", element: withBoundary(Privacy)},
      {path:"/terms",element:withBoundary(Terms)},
      { path: "wishlist", element: <ProtectedRoutes>{withBoundary(Wishlist)}</ProtectedRoutes>},
      { path: "profile", element: <ProtectedRoutes>{withBoundary(Profile)}</ProtectedRoutes> },
      { path: "notifications", element: <ProtectedRoutes>{withBoundary(Notifications)}</ProtectedRoutes>}
    ],
  },
  {
    path: "/owner",
    element: (
      <OwnerRoute>
        <OwnerLayout />
      </OwnerRoute>
    ),
    children: [
      {index: true,element: withBoundary(OwnerDashboard)},
      {path: "dashboard",element: withBoundary(OwnerDashboard)},
      {path: "places",element:withBoundary(OwnerPlaces)},
      {path: "add-place",element: withBoundary(AddPlace)},
      {path: "edit-place/:id",element: withBoundary(EditPlace)},
      {path: "reviews",element: withBoundary(OwnerReviews)},
      {path: "analytics",element: withBoundary(OwnerAnalytics)}
    ]
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout/>
      </AdminRoute>
    ),
    children: [
      {index:true,element:withBoundary(AdminDashboard)},
      {path:"dashboard",element:withBoundary(AdminDashboard)},
      {path:"users",element:withBoundary(AdminUsers)},
      {path:"places",element:withBoundary(AdminPlaces)},
      {path:"reviews",element:withBoundary(AdminReviews)},
      {path:"owners",element:withBoundary(AdminOwners)},
      {path:"reports",element:withBoundary(AdminReports)},
    ]
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
  {
    path: "*",
    element:<NotFound/>
  }
]);
