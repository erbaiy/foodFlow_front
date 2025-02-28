import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building,
  UtensilsCrossed,
} from "lucide-react";
import ImageUpload from "../../components/ImageUpload";
import InputField from "../../components/InputField";
import useForm from "../../hooks/useForm";
import {
  managerDetailsSchema,
  restaurantDetailsSchema,
  imageUploadSchema,
} from "../../validation/addRestaurantValidation";
import Stepper from "../../components/Stepper";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "+",  // Start with just the plus sign
  address: "",
  name: "",
  cuisineType: "",
  location: "",
  role: "gestionnaire",
  banner: null,
  logo: null,
};

const RegisterRestaurant = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const Auth = AuthService();
  const navigate = useNavigate();

  const {
    formData,
    errors,
    touched,
    isSubmitting,
    currentStep,
    handleChange,
    handleSubmit,
    handleStepChange,
    setErrors,
  } = useForm(
    initialState,
    [managerDetailsSchema, restaurantDetailsSchema, imageUploadSchema],
    onSubmit
  );

  const steps = [
    t("Manager Details"),
    t("Restaurant Details"),
    t("Upload Images"),
  ];

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Phone validation function
  const validatePhoneNumber = (phone) => {
    // International format validation: + followed by 6-15 digits
    const phoneRegex = /^\+[0-9]{6,15}$/;
    return phoneRegex.test(phone);
  };

  // Custom handler for phone number to ensure it has a "+" prefix
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Always ensure it starts with +
    if (!value.startsWith("+")) {
      value = "+" + value;
    }
    
    // Remove any non-digit characters (except the leading +)
    value = "+" + value.substring(1).replace(/[^0-9]/g, "");
    
    // Create a modified event object
    const modifiedEvent = {
      target: {
        name: e.target.name,
        value: value
      }
    };
    
    handleChange(modifiedEvent);
    
    // Clear error if valid, otherwise set error
    if (validatePhoneNumber(value)) {
      setPhoneError("");
    } else {
      setPhoneError(t("Phone number must be in international format (e.g., +1234567890)"));
    }
  };

  async function onSubmit(data) {
    // Validate phone number format before submission
    if (!validatePhoneNumber(data.phoneNumber)) {
      setErrors({
        ...errors,
        phoneNumber: t("Phone number must be in international format (e.g., +1234567890)")
      });
      return false;
    }
    
    // Fix: proper data structure for submission
    const formDataToSubmit = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      address: data.address,
      name: data.name,
      cuisineType: data.cuisineType,
      location: data.location,
      role: data.role,
      isApproved: false,
      // Handle file objects properly
      logo: data.logo?.target?.value || data.logo,
      banner: data.banner?.target?.value || data.banner
    };
    
    console.log('Submitting data:', formDataToSubmit);
    
    try {
      const isRegistered = await Auth.registerRestaurant(formDataToSubmit);
      if (isRegistered) navigate("/login");
    } catch (error) {
      // Handle API errors
      if (error.response?.data?.message) {
        const errorMessages = Array.isArray(error.response.data.message) 
          ? error.response.data.message 
          : [error.response.data.message];
        
        // Update form errors based on API response
        const newErrors = {};
        errorMessages.forEach(message => {
          if (message.includes("Phone number")) {
            newErrors.phoneNumber = message;
          }
          // Add other error message handling as needed
        });
        
        setErrors({...errors, ...newErrors});
      }
      return false;
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <InputField
              id="fullName"
              name="fullName"
              placeholder={t("Full Name")}
              value={formData.fullName}
              onChange={handleChange}
              icon={User}
              error={errors.fullName}
              touched={touched.fullName}
            />

            <InputField
              id="email"
              name="email"
              placeholder={t("Email")}
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              error={errors.email}
              touched={touched.email}
            />

            <div className="flex space-x-4">
              <div className="flex-1">
                <InputField
                  id="password"
                  name="password"
                  placeholder={t("Password")}
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  error={errors.password}
                />
              </div>
              <div className="flex-1">
                <InputField
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder={t("Phone Number")}
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  icon={Phone}
                  error={errors.phoneNumber || phoneError}
                  touched={touched.phoneNumber}
                  helperText={t("Format: +1234567890")}
                />
              </div>
            </div>
            <InputField
              id="address"
              name="address"
              placeholder={t("Address")}
              value={formData.address}
              onChange={handleChange}
              icon={MapPin}
              error={errors.address}
              touched={touched.address}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <InputField
              id="name"
              name="name"
              placeholder={t("Restaurant Name")}
              value={formData.name}
              onChange={handleChange}
              icon={Building}
              error={errors.name}
              touched={touched.name}
            />

            <InputField
              id="cuisineType"
              name="cuisineType"
              placeholder={t("Cuisine Type")}
              value={formData.cuisineType}
              onChange={handleChange}
              icon={UtensilsCrossed}
              error={errors.cuisineType}
              touched={touched.cuisineType}
            />

            <InputField
              id="restaurantAddress"
              name="address"
              placeholder={t("Restaurant Address")}
              value={formData.address}
              onChange={handleChange}
              icon={MapPin}
              error={errors.address}
              touched={touched.address}
            />
            <InputField
              id="location"
              name="location"
              placeholder={t("Location")}
              value={formData.location}
              onChange={handleChange}
              icon={MapPin}
              error={errors.location}
              touched={touched.location}
            />
          </div>
        );
      case 2:
        return (
          <>
            <ImageUpload
              name="banner"
              label={t("Banner")}
              onChange={(file) =>
                handleChange({ target: { name: "banner", value: file } })
              }
              error={errors.banner}
              t={t}
            />

            <ImageUpload
              name="logo"
              label={t("Logo")}
              onChange={(file) =>
                handleChange({ target: { name: "logo", value: file } })
              }
              error={errors.logo}
              t={t}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-10 bg-slate-50 dark:bg-slate-900 sm:px-16">
      <div className="relative w-full max-w-[900px] rounded-md bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)] p-2 dark:bg-[linear-gradient(45deg,#f97316_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#f97316_100%)]">
        <div className="relative flex flex-col justify-center rounded-md bg-white/80 backdrop-blur-lg dark:bg-slate-900/80 px-6 lg:min-h-[500px] py-10">
          <div className="mx-auto w-full max-w-[647px]">
            <h1 className="text-2xl dark:text-slate-400 font-bold mb-4">
              {t("Add Restaurant")}
            </h1>
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Stepper steps={steps} activeStep={currentStep} />
              </div>
              <form onSubmit={handleSubmit} className="w-full max-w-[647px]">
                {renderStepContent(currentStep)}
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => handleStepChange("prev")}
                    className="flex items-center px-4 py-2 font-semibold bg-slate-200 text-slate-700 rounded"
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    {t("Back")}
                  </button>
                  {currentStep === steps.length - 1 ? (
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded"
                      disabled={isSubmitting}
                    >
                      <Save size={16} className="mr-2" />
                      {isSubmitting ? t("Saving...") : t("Save")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStepChange("next")}
                      className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded"
                    >
                      {t("Next")}
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterRestaurant;