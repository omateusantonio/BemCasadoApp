export interface IFinancialEntry {
    id: number;
    transactionDescription: string;
    transactionValue: number;
    transactionDate: Date;
    transactionType: string;
}