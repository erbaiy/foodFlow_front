import axiosInstance from "../config/axios";
import {useDispatch, useSelector} from "react-redux";
import {temp, login, logout} from "../store/AuthSlice";
import {toast} from "sonner";

class Auth {
    constructor(user, authenticated, dispatch) {
        this.user = user;
        this.authenticated = authenticated;
        this.dispatch = dispatch;
    }

    async registerClient(userData) {
        try {
            const response = await axiosInstance.post("auth/register/user", userData);
            const data = await response.data;
            toast(data.message);
        } catch (error) {
            toast(error.response ? error.response.data.message : error.message);
        }
    }

    async registerRestaurant(restaurantData) {
        try {
            const response = await axiosInstance.post("/auth/register/restaurant", restaurantData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const data = await response.data.message;
            toast(data);
            return true;
        } catch (error) {
            toast(error.response ? error.response.data.message : error.message);
            return false;
        }
    }

    async login(userData) {
    try {
        const response = await axiosInstance.post("auth/login", userData);
        const data = await response.data;
        
        // Check if response structure matches the expected format
        if (data.status === 200 && data.data) {
            const userData = data.data;
            
            // Check if userData.user exists before accessing its properties
            if (!userData.user) {
                throw new Error("User data not found in response");
            }
            this.dispatch(login({
                user: {
                    id: userData.user.id, 
                    email: userData.user.email, 
                    fullName: userData.user.fullName, 
                    role: userData.user.role
                },
                token: userData.accessToken
            }));
            return {success: true};
        } else {
            // Handle case where response doesn't have expected structure
            throw new Error("Invalid response format");
        }
    } catch (error) {
        toast(error.response ? error.response.data.message : error.message);
        this.dispatch(temp({email: userData.email}));
        return {success: false, error: error.response};
    }
}
    async logout() {
        try {
            this.dispatch(logout());
            await axiosInstance.get("auth/logout");
        } catch (error) {
            console.error(error.response.data.error);
        }
    }

    async verifyEmail(token) {
        try {
            const response = await axiosInstance.get(`auth/verify-email?token=${token}`);
            const data = await response.data;
            toast(data.message);
            return true;
        } catch (error) {
            toast(error.response ? error.response.data.message : error.message);
            return false;
        }
    }
    async resendVerificationEmail(email) {
        try {
            const response = await axiosInstance.post(
                "auth/send-email-verification",
                {email}
            );
            const data = await response.data;
            toast(data.message);
        } catch (error) {
            toast(error.response ? error.response.data.message : error.message);
        }
    }

    async sendOTP() {
        if (!this.user.email) {
            return {success: false, error: "REQUIRED_LOGIN"};
        }
        try {
            const response = await axiosInstance.post("auth/send-otp", {
                email: this.user.email,
            });
            const data = await response.data;
            toast(data.message);
            return {success: true};
        } catch (error) {
            toast(error.response ? error.response.data.message : error.message);
            return {success: false};
        }
    }

    async verifyOTP(otp) {
        try {
            const response = await axiosInstance.post("auth/verify-otp", {otp});
            const data = await response.data;
            this.dispatch(login({
                user: {id: data.user.id, email: data.user.email, fullName: data.user.fullName, role: data.user.role},
                token: data.accessToken
            }));
            toast("OTP verified successfully");
            return true;
        } catch (error) {
            toast(error.response.data.error);
            return false;
        }
    }

    async sendResetLink(email) {
        try {
            // this.setLoading(true);
            const response = await axiosInstance.post("auth/forgot-password", {
                email,
            });
            const data = await response.data;
            // this.setLoading(false);
            toast(data.message);
        } catch (error) {
            // this.setLoading(false);
            toast(error.response.data.error);
        }
    }

    async verifyResetToken(token) {
        try {
            const response = await axiosInstance.get(
                `auth/reset-password/verify?token=${token}`
            );
            const data = await response.data;
            localStorage.setItem("resetToken", data.token);
            return true;
        } catch (error) {
            toast("Invalid reset link");
            return false;
        }
    }

    async resetPassword(resetToken,password) {
        try {
            // this.setLoading(true);
            const response = await axiosInstance.post(
                `auth/reset-password/${resetToken}`,
                {password}
            );
            const data = await response.data;
            
            toast(data.message);
            return true;
        } catch (error) {
            // this.setLoading(false);
            toast(error.response.data.error);
            return false;
        }
    }

    getUser() {
        return this.user;
    }

    isAuthenticated() {
        return this.authenticated;
    }
}

let authInstance = null;
export default function AuthService() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    if (!authInstance) {
        authInstance = new Auth(user, isAuthenticated, dispatch);
    }

    return authInstance;
}
