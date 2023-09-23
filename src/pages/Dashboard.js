import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Cards from "../Components/Cards"
import { Modal } from "antd";
import AddExpense1 from "../Components/Modals/AddExpense1.js";
import AddIncome1 from "../Components/Modals/AddIncome1";
import moment from "moment/moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import TransactionTable from "../Components/TransactionTable";
import ChartComponent from "../Components/Charts";
import NoTransactions from "../Components/NoTransactions";
const Dashboard=()=>{

        const [user]=useAuthState(auth);
        const [isExpenseModalVisible,setIsExpenseModalVisible]=useState(false);
        const [isIncomeModalVisible,setIsIncomeModalVisible]=useState(false);
        const [loading,setLoading]=useState(false);
        const [transactions,setTransactions]=useState([]);
        const [income,setIncome]=useState(0);
        const [expense,setExpense]=useState(0);
        const [totalBalance,setTotalBalance]=useState(0);

        useEffect(()=>{
            fetchTransactions();
        },[user]);

        useEffect(()=>{
            calculateBalance();
        },[transactions]);

        function calculateBalance(){

            let incomeTotal=0;
            let expenseTotal=0;

            transactions.forEach((transaction)=>{
                if(transaction.type==='income')
                {
                    incomeTotal+=transaction?.amount;
                    
                }
                else{

                    if(transaction?.amount != NaN)
                    {
                        expenseTotal+=transaction?.amount;
                        //console.log(transaction)
                    }
                   
                }
            });
            //console.log(expenseTotal)
            setIncome(incomeTotal);
            setExpense(expenseTotal);
            setTotalBalance(incomeTotal-expenseTotal);
        }
        async function fetchTransactions(){
            setLoading(true);
            if(user)
            {
                const q = query(collection(db, `users/${user.uid}/transactions`));

                const querySnapshot = await getDocs(q);
                let transactionsArray=[];
                querySnapshot.forEach((doc) => {
                        transactionsArray.push(doc.data());
                });
                setTransactions(transactionsArray);
                console.log(transactionsArray);
                toast.success("Transaction Fetched!");
            }
            setLoading(false);
        }
        const showExpenseModal=()=>{
            setIsExpenseModalVisible(true);

        }

        const showIncomeModel=()=>{
            setIsIncomeModalVisible(true);
        }

        const handleExpenseCancel=()=>{
            setIsExpenseModalVisible(false);
        }

        const handleIncomeCancel=()=>{
            setIsIncomeModalVisible(false);
        }

        const onFinish=(values,type)=>{
            
            const newTransaction={
                type:type,
                date:values.date.format("YYYY-MM-DD"),
                amount:parseFloat(values.amount),
                tag:values.tag,
                name:values.name

            };
            addTransaction(newTransaction);
        }


        async function addTransaction(transaction,many){
            try{
                const docRef=await addDoc(collection(db,`users/${user.uid}/transactions`)
                ,transaction);
                console.log("Doc written with ID:",docRef.id);
                toast.success("Transaction Added!");
                let newArr=transactions;
                newArr.push(transaction);
                setTransactions(newArr);
                calculateBalance();
            }
            catch(e)
            {
                console.log("error adding doc:",e);
                toast.error("couldn't add transaction!");
            }
        }

        let sortedTransactions=transactions.sort((a,b)=>{
            return new Date(a.date)-new Date(b.date);
        })
        return(
            <>
                <div>
                    <Header/>

                    {
                        loading?(<p>Loading...</p>):(
                            <>
                                <Cards 
                                    income={income}
                                    expense={expense}
                                    totalBalance={totalBalance}
                                    showExpenseModal={showExpenseModal}
                                    showIncomeModel={showIncomeModel}/>
                                {
                                    transactions.length!=0?<ChartComponent 
                                    sortedTransactions={sortedTransactions}/>:<NoTransactions/>
                                }
                        
                                <AddExpense1 isExpenseModalVisible={isExpenseModalVisible}
                                            handleExpenseCancel={handleExpenseCancel}
                                            onFinish={onFinish}
                                />
    
                                <AddIncome1 isIncomeModalVisible={isIncomeModalVisible}
                                            handleIncomeCancel={handleIncomeCancel}
                                            onFinish={onFinish}
                                />
                                <TransactionTable transactions={transactions}
                                    addTransaction={addTransaction}
                                    fetchTransactions={fetchTransactions}    
                                />
                            </>
                        )
                    }
                   
                    
                
                </div>
            
            </>
        )
}
export default Dashboard;