import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    ref={ref}
                    className={`w-full px-3 py-2 bg-gray-900 border ${
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-700 focus:ring-primary-500'
                    } rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${className}`}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
