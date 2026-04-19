import React, { useEffect, useRef } from 'react';
import styles from './DeleteForm.module.css'
import type { Chat } from '../../types';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface DeleteFormProps {
  chat: Chat | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteForm: React.FC<DeleteFormProps> = ({
  chat,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (chat) {
      cancelRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [chat]);

  if (!chat) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className={styles.box}>
        <div className={styles.icon}>
          <Icon name='delete' size={24} />
        </div>

        <h2 className={styles.title}>
          Вы уверены, что хотите удалить диалог?
        </h2>

        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="md"
            ref={cancelRef}
            onClick={onCancel}
            className={styles.cancelBtn}>
            Отмена
          </Button>

          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            className={styles.deleteBtn}>
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
};

DeleteForm.displayName = 'DeleteForm';