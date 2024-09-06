import { useState, useContext } from "react"

import SignInForm from "../../components/signInUpElements/signInElement"
import SignUpForm from "../../components/signInUpElements/signUpElement"

function SignInUpPage(props) {

    const [showSignIn, setShowSignIn] = useState(true)

    function toggleShowSignIn() {
        (showSignIn)?setShowSignIn(false):setShowSignIn(true)
    }

    return (<>
            <button onClick={toggleShowSignIn}>Sign Up</button>
                {(showSignIn) ?
                    (<SignInForm setUser={props.setUser} />)
                    :
                    (<SignUpForm setUser={props.setUser} />)
                }
    </>
    )
}


export { SignInUpPage }