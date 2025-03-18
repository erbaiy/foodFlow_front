import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  MapPin,
  Building,
  UtensilsCrossed,
} from "lucide-react";
import ImageUpload from "../../../components/ImageUpload";
import InputField from "../../../components/InputField";
import useForm from "../../../hooks/useForm";
import {
  restaurantDetailsSchema,
  imageUploadSchema,
} from "../../../validation/addRestaurantValidation";
import Stepper from "../../../components/Stepper";
import axiosInstance from "../../../config/axios";
import { toast } from "sonner";

const UpdateRestaurant = ({ restaurantData, onClose, onUpdateSuccess }) => {
  const { t } = useTranslation();
  const [existingLogo, setExistingLogo] = useState(restaurantData?.logo || null);
  const [existingBanner, setExistingBanner] = useState(restaurantData?.banner || null);
  
  // Keep track of selected files separately
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // Initialize form data with existing restaurant data
  const initialState = {
    name: restaurantData?.name || "",
    cuisineType: restaurantData?.cuisineType || "",
    location: restaurantData?.location || "",
    address: restaurantData?.address || "",
    // Keep existing image URLs
    logo: restaurantData?.logo || "",
    banner: restaurantData?.banner || "",
  };

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
    [restaurantDetailsSchema, imageUploadSchema],
    onSubmit
  );

  const steps = [
    t("Restaurant Details"),
    t("Upload Images"),
  ];

  // Custom handler for logo file
  const handleLogoChange = (file) => {
    setLogoFile(file);
    // Keep using the existing URL for validation
    handleChange({ target: { name: "logo", value: existingLogo } });
  };

  // Custom handler for banner file
  const handleBannerChange = (file) => {
    setBannerFile(file);
    // Keep using the existing URL for validation
    handleChange({ target: { name: "banner", value: existingBanner } });
  };

  async function onSubmit(data) {
    try {
      const formDataToSend = new FormData();
  
      // Add text fields
      formDataToSend.append("name", data.name);
      formDataToSend.append("cuisineType", data.cuisineType);
      formDataToSend.append("location", data.location);
      formDataToSend.append("isApproved", data.isApproved);
  
      // Handle banner
      if (bannerFile) {
        formDataToSend.append("banner", bannerFile); // Append banner file
      } else if (existingBanner) {
        formDataToSend.append("banner", existingBanner); // Keep existing banner URL
      } else {
        formDataToSend.append("banner", ""); // Signal to remove banner
      }
  
      // Handle logo
      if (logoFile) {
        formDataToSend.append("logo", logoFile); // Append logo file
      } else if (existingLogo) {
        formDataToSend.append("logo", existingLogo); // Keep existing logo URL
      } else {
        formDataToSend.append("logo", ""); // Signal to remove logo
      }
  
      // Handle cover
      if (coverFile) {
        formDataToSend.append("cover", coverFile); // Append cover file
      } else if (existingCover) {
        formDataToSend.append("cover", existingCover); // Keep existing cover URL
      } else {
        formDataToSend.append("cover", ""); // Signal to remove cover
      }
  
      // Debug FormData contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
  
      // Send the request
      const response = await axiosInstance.put(
        `/restaurant-manager/update/${restaurantData._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct content type
          },
        }
      );
  
      toast.success(t("Restaurant updated successfully"));
      onUpdateSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.data?.error) {
        toast.error(t(error.response.data.error));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("Failed to update restaurant. Please try again."));
      }
    }
  }
  
  
  
  // Helper function to convert file to base64 (for sending images in JSON)
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
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
          <div className="flex items-center justify-between space-x-4">
            <div className="w-2/3">
              <ImageUpload
                name="banner"
                label={t("Banner")}
                onChange={handleBannerChange}
                existingImage={existingBanner}
                error={errors.banner}
                t={t}
              />
            </div>
            <div className="w-1/3">
              <ImageUpload
                name="logo"
                label={t("Logo")}
                onChange={handleLogoChange}
                existingImage={existingLogo}
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
      <h1 className="text-2xl dark:text-slate-400 font-bold mb-4">{t("Update Restaurant")}</h1>
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

export default UpdateRestaurant;