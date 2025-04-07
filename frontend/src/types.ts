import { FieldError, FieldValues, UseFormRegister, Path } from "react-hook-form";

export type FormFieldProps<T extends FieldValues> = {
    label: string;
    type: string;
    placeholder: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: FieldError | undefined;
    icon: React.ReactNode;
};
