import * as Yup from 'yup';
import { userValidationSchema } from './userValidation';
import { restaurantValidationSchema } from './restaurantValidation';

export const managerDetailsSchema = Yup.object().shape({
  fullName: userValidationSchema.fields.fullName,
  email: userValidationSchema.fields.email,
  password: userValidationSchema.fields.password,
  phoneNumber: userValidationSchema.fields.phoneNumber,
  address: userValidationSchema.fields.address,
});

export const restaurantDetailsSchema = Yup.object().shape({
  name: restaurantValidationSchema.fields.name,
  cuisineType: restaurantValidationSchema.fields.cuisineType,
  address: restaurantValidationSchema.fields.address,
  location: restaurantValidationSchema.fields.location,
});

export const imageUploadSchema = Yup.object().shape({
  banner: restaurantValidationSchema.fields.banner,
  logo: restaurantValidationSchema.fields.logo,
});

export const validateStep = async (step, formData) => {
  let schemaToValidate;
  switch (step) {
    case 0:
      schemaToValidate = managerDetailsSchema;
      break;
    case 1:
      schemaToValidate = restaurantDetailsSchema;
      break;
    case 2:
      schemaToValidate = imageUploadSchema;
      break;
    default:
      return { isValid: true, errors: {} };
  }

  try {
    await schemaToValidate.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (validationErrors) {
    const errors = {};
    validationErrors.inner.forEach((error) => {
      errors[error.path] = error.message;
    });
    return { isValid: false, errors };
  }
};



