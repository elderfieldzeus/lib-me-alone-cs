import { ICreateBook } from "../types/Book";
import API from "./api";

export const fetchBooks = (page: number) => {
    return API.get(`/book/${page}`);
}

export const borrowBook = (user_id: number, book_id: number) => {
    return API.post("/borrowedbook", {
        user_id,
        book_id
    })
}

export const createBook = (book: ICreateBook) => {
    return API.post("/book", book);
}

export const deleteBook = (book_id: number) => {
    return API.delete("/book/" + book_id);
}

export const fetchYourRequestedBooks = (user_id: number) => {
    return API.get("/borrowedbook/requested/" + user_id);
}

export const fetchYourUnreturnedBooks = (user_id: number) => {
    return API.get("/borrowedbook/unreturned/" + user_id);
}

export const cancelBorrow = (book_id: number) => {
    return API.delete("/borrowedbook/requested/" + book_id);
}