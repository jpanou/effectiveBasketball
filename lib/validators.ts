export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 12) errors.push("Must be at least 12 characters");
  if (!/[A-Z]/.test(password)) errors.push("Must contain an uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("Must contain a number");
  if (!/[!@#$%^&*]/.test(password)) errors.push("Must contain a special character (!@#$%^&*)");
  return { valid: errors.length === 0, errors };
}

export function validateTextField(
  value: unknown,
  fieldName: string,
  { min = 1, max = 500 }: { min?: number; max?: number } = {}
): ValidationResult {
  if (typeof value !== "string") return { valid: false, error: `${fieldName} must be a string` };
  if (value.trim().length < min)
    return { valid: false, error: `${fieldName} must be at least ${min} character${min === 1 ? "" : "s"}` };
  if (value.length > max)
    return { valid: false, error: `${fieldName} is too long (max ${max} characters)` };
  if (/<script\b/i.test(value))
    return { valid: false, error: `${fieldName} contains invalid content` };
  return { valid: true };
}

export function validateEmail(email: unknown): ValidationResult {
  if (typeof email !== "string") return { valid: false, error: "Email must be a string" };
  if (email.length > 254) return { valid: false, error: "Email is too long" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, error: "Invalid email address" };
  return { valid: true };
}

export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function safeErrorMessage(error: unknown): string {
  console.error("[Internal Error]:", error);
  return "Something went wrong. Please try again.";
}
