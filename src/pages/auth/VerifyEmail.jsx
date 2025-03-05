import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import AuthService from "../../services/AuthService";
import InputField from "../../components/InputField";

const VerifyEmail = () => {
  const [verification, setVerification] = useState({
    isVerified: false,
    isLoading: true,
  });
  const [resend, setResend] = useState({
    showForm: false,
    success: false,
    isSubmitting: false,
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const Auth = AuthService();
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
        if (!token || verification.isVerified) return; // Add this check
        try {
            const isVerified = await Auth.verifyEmail(token);
            setVerification({ isVerified, isLoading: false });
        } catch (error) {
            console.error("Email verification error:", error);
            setVerification({ isVerified: false, isLoading: false });
        }
    };
    verifyEmail();
}, [token, Auth, verification.isVerified]);

  const handleResendEmail = async () => {
    if (!resend.showForm) {
      return setResend({ ...resend, showForm: true });
    }

    if (!resend.email) return;

    try {
      setResend({ ...resend, isSubmitting: true });
      await Auth.resendVerificationEmail(resend.email);
      setResend({ ...resend, success: true, isSubmitting: false, email: "" });
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error resending verification email:", error);
      setResend({ ...resend, isSubmitting: false });
      setErrorMessage("Failed to resend verification email.");
    }
  };

  const renderVerificationStatus = () => {
    if (verification.isLoading) {
      return <p>Loading...</p>;
    }

    return verification.isVerified ? (
      <>
        <CheckCircle className="h-16 w-16 text-green-500" />
        <p className="text-xl font-semibold leading-normal text-slate-400 mb-8">
          Email verified successfully!
        </p>
      </>
    ) : (
      <>
        <XCircle className="h-16 w-16 text-red-500" />
        <p className="text-xl font-semibold leading-normal text-slate-400 mb-8">
          Email verification failed!
        </p>
      </>
    );
  };

  const renderResendForm = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Resend Verification Email</h2>
      </div>
      {resend.success ? (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Verification email sent successfully!
        </div>
      ) : (
        <>
          <InputField
            name="email"
            id="email"
            type="email"
            value={resend.email}
            onChange={(e) => setResend({ ...resend, email: e.target.value })}
            placeholder="Email"
          />
          {errorMessage && (
            <p className="text-red-500 mt-2">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="background"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-6 py-10 bg-slate-50 dark:bg-slate-900 sm:px-16">
        <div className="relative w-full max-w-[750px] rounded-md bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)] p-2 dark:bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/80 backdrop-blur-lg dark:bg-slate-900/80 px-6 lg:min-h-[500px] py-10">
            <div className="mx-auto w-full max-w-[400px] text-center">
              {resend.showForm ? (
                renderResendForm()
              ) : (
                <>
                  <div className="mb-10">
                    <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                      Email Verification
                    </h1>
                  </div>
                  <div className="mb-8 flex justify-center">
                    {renderVerificationStatus()}
                  </div>
                </>
              )}
              {verification.isVerified && (
                <Link
                  to="/login"
                  className="relative flex items-center bg-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 justify-center rounded-md px-5 py-2 font-semibold outline-none transition duration-300 hover:shadow-none text-white !mt-6 w-full border-0 shadow-[0_10px_20px_-10px_rgba(249,115,22,1)]"
                >
                  Go to Login
                </Link>
              )}
              {!verification.isVerified && (
                <button
                  onClick={handleResendEmail}
                  disabled={resend.isSubmitting || (resend.showForm && resend.success)}
                  className={`relative flex items-center ${
                    resend.isSubmitting ? "bg-gray-400" : "bg-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600"
                  } justify-center rounded-md px-5 py-2 font-semibold outline-none transition duration-300 hover:shadow-none text-white !mt-6 w-full border-0 shadow-[0_10px_20px_-10px_rgba(249,115,22,1)]`}
                >
                  {resend.isSubmitting
                    ? "Sending..."
                    : resend.showForm
                    ? resend.success
                      ? "Email Sent"
                      : "Send"
                    : "Resend Email"}
                </button>
              )}
              {resend.showForm && !resend.success && (
                <button
                  onClick={() => setResend({ ...resend, showForm: false })}
                  className="mt-4 text-orange-500 hover:text-orange-600"
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;