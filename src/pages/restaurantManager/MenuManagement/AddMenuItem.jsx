import { useTranslation } from "react-i18next";
import { toast, Toaster } from "sonner";
import { User, MessageCircle, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import useForm from "../../../hooks/useForm";
import InputField from "../../../components/InputField";
import ImageUpload from "../../../components/ImageUpload";
import TextArea from "../../../components/TextArea";
import Button from "../../../components/Button";
import { menuItemSchema } from "../../../validation/menuItemValidation";
import axiosInstance from "../../../config/axios";
import { useState, useEffect } from "react";

const MENU_ITEM_CATEGORIES = ['appetizer', 'main', 'dessert', 'beverage'];

const AddMenuItem = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [restoId, setRestoId] = useState('');

    useEffect(() => {
        const id = location.pathname.split('/').slice(-1)[0];
        setRestoId(id);
    }, [location]);

    const initialState = {
        name: "",
        description: "",
        price: "",
        image: null,
        category: ""
    };

    const {
        formData,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleSubmit
    } = useForm(initialState, menuItemSchema, onSubmit);

    async function onSubmit(data) {
      try {
          const formData = new FormData();
          
          // Append all text fields
          formData.append('name', data.name);
          formData.append('description', data.description);
          formData.append('price', data.price);
          formData.append('category', data.category);

          // Check if image exists and is a File object
          if (data.image && data.image instanceof File) {
              formData.append('image', data.image, data.image.name);
          }

          // Debug log to check FormData contents
          for (let pair of formData.entries()) {
              console.log('FormData entry:', pair[0], pair[1]);
          }

          const response = await axiosInstance.post(`/menu-manager?restoId=${restoId}`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              }
          });

          if (response.data) {
              toast.success(t("Menu item added successfully"));
              
              // Reset form
              ["name", "description", "price", "image", "category"].forEach(field => {
                  handleChange({
                      target: { 
                          name: field, 
                          value: field === "image" ? null : "",
                          error: null 
                      }
                  });
              });
          }
      } catch (error) {
          console.error('Upload error:', error);
          toast.error(error.response?.data?.message || t("Failed to add menu item"));
      }
  }

  // This function will receive the event object from ImageUpload
  const handleImageChange = (event) => {
      // The event.target.value will contain the File object from your ImageUpload component
      handleChange(event);
  };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md"
        >
            <Toaster richColors />
            <h1 className="text-2xl font-bold mb-6 dark:text-slate-400">
                {t("Add Menu Item")}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <InputField
                            id="name"
                            name="name"
                            type="text"
                            label={t("Name")}
                            placeholder={t("Enter item name")}
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            touched={touched.name}
                            icon={User}
                        />
                    </div>

                    <div className="flex-1">
                        <InputField
                            id="price"
                            name="price"
                            type="text"
                            label={t("Price")}
                            placeholder={t("Enter item price")}
                            value={formData.price}
                            onChange={handleChange}
                            error={errors.price}
                            touched={touched.price}
                            icon={DollarSign}
                        />
                    </div>
                    <div className="flex-1">
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="">{t("Select category")}</option>
                            {MENU_ITEM_CATEGORIES.map(category => (
                                <option key={category} value={category}>
                                    {t(category)}
                                </option>
                            ))}
                        </select>
                        {errors.category && touched.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                        )}
                    </div>
                </div>

                <TextArea
                    id="description"
                    name="description"
                    label={t("Description")}
                    placeholder={t("Enter item description")}
                    value={formData.description}
                    onChange={handleChange}
                    error={errors.description}
                    touched={touched.description}
                    icon={MessageCircle}
                />

<ImageUpload
            name="image"
            label={t("Image")}
            onChange={handleImageChange} // Pass the handler directly
            error={errors.image}
            t={t}
        />

                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full"
                    loadingText={t("Adding...")}
                >
                    {t("Add Menu Item")}
                </Button>
            </form>
        </motion.div>
    );
};

export default AddMenuItem;
