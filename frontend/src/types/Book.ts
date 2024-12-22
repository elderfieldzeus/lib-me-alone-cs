export interface IBook {
    id: number;
    name: string;
    author: string;
    description: string;
    is_borrowed: boolean;
}

export interface ICreateBook {
    name: string;
    author: string;
    description: string;
}

export interface IYourBook {
    id: number;
    book_name: string;
    borrower_name: string;
    date_borrowed: Date;
}