import React from "react";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter , Route , Routes } from "react-router-dom";
import "./App.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App=()=>{

    return(
      
      <BrowserRouter>
        <ToastContainer/>
        <Routes>
          <Route path="/" element={<Signup/>}/>
          <Route path="/Dashboard" element={<Dashboard/>}/>
        </Routes>
        
      </BrowserRouter>
     
      
    )

}
export default App;