import { EyeOff, Eye } from "lucide-react";
import { FormFieldProps } from "../types";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
const FormField = <T extends FieldValues>({
  label,
  type,
  name,
  placeholder,
  register,
  error,
  icon,
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={inputType}
          className="input input-bordered w-full pl-10"
          placeholder={placeholder}
          {...register(name)}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-base-content/40" />
            ) : (
              <Eye className="h-5 w-5 text-base-content/40" />
            )}
          </button>
        )}
      </div>
      {error && <span className="pt-3 error-message text-red-700">{error.message}</span>}
    </div>
  );
};

export default FormField;
