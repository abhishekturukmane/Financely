import React, { useState } from "react";
import "./styles.css"
// import { Form } from "react-router-dom";
import Input from "../Input/index";
import Button from "../Button";
import {createUserWithEmailAndPassword ,
        signInWithEmailAndPassword} from "firebase/auth";
import {toast} from "react-toastify";
import { auth,db, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import {signInWithPopup, GoogleAuthProvider } from "firebase/auth";
 
const SignupSignin=()=>{
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [confirmPassword,setConfirmPassword]=useState();
    const [loading,setLoading]=useState(false);
    const [loginForm,setLoginForm]=useState(false);
    const navigate=useNavigate();
    function signUpWithEmail(){
          // console.log(name,password,email,confirmPassword)
          setLoading(true);
          if(name!='' && email!='' && password!='' && confirmPassword!='')
          {
                if(password===confirmPassword)
                {
                    createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                      // Signed in 
                      const user = userCredential.user;
                      console.log(user);
                      toast.success("user created");
                      setLoading(false);
                      setName('');
                      setEmail('');
                      setPassword('');
                      setConfirmPassword('');
                      createDoc(user);
                      navigate('/dashboard');
                      //create a doc
                      
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      toast.error(errorMessage);
                      setLoading(false);
                      // ..
                    });
                }
                else{
                    toast.error("password and ConfirmPassword does not match!");
                    setLoading(false);
                }
           
          }
          else{
                toast.error("All fields are Mandatory! ")
                setLoading(false);
          }
    }

    const loginUsingEmail=()=>{
        setLoading(true);
        if(email!='' && password!='')
        {
            console.log("email:",email+"password:",password);
            
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                toast.success("Logged In successfully!");
                // createDoc(user);
                setLoading(false);
                navigate('/dashboard');
        
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                toast.error(errorMessage);

            });

            
        }
        else{
            toast.error("All fields are Mandatory!");
            setLoading(false);
        }
        
    }
    function googleAuth(){
        setLoading(true);
        try{

            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("User>>>",user);
                createDoc(user);
                setLoading(false);
                navigate('/dashboard');
                toast.success("user authenticated!");
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                setLoading(false);
            });

        }
        catch(e){

            toast.error(e.message);
            setLoading(false);
        }
    }
    async function createDoc(user){
        setLoading(true);
        if(!user) return;

        const userRef=doc(db,"users",user.uid);
        const userData=await getDoc(userRef);

        if(!userData.exists())
        {
            try{
                await setDoc(doc(db,"users",user.uid),{
                    name: user.displayName ? user.displayName:name,
                    email:user.email,
                    photoURL:user.photoURL? user.photoURL:"",
                    createdAt:new Date()

                });
                toast.success("Doc created!");
                setLoading(false);
            }
            catch(e)
            {
                toast.error(e.message);
                setLoading(false);
            }
        }
        else{
            toast.error("Doc already exists");
            setLoading(false);
        }
    }
    return(
        <>
        {
            loginForm ?(
                <div className="signup-wrapper">
                <h1 className="title">
                    Log in <span style={{color:"var(--theme)"}}>Financely.</span>
                </h1>
                <form>
                   
                    <Input
                        type="email"  
                        label={"Email"}
                        state={email}
                        setState={setEmail}
                        placeholder={"JohnDoe@gmail.com "}
                    />

                    <Input
                        type="password"  
                        label={"password"}
                        state={password}
                        setState={setPassword}
                        placeholder={"Example@123"}
                    />

                   

                    <Button 
                        disabled={loading}
                        text={loading?"Loading...":"Login using Email and Password" } 
                        onClick={loginUsingEmail}/>
                    <p style={{textAlign:"center"}} >or</p>
                    <Button
                     onClick={googleAuth}
                     text={loading?"Loading...":"Login using Google"} blue={true}/>
                     <p className="p-login" onClick={()=>setLoginForm(!loginForm)}>or Don't have an account? click Here</p>
                </form>
            </div>
            ):(
               
                <div className="signup-wrapper">
                <h1 className="title">
                    Signup on <span style={{color:"var(--theme)"}}>Financely.</span>
                </h1>
                <form>
                    <Input 
                        type="text" 
                        label={"Full Name"}
                        state={name}
                        setState={setName}
                        placeholder={"John Doe "}
                    />

                    <Input
                        type="email"  
                        label={"Email"}
                        state={email}
                        setState={setEmail}
                        placeholder={"JohnDoe@gmail.com "}
                    />

                    <Input
                        type="password"  
                        label={"password"}
                        state={password}
                        setState={setPassword}
                        placeholder={"Example@123"}
                    />

                    <Input
                        type="password" 
                        label={"confirm password"}
                        state={confirmPassword}
                        setState={setConfirmPassword}
                        placeholder={"Example@123"}
                    />

                    <Button 
                        disabled={loading}
                        text={loading?"Loading...":"Signup using Email and Password" } 
                        onClick={signUpWithEmail}/>
                    <p style={{textAlign:"center"}} >or</p>
                    <Button
                     onClick={googleAuth}
                     text={loading?"Loading...":"Signup using Google"} blue={true}/>
                     <p className="p-login" onClick={()=>setLoginForm(!loginForm)}>or Have an account? click Here</p>
                </form>
            </div>
            
            )
        }
          
        </>
    )

}
export default SignupSignin;