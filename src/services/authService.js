import api from "./api";

// POST auth/login
export async function login(dados) {
    const response = await api.post("/auth/login", dados);

    const { acessToken, refreshToken } = response.data

    localStorage.setItem("appbit_acess_token", acessToken)
    localStorage.setItem("appbit_refresh_token", refreshToken)

    return response.data
}


// POST auth/refresh
export async function refreshToken() {
    const refreshToken = localStorage.getItem("appbit_refresh_token")

    const response = await api.post("/auth/refresh", {
        refreshToken,
    });
    
    const { acessToken } = response.data
    
    localStorage.setItem("appbit_acess_token", acessToken)
    
    return response.data
    
}


//Logout
export function logout() {
    localStorage.removeItem("appbit_acess_token")
    localStorage.removeItem("appbit_refresh_token")
}