import { useTranslation } from "react-i18next";
import { toast, Toaster } from "sonner";
import { User, MessageCircle, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import useForm from "../../../hooks/useForm";
import InputField from "../../../components/InputField";
import ImageUpload from "../../../components/ImageUpload";
import TextArea from "../../../components/TextArea";
import Button from "../../../components/Button";
import { menuItemSchema } from "../../../validation/menuItemValidation";

const initialState = {
  name: "",
  description: "",
  price: "",
  image: null,
};

const AddMenuItem = () => {
  const { t } = useTranslation();
  const {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm(initialState, menuItemSchema, onSubmit);

  async function onSubmit(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      console.log("formData", formData);
      await axiosInstance.post("/super-admin/menu-items/create", formData);
      toast.success(t("Menu item added successfully"));
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(t(error.response.data.error));
      } else {
        toast.error(t("Failed to add menu item. Please try again."));
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md"
    >
      <Toaster richColors/>
      <h1 className="text-2xl font-bold mb-6 dark:text-slate-400">
        {t("Add Menu Item")}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
          onChange={(file) =>
            handleChange({ target: { name: "image", value: file } })
          }
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
