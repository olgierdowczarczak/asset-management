import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ error, options, placeholder, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <select
                    ref={ref}
                    className={`w-full px-3 py-2 bg-gray-900 border ${
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-700 focus:ring-primary-500'
                    } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${className}`}
                    {...props}
                >
                    {placeholder && !props.required && <option value="">{placeholder}</option>}
                    {placeholder && props.required && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    },
);

Select.displayName = 'Select';

export default Select;
