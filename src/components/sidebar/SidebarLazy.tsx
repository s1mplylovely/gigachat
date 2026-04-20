import React from 'react';
import styles from './SidebarLazy.module.css';

type Size = number | string;

interface Props {
  w?: Size;          // width
  h?: Size;          // height
  r?: Size;          // border-radius
  m?: Size;          // margin
  inline?: boolean;  // inline mode
  className?: string;
}

function toUnit(value?: Size): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton: React.FC<Props> = ({
  w, h, r, m, inline, className, }) => {
  const style = {
    ...(w !== undefined && { '--w': toUnit(w) }),
    ...(h !== undefined && { '--h': toUnit(h) }),
    ...(r !== undefined && { '--r': toUnit(r) }),
    ...(m !== undefined && { '--m': toUnit(m) }),
  } as React.CSSProperties;

  return (
    <span
      className={[styles.root, inline ? styles.inline : '', className || ''].join(' ')}
      style={style}
    />
  );
};

Skeleton.displayName = 'Skeleton';

export const SidebarLazy: React.FC = () => (
  <aside aria-label="Загрузка боковой панели" className={styles.container}>
    {/* Logo placeholder */}
    <Skeleton w={120} h={32} r={8} m="0 0 8px 0" />

    {/* New chat button placeholder */}
    <Skeleton h={38} r={8} />

    {/* Search placeholder */}
    <Skeleton h={34} r={8} />

    {/* Chat item skeletons */}
    {[80, 60, 90, 70, 55].map((w, i) => (
      <div key={i} className={styles.item}>
        <Skeleton w={`${w}%`} h={13} r={4} />
        <Skeleton w="40%" h={11} r={4} />
      </div>
    ))}
  </aside>
);

SidebarLazy.displayName = 'SidebarLazy';