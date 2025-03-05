import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import SpinnerIcon from "../../components/SpinnerIcon";
import Loader from "../../components/Loader";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  const location = useLocation();
  const Auth = AuthService();
  const navigate=useNavigate();

  useEffect(() => {
    // Extract token from URL parameters
    const url = new URL(window.location.href);
const token = url.pathname.split('/').pop();

    console.log("toke ",token)
    
    if (token) {
      setToken(token);
    } else {
      // Handle case when token is not present
      toast.error("Reset token is missing. Please use the link from your email.");
    }
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      // Display error message
      toast.error("Passwords do not match");
      return;
    }
    
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await Auth.resetPassword(token, newPassword);
      setSuccess("Password reset successfully");
      toast.success("Password has been reset successfully");
      // Redirect or show success message
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(error.message || "Failed to reset password");
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };  

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  
  return (
    <div>
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="image"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-10 bg-slate-50 dark:bg-slate-900 sm:px-16">
        <div className="relative w-full max-w-[750px] rounded-md bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)] p-2 dark:bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/80 backdrop-blur-lg dark:bg-slate-900/80 px-6 lg:min-h-[500px] py-10">
            <div className="mx-auto w-full max-w-[500px]">
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                  Reset Password
                </h1>
                <p className="text-base font-semibold leading-normal text-slate-400">
                  Enter your new password below
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5 dark:text-white">
                <div>
                  <label htmlFor="NewPassword" className="text-slate-700 dark:text-slate-100 block mb-1">
                    New Password
                  </label>
                  <div className="relative text-white-dark">
                    <input
                      id="NewPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-normal text-slate-700 !outline-none focus:border-primary focus:ring-transparent dark:border-[#17263c] dark:bg-slate-800 dark:text-slate-50 dark:focus:border-primary ps-10 placeholder:text-slate-700 dark:placeholder:text-slate-400"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <Lock size={16} />
                    </span>
                    <button
                      type="button"
                      className="absolute end-4 top-1/2 -translate-y-1/2"
                      onClick={toggleNewPasswordVisibility}
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="ConfirmPassword" className="text-slate-700 dark:text-slate-100 block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative text-white-dark">
                    <input
                      id="ConfirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-normal text-slate-700 !outline-none focus:border-primary focus:ring-transparent dark:border-[#17263c] dark:bg-slate-800 dark:text-slate-50 dark:focus:border-primary ps-10 placeholder:text-slate-700 dark:placeholder:text-slate-400"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                      <Lock size={16} />
                    </span>
                    <button
                      type="button"
                      className="absolute end-4 top-1/2 -translate-y-1/2"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="relative flex items-center bg-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 justify-center rounded-md px-5 py-2 font-semibold outline-none transition duration-300 hover:shadow-none text-white !mt-6 w-full border-0 shadow-[0_10px_20px_-10px_rgba(249,115,22,1)]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <SpinnerIcon className="w-4 h-4 me-3 text-white" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default ResetPassword;
