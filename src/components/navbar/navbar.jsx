import { Link } from "react-router-dom"

import "./navbar.css"

function Navbar (props) {

    return (
        <div id="navbarContainer">
            <ul id="linkContainer">
                <li>
                    <Link class="LinkContainer" id="homeLink" to="/">
                    <label hidden htmlFor="homeLink">Home Link</label>
                    <h3>Home</h3>
                    </Link>   
                </li>
                <li>
                    <Link class="LinkContainer" id="createPromptLink" to="/prompt/create/">
                    <label hidden htmlFor="createPromptLink">Create Prompt Link</label>
                    <h3>Genreate Prompt</h3>
                    </Link>   
                </li>
                <li>
                    <Link class="LinkContainer" id="createImageLink" to="/image/create/-1">
                    <label hidden htmlFor="createImageLink">Create Image Link</label>
                    <h3>Genreate Image</h3>
                    </Link>   
                </li>
                {(!props.user.user_id)?
                <li>
                    <Link class="LinkContainer" id="accountLink" to="/accounts">
                    <label hidden htmlFor="accountLink">Sign In Link</label>
                    <h3>Sign In</h3>
                    </Link>
                </li>
                :
                <li>
                    <Link class="LinkContainer" onClick={props.handleSignOut}>
                    <label hidden htmlFor="accountLink">Sign Out Button</label>
                    <h3>Sign Out</h3>
                    </Link>
                </li>
}
            </ul>
        </div>
    )
}

export {Navbar}