import React from "react";
import styles from "./Toggle.module.css";

interface ToggleProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    return (
        <label className={styles.wrapper}>
            <input
                type="checkbox"
                checked={checked}
                onChange={handleChange}
                className={styles.input}
            />

            <span className={styles.track}>
                <span className={styles.thumb} />
            </span>

            {label && <span className={styles.label}>{label}</span>}
        </label>
    );
};