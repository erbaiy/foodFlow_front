import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; 
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import InputField from "../../../components/InputField";
import ImageUpload from "../../../components/ImageUpload";
import TextArea from "../../../components/TextArea";
import Button from "../../../components/Button";
import { User, MessageCircle, DollarSign } from "lucide-react";
import axiosInstance from "../../../config/axios";

const EditMenuItemPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(location.state?.item || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu item data
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        if (id) {
          const response = await axiosInstance.get(`/menu-items/${id}`);
          console.log('Fetched menu item:', response.data);
          if (response.data && response.data.data) {
            setFormData(response.data.data.result);
          }
        }
      } catch (error) {
        console.error('Error fetching menu item:', error);
        toast.error(t("Failed to load menu item"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, image: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Only append fields that have changed
      if (formData.name) submitData.append('name', formData.name);
      if (formData.description) submitData.append('description', formData.description);
      if (formData.price) submitData.append('price', formData.price.toString());
      if (formData.category) submitData.append('category', formData.category);

      // Append image only if it's a new file
      if (formData.image instanceof File) {
        submitData.append('image', formData.image);
      }

      // Debug log
      for (let pair of submitData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      // Use PATCH instead of PUT to match the backend
      const response = await axiosInstance.patch(
        `/menu-manager/${id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log('Update response:', response.data);

      if (response.data && response.data.status === 200) {
        toast.success(response.data.data.message || t("Menu item updated successfully"));
        navigate('/dashboard/restaurant-manager');
      }
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || t("Failed to update menu item");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">{t("Loading...")}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-slate-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">{t("Edit Menu Item")}</h2>
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="flex space-x-4">
          <div className="flex-1">
            <InputField
              id="name"
              name="name"
              type="text"
              label={t("Name")}
              placeholder={t("Enter item name")}
              value={formData.name || ""}
              onChange={handleChange}
              icon={User}
              required
            />
          </div>

          <div className="flex-1">
            <InputField
              id="price"
              name="price"
              type="number"
              label={t("Price")}
              placeholder={t("Enter item price")}
              value={formData.price || ""}
              onChange={handleChange}
              icon={DollarSign}
              required
            />
          </div>
        </div>

        <div className="flex-1">
          <select
            id="category"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-600"
            required
          >
            <option value="">{t("Select category")}</option>
            {['appetizer', 'main', 'dessert', 'beverage'].map(category => (
              <option key={category} value={category}>
                {t(category)}
              </option>
            ))}
          </select>
        </div>

        <TextArea
          id="description"
          name="description"
          label={t("Description")}
          placeholder={t("Enter item description")}
          value={formData.description || ""}
          onChange={handleChange}
          icon={MessageCircle}
          required
        />

        <ImageUpload
          name="image"
          label={t("Image")}
          onChange={handleImageChange}
          t={t}
          currentImage={formData.image} // Pass current image URL if available
        />

        {formData.image && !formData.image instanceof File && (
          <div className="mt-2">
            <img 
              src={formData.image} 
              alt="Current" 
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("Saving...") : t("Save Changes")}
        </Button>
      </form>
    </div>
  );
};

export default EditMenuItemPage;
