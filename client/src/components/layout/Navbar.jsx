import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../features/auth/authApi";
import { Menu, X } from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed")
    }
  };
  return (
    <nav className="bg-surface border-border border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <div className="bg-primary px-3 py-1.5 rounded-md">
            <span className="text-white text-lg font-bold">V</span>
          </div>

          <h3 className="text-primary text-xl font-semibold">VistaView</h3>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/places" className="hover:text-primary">
            Explore
          </Link>

          {isAuthenticated ? (
            <>
              {role === "owner" && (
                <Link to="/owner/dashboard" className="hover:text-primary">
                  Dashboard
                </Link>
              )}

              {role === "admin" && (
                <Link to="/admin/dashboard" className="hover:text-primary">
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-danger hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-hover rounded-md px-4 py-1 text-white transition duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20}/>: < Menu size={20}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t flex flex-col border-border px-4 py-3 space-y-3 text-sm">
          <Link to="/places" onClick={() => setOpen(false)}>Explore</Link>
          
          {isAuthenticated ? (
            <>
              {role === "owner" && (
                <Link to="/owner/dashboard" onClick={()=>setOpen(false)}>Dashboard</Link>
              )}

              {role === "admin" && (
                <Link to="/admin/dashboard" onClick={()=>setOpen(false)}>Admin Panel</Link>
              )}

              <button onClick={handleLogout} className="text-danger block">
                Logout
              </button>
            </>
          ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                
                <Link to="/register" onClick={()=>setOpen(false)}>Sign Up</Link>
              </>
          )}
          </div>
      )}
    </nav>
  );
};
export default Navbar;
