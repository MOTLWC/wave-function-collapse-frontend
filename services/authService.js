const BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

const signup = async (formData) => {
    try {
        // Fetch to the api with formData 
        console.log(`${BACKEND_URL}auth/sign-up/`)
        const res = await fetch(`${BACKEND_URL}auth/sign-up/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
        console.dir(res.json)
        //  Converts response to json format
        const data = await res.json()
        //  Checks for a returned error
        if (res.status >= 400) {
            if (data.username) throw new Error("Invalid Username")
            if (data.non_field_errors) throw new Error(data.non_field_errors.join("\n"))
            throw new Error(data[0])
            
        }
        // Adding returned token to the client's local storage
        if (data.token) localStorage.setItem("token", data.token);
        return data
    } catch (error) {
        console.dir(error)
        throw new Error(error.message)
    }
}

const signin = async (formData) => {
    try {
        const res = await fetch(`${BACKEND_URL}auth/sign-in/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json()
        console.log("Data")
        console.log(data)
        if (data.detail) throw new Error(data.detail)
        if (data.access) {
            localStorage.setItem("token", data.access)
            const user = JSON.parse(atob(data.access.split(".")[1]))
            return user
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

const signout = () => {
    localStorage.removeItem("token")
}

export { signup, signin, signout }