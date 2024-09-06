import { useState, useEffect, createContext } from 'react'
import { Routes, Route } from "react-router-dom"
import './App.css'

import * as authService from '../services/authService'

// Page Imports
import { PromptCreatePage } from './pages/promptCreatePage/promptCreatePage'
import { Navbar } from './components/navbar/navbar'
import { LandingPage } from './pages/landingPage/landingPage'
import { ImageCreatePage } from './pages/imageCreatePage/imageCreatePage'
import { SignInUpPage } from './pages/signInUpPage/signInUpPage'
import { PromptUpdatePage } from './pages/PromptUpdatePage/PromptUpdatePage'

function App() {

  const [user, setUser] = useState({})

  function handleSignOut() {
    setUser({})
    authService.signout()
  }

  return (<>
      <Navbar user={user} handleSignOut={handleSignOut}/>
      <Routes>
        <Route path='/' element={<LandingPage user={user}/>}/>
        <Route path='/accounts' element={<SignInUpPage setUser={setUser}/>}/>
        <Route path='/prompt/create/' element={<PromptCreatePage user={user}/>}/>
        <Route path='/prompts/:promptId' element={< PromptUpdatePage user={user} />} />
        <Route path='/image/create/:promptId' element={<ImageCreatePage />}/>
      </Routes>
      </>
  )
}

export default App
