import { type HTMLAttributes, type ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

function Card({ children, className = '', ...props }: CardProps) {
    return (
        <div
            className={`bg-gray-900 border border-gray-800 rounded-lg shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;
