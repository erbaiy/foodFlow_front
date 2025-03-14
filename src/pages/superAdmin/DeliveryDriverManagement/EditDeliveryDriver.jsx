import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import InputField from '../../../components/InputField';
import axiosInstance from '../../../config/axios';

const EditDeliveryDriver = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: ''
  });

  useEffect(() => {
    if (!location.state?.driverData) {
      toast.error(t('No driver data available'));
      navigate('/dashboard/super-admin/delivery-drivers');
      return;
    }
    // Extract only the fields we need
    const { 
      fullName, 
      email, 
      phoneNumber, 
      address 
    } = location.state.driverData;

    setFormData({
      fullName,
      email,
      phoneNumber,
      address,
      password: ''
    });
  }, [location.state, navigate, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create update object with only allowed fields
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      };

      // Only add password if it's not empty
      if (formData.password) {
        updateData.password = formData.password;
      }

 
      await axiosInstance.put(`/super-admin/delivery-driver/${id}`, updateData);
      toast.success(t('Delivery driver updated successfully'));
      navigate('/dashboard/super-admin/delivery-drivers');
    } catch (error) {
      console.error('Error updating delivery driver:', error);
      toast.error(t('Failed to update delivery driver'));
    }
  };

  return (
    <div className="max-w-xl mx-auto border border-slate-200 dark:border-slate-800 rounded-md bg-slate-50 dark:bg-slate-900 p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        {t('Edit Delivery Driver')}
      </h1>
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
          placeholder={t('Password (leave empty to keep current)')}
          icon={() => <Lock size={20} />}
          required={false}
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
        >
          {t('Update Delivery Driver')}
        </button>
      </form>
    </div>
  );
};

export default EditDeliveryDriver;