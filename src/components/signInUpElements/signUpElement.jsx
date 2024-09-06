//---------------------------------------------React Imports-----------------------------------------------// 
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//-------------------------------------------Component Imports---------------------------------------------//

//--------------------------------------------Service Imports----------------------------------------------//
import * as authService from "../../../services/authService";

const SignUpForm = (props) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState([""])
    const [formData, setformData] = useState({
        username: "", 
        password: "",
        password_verify: "",
    })

    // Used to display error messages to the user
    const updateMessage = (error) => {
        console.dir(error)
        setErrorMessage(error)
    }

    // For updating the input's text values
    const handleChange = (event) => {
        setformData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Runs user fetch from the services file
            const newUserResponse = await authService.signup(formData)
            // re-routes to the home directory
            navigate("/accounts")
        } catch (error) {
            console.dir(error)
            updateMessage(error.message)
        }
    }

    // Deconstructs the formData
    const {username, password, password_verify} = formData

    const checkValidInput = () => {
        // Returns true if input's data is incorrect
        return !(username && password && password === password_verify)
    }

    return (
        <main className='center-items'>
            <h1>Welcome to your SignupForm</h1>
            <p className='error' id="errorMessage">{errorMessage}</p>
            <form className='signup-form' onSubmit={handleSubmit}>
                <div>
                <label htmlFor="usernameInput">Username</label>
                <input id="usernameInput" type="text" value={username} name="username" onChange={handleChange}></input>
                </div><div>
                <label htmlFor="passwordInput">Password</label>
                <input id="passwordInput" type="password" value={password} name="password" onChange={handleChange}></input>
                </div><div>
                <label htmlFor="passwordVerifyInput">Re-Type Password</label>
                <input id="passwordVerifyInput" type="password" value={password_verify} name="password_verify" onChange={handleChange}></input>
                </div>
                <button disabled={checkValidInput()}>Create Account</button>
            </form>
        </main>
    )

    
}

//------------------------------------------------Exports--------------------------------------------------//

export default SignUpForm;