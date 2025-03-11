export interface ToastData {
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
}