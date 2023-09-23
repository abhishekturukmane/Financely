import React from 'react'
import transactions from "../assests/transactions.svg"
function NoTransactions() {
  return (
    <div style={{display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        flexDirection:"column",
        marginBottom:"2rem"
        }} 
    > 
        <img src={transactions} style={{width:"400px", margin:"4rem"}}/>
        <p style={{textAlign:"center",fontSize:"1.2rem"}}>
            you have No transactions currently.
        </p>
    </div>
  )
}

export default NoTransactions