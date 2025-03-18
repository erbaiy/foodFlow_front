import * as Yup from 'yup';

export const menuItemSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .required('Name is required'),
    description: Yup.string()
        .max(500, 'Description must not exceed 500 characters')
        .required('Description is required'),
    price: Yup.string()
        .matches(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number with up to two decimal places') // Allow numbers with up to two decimal places
        .required('Price is required'),
    image: Yup.mixed().required('Image is required'),
});