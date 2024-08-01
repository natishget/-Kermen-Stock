// App.jsx
import React from 'react'
import LoginComponent from './components/Login'
import Pages from './components/Pages'
import { BrowserRouter,Routes,Route } from 'react-router-dom'


const App = () => {
    return (    
       <BrowserRouter>
        <Routes>
         <Route index  element={<LoginComponent/>}/>
         <Route path='/pages/*'  element={<Pages/>}/>
         </Routes>
       </BrowserRouter>
    )
}

export default App
