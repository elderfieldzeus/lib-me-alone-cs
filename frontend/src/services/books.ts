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