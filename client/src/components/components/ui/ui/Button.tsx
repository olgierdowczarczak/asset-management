import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    children: ReactNode;
}

function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
    const baseStyles =
        'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        ghost: 'hover:bg-gray-800 text-gray-300 focus:ring-gray-500',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}

export default Button;
