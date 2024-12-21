import API from "./api";

export const login = async (username: string, password: string) => {
    return API.post('/user/login', {
        username,
        password
    });
}

export const signup = async (username: string, password: string, cpassword: string) => {
    return API.post('/user/signup', {
        username,
        password,
        cpassword
    });
}