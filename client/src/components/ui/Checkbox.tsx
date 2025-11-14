import { type InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <div className="flex items-center">
                    <input
                        ref={ref}
                        type="checkbox"
                        className={`w-4 h-4 bg-gray-900 border ${
                            error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-700 focus:ring-primary-500'
                        } rounded text-primary-600 focus:ring-2 transition-colors ${className}`}
                        {...props}
                    />
                    {label && (
                        <label
                            htmlFor={props.id}
                            className="ml-2 text-sm text-gray-300 cursor-pointer"
                        >
                            {label}
                        </label>
                    )}
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
