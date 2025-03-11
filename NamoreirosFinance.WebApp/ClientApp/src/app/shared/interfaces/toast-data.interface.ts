export interface IToastData {
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
}