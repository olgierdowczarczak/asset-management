import { type InputHTMLAttributes, forwardRef } from 'react';

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    error?: string;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    ref={ref}
                    type="number"
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

NumberInput.displayName = 'NumberInput';

export default NumberInput;
