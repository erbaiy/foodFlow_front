import * as Yup from 'yup';

export const restaurantValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Restaurant name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  cuisineType: Yup.string()
    .required('Cuisine type is required')
    .min(2, 'Cuisine type must be at least 2 characters')
    .max(30, 'Cuisine type must not exceed 30 characters'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(100, 'Address must not exceed 100 characters'),
  location: Yup.string()
    .required('Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(50, 'Location must not exceed 50 characters'),
  banner: Yup.mixed()
    .required('Banner is required')
    .test('fileSize', 'File too large', (target) => !target.value || (target.value && target.value.size <= 5242880)) // 5MB
    .test('fileFormat', 'Unsupported Format', (target) => 
      !target.value || (target.value && ['image/jpg', 'image/jpeg', 'image/png'].includes(target.value.type))
    ),
  logo: Yup.mixed()
    .required('Logo is required')
    .test('fileSize', 'File too large', (target) => !target.value || (target.value && target.value.size <= 2097152)) // 2MB
    .test('fileFormat', 'Unsupported Format', (target) => 
      !target.value || (target.value && ['image/jpg', 'image/jpeg', 'image/png'].includes(target.value.type))
    ),
  manager: Yup.string().required('Manager is required'),
});

export default restaurantValidationSchema;