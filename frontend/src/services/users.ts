import API from "./api";

export const fetchUsers = () => {
    return API.get("/user");
}

export const fetchLibrarians = () => {
    return API.get("/user/librarian");
}