import React, { useMemo } from "react";
import type { ChangeEvent } from 'react';
import styles from "./Slider.module.css";

interface SliderProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
    label,
    min,
    max,
    step = 0.01,
    value = (min + max) / 2,
    onChange,
}) => {
    const percent = useMemo(() => {
        return ((value - min) / (max - min)) * 100;
    }, [value, min, max]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{value.toFixed(2)}</span>
            </div>

            <div className={styles.trackWrapper}>
                <div className={styles.track} />

                <div
                    className={styles.progress}
                    style={{ width: `${percent}%` }}
                />

                <input
                    className={styles.range}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                />

                <div
                    className={styles.thumb}
                    style={{ left: `calc(${percent}% - 7px)` }}
                />
            </div>
        </div>
    );
};