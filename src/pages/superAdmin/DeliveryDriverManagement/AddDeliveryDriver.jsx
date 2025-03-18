import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import InputField from '../../../components/InputField';
import axiosInstance from '../../../config/axios';

const AddDeliveryDriver = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data to the server
      await axiosInstance.post('/super-admin/delivery-driver', formData);

      // Success message
      toast.success(t('Delivery driver added successfully'));

      // Reset form fields
      setFormData({ fullName: '', email: '', phoneNumber: '', address: '', password: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.error;

      // Handle duplicate key errors for both email and phone number
      if (errorMessage === 'Email already exists' || errorMessage.includes('phoneNumber')) {
        toast.error(t(errorMessage));
      } else {
        toast.error(t('Failed to add delivery driver. Please try again.'));
      }
    }
};

  

  return (
    <div className="max-w-xl mx-auto border border-slate-200 dark:border-slate-800 rounded-md bg-slate-50 dark:bg-slate-900 p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">{t('Add New Delivery Driver')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder={t('Full Name')}
          icon={() => <User size={20} />}
          required
        />
        <InputField
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('Email')}
          icon={() => <Mail size={20} />}
          required
        />
        <InputField
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder={t('Phone Number')}
          icon={() => <Phone size={20} />}
          required
        />
        <InputField
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          placeholder={t('Address')}
          icon={() => <MapPin size={20} />}
          required
        />
        <InputField
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={t('Password')}
          icon={() => <Lock size={20} />}
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
        >
          {t('Add Delivery Driver')}
        </button>
      </form>
    </div>
  );
};

export default AddDeliveryDriver;