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
import ImageUpload from "../../../components/ImageUpload";
import InputField from "../../../components/InputField";
import useForm from "../../../hooks/useForm";
import {
  managerDetailsSchema,
  restaurantDetailsSchema,
  imageUploadSchema,
} from "../../../validation/addRestaurantValidation";
import Stepper from "../../../components/Stepper";
import axiosInstance from './../../../config/axios';
import { toast } from "sonner";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "+",
  address: "",
  name: "",
  cuisineType: "",
  location: "",
  role: "gestionnaire",
  banner: null,
  logo: null,
};

const AddRestaurant = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    formData,
    errors,
    touched,
    isSubmitting,
    currentStep,
    handleChange,
    handleSubmit,
    handleStepChange,
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

  async function onSubmit(data) {
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(data).forEach(key => {
      if (key === 'logo' || key === 'banner') {
        formData.append(key, data[key].target.value);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      await axiosInstance.post('/super-admin/restaurants/create', formData);
      toast.success(t('Restaurant added successfully'));
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(t(error.response.data.error));
      } else {
        toast.error(t('Failed to add restaurant. Please try again.'));
      }
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
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
              </div>
              <div className="flex-1">
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
              </div>
            </div>
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
                  onChange={handleChange}
                  icon={Phone}
                  error={errors.phoneNumber}
                  touched={touched.phoneNumber}
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
            <div className="flex space-x-4">
              <div className="flex-1">
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
              </div>
              <div className="flex-1">
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
              </div>
            </div>
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
          <div className="flex items-center justify-between space-x-4">
            <div className="w-2/3">
              <ImageUpload
                name="banner"
                label={t("Banner")}
                onChange={(file) =>
                  handleChange({ target: { name: "banner", value: file } })
                }
                error={errors.banner}
                t={t}
              />
            </div>
            <div className="w-1/3">
              <ImageUpload
                name="logo"
                label={t("Logo")}
                onChange={(file) =>
                  handleChange({ target: { name: "logo", value: file } })
                }
                error={errors.logo}
                t={t}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow-md">
      <h1 className="text-2xl dark:text-slate-400 font-bold mb-4">{t("Add Restaurant")}</h1>
      <div className="mb-6">
        <Stepper steps={steps} activeStep={currentStep} />
      </div>
      <form onSubmit={handleSubmit}>
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
  );
};

export default AddRestaurant;
