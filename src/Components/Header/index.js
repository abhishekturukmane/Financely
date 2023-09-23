import React, { useEffect } from "react";
import "./styles.css";
import { auth } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth'; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import  userImg  from "../../assests/user.svg"
const Header=()=>{
    const [user, loading] = useAuthState(auth);
    const navigate=useNavigate();
    useEffect(()=>{
        if(user)
        {
            navigate("/dashboard");
        }
        
    },[user,loading]);
    const logoutfunc=()=>{
            try{
                signOut(auth).then(() => {
                    // Sign-out successful.
                   
                    toast.success("Logged out successfully!");
                    navigate("/");
                  }).catch((error) => {
                    // An error happened.
                    toast.error(error.message);
                  });
            }
            catch(e){
                toast.error(e.message);
            }

    }
    return(
        <>
            <div className="navbar">
              <p className="logo">Financely.</p>  
              {
                user && (
                
                    <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                    
                        <img src={user.photoURL?user.photoURL:userImg}

                            style={{
                                borderRadius:"50%",
                                height:'1.5rem',
                                width:'1.5rem'
                            }}
                        />
                        <p className="logo link" onClick={logoutfunc}>LogOut</p>
                    </div>
                )
              }
              
                
            </div>

        </>
    )

}
export default Header;