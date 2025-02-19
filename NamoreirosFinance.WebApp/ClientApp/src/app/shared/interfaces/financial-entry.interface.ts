export interface IFinancialEntry {
    id: number;
    description: string;
    value: number;
    transactionDate: Date;
    type: string;
}