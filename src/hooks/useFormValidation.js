import { useState, useCallback } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
  if (!value) return "Email is required";
  if (!EMAIL_RE.test(value)) return "Enter a valid email address";
  return "";
}

export function validatePassword(value, { min = 8 } = {}) {
  if (!value) return "Password is required";
  if (value.length < min) return `Password must be at least ${min} characters`;
  return "";
}

export function passwordStrength(value) {
  if (!value) return { score: 0, label: "" };
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}

/**
 * Generic controlled-form hook: tracks values + per-field errors and only
 * shows an error once a field has been touched (blurred) or the form submitted.
 */
export function useFormValidation(initialValues, validators) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const setValue = useCallback((field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
  }, []);

  const validateField = useCallback(
    (field, value) => {
      const validator = validators[field];
      const message = validator ? validator(value ?? values[field]) : "";
      setErrors((e) => ({ ...e, [field]: message }));
      return message;
    },
    [validators, values]
  );

  const handleBlur = useCallback(
    (field) => {
      setTouched((t) => ({ ...t, [field]: true }));
      validateField(field);
    },
    [validateField]
  );

  const validateAll = useCallback(() => {
    const nextErrors = {};
    Object.keys(validators).forEach((field) => {
      nextErrors[field] = validators[field](values[field]);
    });
    setErrors(nextErrors);
    setTouched(Object.keys(validators).reduce((acc, f) => ({ ...acc, [f]: true }), {}));
    return Object.values(nextErrors).every((msg) => !msg);
  }, [validators, values]);

  const errorFor = (field) => (touched[field] ? errors[field] : "");

  return { values, setValue, handleBlur, validateAll, errorFor };
}
