import * as Yup from "yup";

export const userValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  
    phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\+[0-9]+$/, "Phone number must start with '+' followed by numbers")
    .min(11, "Phone number must be at least 10 digits plus the '+' prefix")
    .max(16, "Phone number must not exceed 15 digits plus the '+' prefix"),

    
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters"),
});