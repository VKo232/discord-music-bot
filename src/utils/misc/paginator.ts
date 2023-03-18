export class PaginatedQueue<T> {
  private readonly _queue: T[];
  private _currentPage: number;
  private readonly _pageSize: number;
  private readonly _totalPages: number;

  constructor(queue: T[], pageSize = 10) {
    this._queue = queue;
    this._currentPage = 1;
    this._pageSize = pageSize;
    this._totalPages = Math.ceil(queue.length / pageSize);
  }

  public get items(): T[] {
    const start = (this._currentPage - 1) * this._pageSize;
    const end = start + this._pageSize;
    return this._queue.slice(start, end);
  }

  public get currentPage(): number {
    return this._currentPage;
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get totalPages(): number {
    return this._totalPages;
  }

  public nextPage(): void {
    if (this._currentPage < this._totalPages) {
      this._currentPage++;
    }
  }

  public previousPage(): void {
    if (this._currentPage > 1) {
      this._currentPage--;
    }
  }
}
