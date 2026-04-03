import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../features/auth/authApi";
import { Menu, X } from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import NotificationBell from "../notifications/NotificationBell";
import { baseApi } from "../../services/api/baseApi";

const Navbar = () => {
  const { isAuthenticated, role} = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      dispatch(baseApi.util.resetApiState())
    toast.success("Logged out successfully");
    navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Logout failed")
    }
  };
  return (
    <nav className="sticky top-0 z-50 w-full bg-surface/85 backdrop-blur-md  border-border border-b transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <div className="bg-primary px-3 py-1.5 rounded-lg group-hover:bg-primary-hover transition-colors shadow-sm">
            <span className="text-white text-lg font-bold">V</span>
          </div>

          <h3 className="text-primary text-xl font-bold tracking-tight group-hover:text-primary-hover transition-colors">VistaView</h3>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7 text-sm md:flex">
          <Link to="/places" className="text-text-secondary font-medium  hover:text-primary transition-colors">
            Explore
          </Link>

          {isAuthenticated ? (
            <>
              {role === "owner" && (
                <Link to="/owner/dashboard" className="text-text-secondary font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}

              {role === "admin" && (
                <Link to="/admin/dashboard" className="text-text-secondary hover:text-primary font-medium transition-colors">
                  Admin Panel
                </Link>
              )}
              <Link to="/wishlist" className="text-text-secondary hover:text-primary font-medium transition-colors">Wishlist</Link>
              <Link to="/profile" className="text-text-secondary hover:text-primary font-medium transition-colors">Profile</Link>
              <div className="flex items-center justify-center pt-1">
                <NotificationBell/>
              </div>
              <button
                onClick={handleLogout}
                className="text-danger hover:text-danger/80 font-medium transition-colors ml-2 border border-danger/20 px-4 py-1.5 rounded-md cursor-pointer hover:bg-danger/5"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 ml-2">
              <Link to="/login" className="text-text-secondary hover:text-primary font-medium transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-hover shadow-sm rounded-md px-5 py-2 text-white font-medium transition-all hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && (
            <div className="pt-1">
              <NotificationBell/>
            </div>
          )}
          {/* Mobile Toggle */}
        <button className="md:hidden text-text-secondary hover:text-primary p-2 transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X size={20}/>: < Menu size={20}/>}
        </button>
        </div>
      </div>

      <div className={`md:hidden absolute w-full bg-surface border-b border-border shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100":"max-h-0 opacity-0 border-transparent"}`}>
        <div className=" flex flex-col px-4 py-4 space-y-2 text-sm">
          <Link to="/places" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-text-secondary hover:bg-primary/5 hover:text-primary rounded-md font-medium">Explore</Link>
          
          {isAuthenticated ? (
            <>
              {role === "owner" && (
                <Link to="/owner/dashboard" onClick={()=>setOpen(false)} className="block px-3 py-2.5 text-text-secondary hover:bg-primary/5 hover:text-primary rounded-md font-medium">Dashboard</Link>
              )}

              {role === "admin" && (
                <Link to="/admin/dashboard" onClick={()=>setOpen(false)} className="block px-3 py-2.5 text-text-secondary hover:bg-primary/5 hover:text-primary rounded-md font-medium">Admin Panel</Link>
              )}

              <Link to="/wishlist" onClick={()=>setOpen(false)} className=" block px-3 py-2.5 text-text-secondary hover:bg-primary/5 hover:text-primary rounded-md font-medium">Wishlist</Link>
              <Link to="/profile" onClick={()=>setOpen(false)} className=" block px-3 py-2.5 text-text-secondary hover:bg-primary/5 hover:text-primary rounded-md font-medium">Profile</Link>

      
              <div className="border-t border-border mt-2 pt-2">
                 <button onClick={()=> {handleLogout(); setOpen(false)}} className="w-full text-center px-3 py-2.5 text-danger hover:bg-danger/5 rounded-md font-medium">
                Logout
              </button>
             </div>
            </>
          ) : (
              <div className="border-t border-border mt-2 pt-4 flex flex-col gap-3">
                <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-center border border-border text-text-secondary hover:bg-gray-50 rounded-md font-medium">Login</Link>
                
                <Link to="/register" onClick={()=>setOpen(false)} className="block px-3 py-2.5 text-center bg-primary text-white hover:bg-primary-hover rounded-md font-medium shadow-sm">Sign Up</Link>
              </div>
          )}
          </div>
      </div>
    </nav>
  );
};
export default Navbar;
