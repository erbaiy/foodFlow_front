import {useState} from "react";
import {useNavigate} from "react-router-dom";
import SpinnerIcon from "../../components/SpinnerIcon";
import AuthService from "../../services/AuthService";
import {toast} from "sonner";

const VerifyOtp = () => {
    
    const Auth = AuthService();
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            event.target.previousSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const otpValue = otp.join("");
        if (otpValue.length < 4) {
            setLoading(false);
            toast("Please enter a valid OTP");
            return;
        }
        const isSent = await Auth.verifyOTP(otpValue);
        setLoading(false);
        if (isSent) navigate("/");
    };

    const handleResend = async () => {
        const isSent = await Auth.sendOTP();
        if (isSent.success) toast("OTP sent successfully");
        else if (isSent.error === "REQUIRED_LOGIN") navigate("/login");
    }

    return (
        <div>
            <div className="absolute inset-0">
                <img
                    src="/assets/images/auth/bg-gradient.png"
                    alt="image"
                    className="h-full w-full object-cover"
                />
            </div>

            <div
                className="relative flex min-h-screen items-center justify-center px-6 py-10 bg-slate-50 dark:bg-slate-900 sm:px-16">
                <div
                    className="relative w-full max-w-[750px] rounded-md bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)] p-2 dark:bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)]">
                    <div
                        className="relative flex flex-col justify-center rounded-md bg-white/80 backdrop-blur-lg dark:bg-slate-900/80 px-6 lg:min-h-[500px] py-10">
                        <div className="mx-auto w-full max-w-[500px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                                    Verify OTP
                                </h1>
                                <p className="text-base font-semibold leading-normal text-slate-400">
                                    Enter the OTP sent to your email
                                </p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
                                <div className="flex justify-center space-x-2">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            name="otp"
                                            maxLength="1"
                                            value={data}
                                            onChange={(e) => handleChange(e.target, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onFocus={(e) => e.target.select()}
                                            className="w-10 h-10 text-center rounded-md border border-slate-400 bg-white text-slate-700 text-sm font-normal !outline-none focus:border-primary focus:ring-transparent dark:border-[#17263c] dark:bg-slate-700 dark:text-slate-50 dark:focus:border-primary"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    className="relative flex items-center bg-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 justify-center rounded-md px-5 py-2 font-semibold outline-none transition duration-300 hover:shadow-none text-white !mt-6 w-full border-0 shadow-[0_10px_20px_-10px_rgba(249,115,22,1)]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <SpinnerIcon className="w-4 h-4 me-3 text-white"/>
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify"
                                    )}
                                </button>
                            </form>
                            <div className="text-center text-slate-600 dark:text-slate-400 mt-6">
                                Didn't receive the OTP?&nbsp;
                                <button
                                    onClick={handleResend}
                                    className="uppercase text-primary underline transition hover:text-orange-600 dark:hover:text-white">
                                    Resend
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;