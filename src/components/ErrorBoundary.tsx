import React, { Component } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
    // Контент для защиты
    children: React.ReactNode;
    fallback?: (error: Error, reset: () => void) => React.ReactNode;
    // например "MessageList"
    scope?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

function DefaultFallback({
    error,
    reset,
    scope,
}: {
    error: Error;
    reset: () => void;
    scope?: string;
}) {
    return (
        <div role="alert" className={styles.container}>
            <span className={styles.icon}>⚠️</span>

            <strong className={styles.title}>
                {scope ? `Ошибка в ${scope}` : 'Что-то пошло не так'}
            </strong>

            <span className={styles.message}>
                {error.message || 'Непредвиденная ошибка. Попробуйте обновить страницу.'}
            </span>

            <button onClick={reset} className={styles.button}>
                Попробовать снова
            </button>
        </div>
    );
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    // Выводим состояние ошибки синхронно, чтобы резервный вариант отображался в том же цикле
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    // Вызывается после рендеринга при обнаружении ошибки
    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        const scope = this.props.scope ?? 'Unknown';

        // Structured log
        console.error(
            `[ErrorBoundary:${scope}]`,
            '\nError:', error.message,
            '\nStack:', error.stack,
            '\nComponent stack:', info.componentStack,
        );
    }

    private handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        const { hasError, error } = this.state;
        const { children, fallback, scope } = this.props;

        if (hasError && error) {
            if (fallback) {
                return <>{fallback(error, this.handleReset)}</>;
            }
            return (
                <DefaultFallback error={error} reset={this.handleReset} scope={scope} />
            );
        }

        return <>{children}</>;
    }
}