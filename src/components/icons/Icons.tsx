import type { IconProps } from '../../types';
import styles from './Icons.module.css';
import logo from '../../data/gigachat-sign-logo.svg'
import horizontalLogo from '../../data/gigachat-horizontal-logo.svg';

type BaseIconProps = IconProps & {
    children: React.ReactNode;
    viewBox?: string;
    stroke?: string;
    fill?: string;
    className?: string;
    strokeWidth?: number;
};

export const BaseIcon = ({
    size = 16,
    children,
    viewBox = '0 0 24 24',
    stroke = 'currentColor',
    fill = 'none',
    strokeWidth = 2,
    className,
}: BaseIconProps) => (
    <svg
        width={size}
        height={size}
        viewBox={viewBox}
        stroke={stroke}
        fill={fill}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {children}
    </svg>
);

export const AttachIcon = (props: IconProps) => (
    <BaseIcon {...props} viewBox="0 0 20 20" strokeWidth={1.5}>
        <path d="M17 11l-5 5a5 5 0 01-7.07-7.07l7-7a3 3 0 014.24 4.24L9 13.5a1 1 0 01-1.41-1.41L14 6" />
    </BaseIcon>
);

export const SendIcon = (props: IconProps) => (
    <BaseIcon {...props} strokeWidth={2.5}>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </BaseIcon>
);

export const StopIcon = (props: IconProps) => (
    <BaseIcon {...props} fill="var(--error)" stroke="none">
        <rect x="3" y="3" width="18" height="18" rx="2" />
    </BaseIcon>
);

export const CloseIcon = (props: IconProps) => (
    <BaseIcon {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </BaseIcon>
);

export const BurgerIcon = (props: IconProps) => (
    <BaseIcon {...props}>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </BaseIcon>
);

export const CheckMarkIcon = (props: IconProps) => (
    <BaseIcon {...props}>
        <polyline points="20 6 9 17 4 12" />
    </BaseIcon>
);

export const CopyIcon = (props: IconProps) => (
    <BaseIcon {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </BaseIcon>
);

export const MessageIcon = (props: IconProps) => (
    <BaseIcon {...props} strokeWidth={1.5}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </BaseIcon>
);

export const EditIcon = (props: IconProps) => (
    <BaseIcon {...props}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </BaseIcon>
);

export const DeleteIcon = (props: IconProps) => (
    <BaseIcon {...props}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </BaseIcon>
);

export const SearchIcon = (props: IconProps) => (
    <BaseIcon
        {...props}
        className={styles.searchIcon}
        stroke="var(--text-muted)"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </BaseIcon>
);

export const PlusIcon = (props: IconProps) => (
    <BaseIcon {...props} strokeWidth={2.5}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </BaseIcon>
);

export const UserIcon = (props: IconProps) => (
    <BaseIcon {...props} stroke="var(--text-muted)">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </BaseIcon>
);

export const SettingsIcon = (props: IconProps) => (
    <BaseIcon {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33
         1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4
         a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06
         A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3
         a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9
         a1.65 1.65 0 0 0-.33-1.82l-.06-.06
         a2 2 0 0 1 2.83-2.83l.06.06
         A1.65 1.65 0 0 0 9 4.68
         a1.65 1.65 0 0 0 1-1.51V3
         a2 2 0 0 1 4 0v.09
         a1.65 1.65 0 0 0 1 1.51
         a1.65 1.65 0 0 0 1.82-.33l.06-.06
         a2 2 0 0 1 2.83 2.83l-.06.06
         A1.65 1.65 0 0 0 19.4 9
         a1.65 1.65 0 0 0 1.51 1H21
         a2 2 0 0 1 0 4h-.09
         a1.65 1.65 0 0 0-1.51 1z" />
    </BaseIcon>
);

export const ErrorIcon = (props: IconProps) => (
    <BaseIcon
        {...props}
        className={styles.errorIcon}
        stroke="var(--error)"
        strokeWidth={2.5}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </BaseIcon>
);

export const AssistantIcon = ({ size = 20 }: IconProps) => (
    <div className={styles.assistantAvatar}>
        <img
            src={logo}
            alt="Giga-Chat"
            width={size}
            height={size}
        />
    </div >
);

export const LogoIcon = ({ size = 40 }: IconProps) => (
    <div className={styles.logoIcon}>
        <img
            src={horizontalLogo}
            alt="Giga-Chat"
            width={size * 3}
            height={size}
        />
    </div>
);