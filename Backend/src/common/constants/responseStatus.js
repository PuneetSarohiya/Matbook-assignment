export const STATUS_SUCCESS_OK = 200;
export const STATUS_SUCCESS_CREATED = 201;
export const PERMANENT_REDIRECT = 308;
export const TEMPORARY_REDIRECT = 307;
export const NOT_FOUND = 404;
export const INTERNAL_SERVER_ERROR = 500;
export const PERMISSION_DENIED = 403;

export const validateField = (field, value) => {
  const errors = [];
  const rules = field.validation || {};

  if ((value === undefined || value === null || value === "") && rules.required) {
    errors.push("This field is required");
    return errors;
  }

  if (value === undefined || value === null || value === "") {
    return errors;
  }

  if (typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength)
      errors.push(`Minimum length is ${rules.minLength}`);

    if (rules.maxLength && value.length > rules.maxLength)
      errors.push(`Maximum length is ${rules.maxLength}`);
  }

  if (rules.regex) {
    const regex = new RegExp(rules.regex);
    if (!regex.test(value))
      errors.push("Invalid format");
  }

  if (field.type === "number") {
    const num = Number(value);

    if (rules.min !== undefined && num < rules.min)
      errors.push(`Minimum value is ${rules.min}`);

    if (rules.max !== undefined && num > rules.max)
      errors.push(`Maximum value is ${rules.max}`);
  }

  if (field.type === "date") {
    const dateValue = new Date(value);

    if (rules.minDate && dateValue < new Date(rules.minDate))
      errors.push(`Date must be after ${rules.minDate}`);

    if (rules.maxDate && dateValue > new Date(rules.maxDate))
      errors.push(`Date must be before ${rules.maxDate}`);
  }

  if (field.type === "multi-select" && Array.isArray(value)) {
    if (rules.minSelected && value.length < rules.minSelected)
      errors.push(`Select at least ${rules.minSelected}`);

    if (rules.maxSelected && value.length > rules.maxSelected)
      errors.push(`Select at most ${rules.maxSelected}`);
  }

  return errors;
};
