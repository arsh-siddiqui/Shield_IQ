// Tailwind's JIT scanner only picks up class names that appear literally in source,
// so any color that's chosen dynamically (from data) must be resolved through a
// static lookup table like this rather than built with template strings.

export const colorBg50 = {
  primary: "bg-primary-50",
  secondary: "bg-secondary-50",
  accent: "bg-accent-50",
  danger: "bg-danger-50",
  success: "bg-success-50",
};

export const colorText = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  danger: "text-danger",
  success: "text-success",
};

export const colorBorder = {
  primary: "border-primary",
  secondary: "border-secondary",
  accent: "border-accent",
  danger: "border-danger",
  success: "border-success",
};

export const colorBgSolid = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  danger: "bg-danger",
  success: "bg-success",
};

export const colorBg10 = {
  primary: "bg-primary/10",
  secondary: "bg-secondary/10",
  accent: "bg-accent/10",
  danger: "bg-danger/10",
  success: "bg-success/10",
};

export const difficultyTone = {
  Beginner: "success",
  Intermediate: "accent",
  Advanced: "danger",
  Easy: "success",
  Medium: "accent",
  Hard: "danger",
};

export const riskTone = {
  High: "danger",
  Medium: "accent",
  Low: "secondary",
  Safe: "success",
};
