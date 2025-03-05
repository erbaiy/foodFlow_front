import { useState } from "react";
import { User, Mail, Lock, Phone, MapPin } from "lucide-react";
import InputField from "../../components/InputField.jsx";
import { Link, useNavigate } from "react-router-dom";
import IconInstagram from "../../components/icons/IconInstagram.jsx";
import IconX from "../../components/icons/IconX.jsx";
import IconGoogle from "../../components/icons/IconGoogle.jsx";
import IconFacebook from "../../components/icons/IconFacebook.jsx";
import AuthService from "../../services/AuthService.js";
import { userValidationSchema } from "../../validation/userValidation.js";
import { toast } from "sonner";
import useForm from "../../hooks/useForm";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  address: "",
  role: "client",
};

const RegisterClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const Auth = AuthService();

  const {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    
  } = useForm(initialState, [userValidationSchema], onSubmit);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function onSubmit(data) {
    try {
      await Auth.registerClient({
        email: data.email,
        password: data.password,
        address: data.address,
        fullName: `${data.firstName} ${data.lastName}`,
        phoneNumber: `+212${data.phoneNumber.substring(1)}`,
        role: 'client',
      });
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="Background gradient"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-6 py-10 bg-slate-50 dark:bg-slate-900 sm:px-16">
        <div className="relative w-full max-w-[750px] rounded-md bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)] p-2 dark:bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/80 backdrop-blur-lg dark:bg-slate-900/80 px-6 lg:min-h-[500px] py-10">
            <div className="mx-auto w-full max-w-[500px]">
              <div className="mb-10">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                  Sign up
                </h1>
                <p className="text-base font-semibold leading-normal text-slate-400">
                  Enter your information to create an account
                </p>
              </div>
              <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <InputField
                      name="firstName"
                      id="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      icon={User}
                      error={errors.firstName}
                      touched={touched.firstName}
                    />
                  </div>
                  <div className="flex-1">
                    <InputField
                      name="lastName"
                      id="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      icon={User}
                      error={errors.lastName}
                      touched={touched.lastName}
                    />
                  </div>
                </div>
                <InputField
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  error={errors.email}
                  touched={touched.email}
                />
                <div className="relative text-white-dark">
                  <InputField
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                    error={errors.password}
                  />
                </div>
                <InputField
                  name="phoneNumber"
                  id="phoneNumber"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  icon={Phone}
                  error={errors.phoneNumber}
                  touched={touched.phoneNumber}
                />
                <InputField
                  name="address"
                  id="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  icon={MapPin}
                  error={errors.address}
                  touched={touched.address}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative flex items-center bg-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 justify-center rounded-md px-5 py-2 font-semibold outline-none transition duration-300 hover:shadow-none text-white !mt-6 w-full border-0 shadow-[0_10px_20px_-10px_rgba(249,115,22,1)]"
                >
                  {isSubmitting ? "Signing up..." : "Sign up"}
                </button>
              </form>
              <div className="relative my-7 text-center md:mb-9">
                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                <span className="relative text-sm bg-orange-500 dark:bg-slate-700 rounded-full px-2 font-bold uppercase text-white">
                  or
                </span>
              </div>
              <div className="mb-10 md:mb-[30px]">
                <ul className="flex justify-center gap-3.5 text-white">
                  <li>
                    <Link
                      to="#"
                      className="inline-flex bg-gradient-to-r from-orange-500 to-orange-600 h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                    >
                      <IconInstagram />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="inline-flex bg-gradient-to-r from-orange-500 to-orange-600 h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                    >
                      <IconFacebook />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="inline-flex bg-gradient-to-r from-orange-500 to-orange-600 h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                    >
                      <IconX />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="inline-flex bg-gradient-to-r from-orange-500 to-orange-600 h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                    >
                      <IconGoogle />
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="text-center text-slate-600 dark:text-white">
                Already have an account?&nbsp;
                <Link
                  to="/login"
                  className="uppercase text-primary underline transition hover:text-orange-600 dark:hover:text-white"
                >
                  SIGN IN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;