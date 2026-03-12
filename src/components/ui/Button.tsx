import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'ghost',
    size = 'md',
    disabled,
    className,
    type = 'button',
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                disabled && styles.disabled,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};