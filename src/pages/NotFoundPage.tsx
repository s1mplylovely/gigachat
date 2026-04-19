import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export const NotFoundPage: React.FC = () => (
  <div className={styles.container}>
    <span className={styles.code}>404</span>
    <p className={styles.text}>Страница не найдена</p>
    <Link to="/" className={styles.link}>
      ← На главную
    </Link>
  </div>
);