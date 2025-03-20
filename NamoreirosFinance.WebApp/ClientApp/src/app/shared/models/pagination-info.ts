export class PaginationInfo {
    private _skip: number = 0;
    private _take: number = 10;
    private _totalItems: number = 0;
    private _totalPages: number = 0;
    private _currentPage: number = 1;

    get skip(): number { return this._skip; }
    get take(): number { return this._take; }
    get totalItems(): number { return this._totalItems; }
    get totalPages(): number { return this._totalPages; }
    get currentPage(): number { return this._currentPage; }

    set totalItems(value: number) {
        this._totalItems = value;
        this.updateTotalPages();
    }

    updateTotalPages (): void {
        const totalPages = Math.ceil(this._totalItems / this._take);
        this._totalPages = totalPages > 0 ? totalPages : 1;
    }

    updateTake(take: number): void {
        this._take = take;
        this.updateTotalPages();
    }

    updatePaginationInfo(skip: number, take: number, totalItems: number): void {
        this._skip = skip;
        this._take = take;
        this._totalItems = totalItems;
        this.updateTotalPages();
    }

    updateCurrentPage(currentPage: number): void {
        if (currentPage < 1) throw new Error('Current page cannot be less than 1');
        if (currentPage > this._totalPages) throw new Error('Current page cannot be greater than total pages');
        this._currentPage = currentPage;
    }
}