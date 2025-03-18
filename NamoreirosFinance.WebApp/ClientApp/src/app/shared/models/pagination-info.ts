export class PaginationInfo {
    private _skip: number = 0;
    private _take: number = 10;
    private _totalItems: number = 0;
    private _totalPages: number = 0;
    private _currentPage: number = 1;

    constructor(init?: Partial<PaginationInfo>) {
        Object.assign(this, init);
    }

    skip: number = 0;
    take: number = 10;
    totalItems: number = 0;
    totalPages: number = 0;
    currentPage: number = 1;

    private _calculateTotalPages (): void {
        const totalPages = Math.ceil(this._totalItems / this._take);
        this._totalPages = totalPages > 0 ? totalPages : 1;
    }

    updatePaginationInfo(skip: number, take: number, totalItems: number): void {
        this._skip = skip;
        this._take = take;
        this._totalItems = totalItems;
    }
}