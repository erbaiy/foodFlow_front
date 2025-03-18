import { useState, useCallback } from 'react';



const useForm = (initialState, validationSchema, onSubmit) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const isMultiStep = Array.isArray(validationSchema);

  const validateField = useCallback(async (name, value) => {
    const schema = isMultiStep ? validationSchema[currentStep] : validationSchema;
    if (!schema) return;

    try {
      await schema.validateAt(name, { [name]: value });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, [name]: error.message }));
    }
  }, [currentStep, validationSchema, isMultiStep]);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === 'file' ? files[0] : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
    setTouched(prev => ({ ...prev, [name]: true }));
  }, [validateField]);

  const validateStep = useCallback(async (step = currentStep) => {
    const schema = isMultiStep ? validationSchema[step] : validationSchema;
    if (!schema) return { isValid: true, errors: {} };

    try {
      await schema.validate(formData, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (validationErrors) {
      const newErrors = validationErrors.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
      return { isValid: false, errors: newErrors };
    }
  }, [formData, validationSchema, currentStep, isMultiStep]);

  // const handleStepChange = useCallback(async (direction) => {
  //   if (!isMultiStep) return;

  //   const { isValid } = await validateStep();
  //   if (isValid) {
  //     setCurrentStep(prev => direction === 'next' ? prev + 1 : prev - 1);
  //   }
  // }, [validateStep, isMultiStep]);
  

  const handleStepChange = useCallback(async (direction) => {
    if (!isMultiStep) return;

    const { isValid, errors: stepErrors } = await validateStep();

    if (isValid) {
        setErrors({}); // Clear errors on successful step change
        setTouched({}); // Optional: Reset touched state
        setCurrentStep(prev => direction === 'next' ? prev + 1 : prev - 1);
    } else {
        setErrors(stepErrors); // Ensure errors are displayed
        // Optional: Provide user feedback if step change is prevented
        console.log("Validation errors prevent step change.");
    }
}, [validateStep, isMultiStep]);
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { isValid } = await validateStep();
    if (isValid) {
      await onSubmit(formData);
    }
    setIsSubmitting(false);
  }, [formData, onSubmit, validateStep]);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    currentStep,
    handleChange,
    handleSubmit,
    handleStepChange,
    setFormData,
    setErrors,
    setTouched,
    validateStep,
    isMultiStep,
  };
};

export default useForm;