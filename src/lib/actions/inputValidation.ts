// inputValidation.ts
import type { Action } from "svelte/action";

type InputType = "text" | "email" | "tel";

interface ValidationOptions {
  type: InputType;
  required?: boolean;
}

export const inputValidation: Action<HTMLInputElement, ValidationOptions> = (node, { type, required = false } = { type: "text" }) => {
  // Auto-detect required from the HTML attribute if not explicitly passed
  const isRequired = required || node.hasAttribute("required");
  let hasBlurred = false;

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").substring(0, 10);
    const areaCode = digits.substring(0, 3);
    const prefix = digits.substring(3, 6);
    const suffix = digits.substring(6, 10);

    if (digits.length > 6) {
      return `(${areaCode}) ${prefix}-${suffix}`;
    } else if (digits.length > 3) {
      return `(${areaCode}) ${prefix}`;
    } else if (digits.length > 0) {
      return `(${areaCode}`;
    }
    return value;
  }

  function validateInput(): boolean {
    const value = node.value.trim();

    if (isRequired && !value) {
      return false;
    }

    if (!value) return true; // Empty but not required is valid

    switch (type) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "tel":
        return /^\(\d{3}\) \d{3}-\d{4}$/.test(value);
      default:
        return true;
    }
  }

  function updateValidationState() {
    if (!hasBlurred) return;

    const isValid = validateInput();
    node.classList.toggle("invalid", !isValid);
    node.classList.toggle("valid", isValid && node.value.trim() !== "");
  }

  function handleBlur() {
    hasBlurred = true;
    updateValidationState();
  }

  function handleInput() {
    if (type === "tel") {
      // Format phone numbers as user types
      const formatted = formatPhone(node.value);
      if (formatted !== node.value) {
        node.value = formatted;
      }
    }

    updateValidationState();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (type === "tel") {
      // Only allow numbers for phone input
      if (e.ctrlKey) return;
      if (e.key.length > 1) return; // Allow special keys
      if (/[0-9]/.test(e.key)) return;
      e.preventDefault();
    }
  }

  // Set up the input based on type
  switch (type) {
    case "email":
      node.setAttribute("placeholder", "email@example.com");
      break;
    case "tel":
      node.setAttribute("placeholder", "(123) 456-7890");
      break;
  }

  // Add event listeners
  node.addEventListener("blur", handleBlur);
  node.addEventListener("input", handleInput);
  if (type === "tel") {
    node.addEventListener("keydown", handleKeydown);
  }

  return {
    update(newOptions: ValidationOptions) {
      // Handle option updates if needed
      type = newOptions.type;
      required = newOptions.required ?? false;
    },

    destroy() {
      node.removeEventListener("blur", handleBlur);
      node.removeEventListener("input", handleInput);
      if (type === "tel") {
        node.removeEventListener("keydown", handleKeydown);
      }
    },
  };
};
