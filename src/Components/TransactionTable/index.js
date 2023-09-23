import React, { useState } from 'react'
import { Table ,Select, Radio,RadioGroupProps } from "antd";
import "../../index.css";
import searchImg  from "../../assests/search.svg"
import { parse, unparse } from 'papaparse';
import { type } from '@testing-library/user-event/dist/type';
import { click } from '@testing-library/user-event/dist/click';
import { doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
function TransactionTable({transactions
   ,fetchTransactions,addTransaction
}) {
    const [search,setSearch]=useState("");
    //const [searchTerm, setSearchTerm] = useState("");
    //const [selectedTag, setSelectedTag] = useState("");
    const [typeFilter,setTypeFilter]=useState("");
    const [sortKey,setSortKey]=useState("");
    const {Option}=Select;
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag',
        },
        {
           title: 'Type',
           dataIndex: 'type',
           key: 'type',
        },
        {
           title: 'Date',
           dataIndex: 'date',
           key: 'date',
        }
    ];
    let filteredTransactions=transactions.filter((item)=>
    {
        return(
            item.name?.toLowerCase().includes(search.toLowerCase()) 
            && item.type?.includes(typeFilter)

            // item.name == 'search'
            // && item.type == 'typeFilter'
            // item.name.toLowerCase().includes(search.toLowerCase()) &&
            // item.type.includes(typeFilter)
        )
    }
    );

    
    let sortedTransactions=filteredTransactions.sort((a,b)=>{
        if(sortKey==='date')
        {
            return new Date(a.date)-new Date(b.date);
        }
        else if(sortKey==="amount")
        {
            return a.amount-b.amount;
        }
        else{
            return 0;
        }
    });

    function exportToCsv(){
        var csv = unparse({
            "fields": ["name", "type" ,"tag" ,"date" ,"amount"],
            "data": transactions,
            
        });

        const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
        const url=URL.createObjectURL(blob);
        const link=document.createElement("a");
        link.href=url;
        link.download="transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }

    function importFromCSV(event){
        event.preventDefault();
        try{
            parse(event.target.files[0],{
                header:true,
                complete:
                        async function (results) 
                        {
                            for(const transaction of results.data){
                                console.log("Transactions:",transaction);
                                const newTransaction={
                                    ...transaction,
                                    amount:parseFloat(transaction.amount)
                                };
                                await addTransaction(newTransaction,true);
                            }
                            
                        }
            });
            toast.success("All Transactions Added!");
            fetchTransactions();
            event.target.files=null;
        } 
        catch(e){
            toast.error(e.message);
        }
    }
    return (
        <>
            <div style={{ width:"95%",padding:"0rem 2rem"}}>
                <div style={{display:"flex",
                            justifyContent:"space-between",
                            gap:"1rem",
                            alignItems:"center",
                            marginBottom:"1rem"
                        }}  
                >
                    <div className='input-flex'>
                        <img src={searchImg} width="16"/>
                        <input value={search} onChange={(e)=>setSearch(e.target.value)}
                        placeholder='Search by Name' />
                    </div>

                    <Select
                        className='select-input'
                        onChange={(value)=>setTypeFilter(value)}
                        value={typeFilter}
                        placeholder='Filter'
                        allowClear
                    >
                        <Option value="">All</Option>
                        <Option value="income">income</Option>
                        <Option value="expense">expense</Option>
                    </Select>
                </div>   

                <div className='my-table'>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        alignItems:"center",
                        width:"100%",
                        marginBottom:"1rem"
                    
                        }}
                    >
                        <h2>My Transaction</h2>
                        <Radio.Group
                            className='input-radio'
                            onChange={(e)=>setSortKey(e.target.value)}
                            value={sortKey}
                        >
                            <Radio.Button value="">No sort</Radio.Button>
                            <Radio.Button value="date">Sort by date</Radio.Button>
                            <Radio.Button value="amount">sort by amount</Radio.Button>
                        </Radio.Group>
                    <div style={{
                        display:"flex",
                        justifyContent:"center",
                        gap:"1rem",
                        width:"400px"
                        }}
                    >
                        <button className='btn' onClick={exportToCsv}>Export to CSV</button>
                        <label for="file-csv" className='btn btn-blue'>Import from CSV</label>
                        <input id="file-csv" type='file' accept='.csv' required
                        style={{display:"none"}} 
                        onChange={importFromCSV}
                        />
                    </div>
                    </div>
                </div>



            </div>
            
            
           

           
            <Table dataSource={sortedTransactions} columns={columns} />;
    
        </> 
    )
}

export default TransactionTable;



// import React, { useRef, useState } from "react";
// import { Input, Table, Select, Radio } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import searchImg  from "../../assests/search.svg"
// import { parse } from "papaparse";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// const { Search } = Input;
// const { Option } = Select;

// const TransactionTable = ({
//   transactions,
//   exportToCsv,
//   addTransaction,
//   fetchTransactions,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [sortKey, setSortKey] = useState("");
//   const fileInput = useRef();

//   function importFromCsv(event) {
//     event.preventDefault();
//     try {
//       parse(event.target.files[0], {
//         header: true,
//         complete: async function (results) {
//           // Now results.data is an array of objects representing your CSV rows
//           for (const transaction of results.data) {
//             // Write each transaction to Firebase, you can use the addTransaction function here
//             console.log("Transactions", transaction);
//             const newTransaction = {
//               ...transaction,
//               amount: parseInt(transaction.amount),
//             };
//             await addTransaction(newTransaction, true);
//           }
//         },
//       });
//       toast.success("All Transactions Added");
//       fetchTransactions();
//       event.target.files = null;
//     } catch (e) {
//       toast.error(e.message);
//     }
//   }

//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       key: "type",
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//     },
//     {
//       title: "Amount",
//       dataIndex: "amount",
//       key: "amount",
//     },
//     {
//       title: "Tag",
//       dataIndex: "tag",
//       key: "tag",
//     },
//   ];

//   const filteredTransactions = transactions.filter((transaction) => {
//     const searchMatch = searchTerm
//       ? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
//       : true;
//     const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
//     const typeMatch = typeFilter ? transaction.type === typeFilter : true;

//     return searchMatch && tagMatch && typeMatch;
//   });

//   const sortedTransactions = [...filteredTransactions].sort((a, b) => {
//     if (sortKey === "date") {
//       return new Date(a.date) - new Date(b.date);
//     } else if (sortKey === "amount") {
//       return a.amount - b.amount;
//     } else {
//       return 0;
//     }
//   });

//   const dataSource = sortedTransactions.map((transaction, index) => ({
//     key: index,
//     ...transaction,
//   }));

//   return (
//     <div
//       style={{
//         width: "100%",
//         padding: "0rem 2rem",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           gap: "1rem",
//           alignItems: "center",
//           marginBottom: "1rem",
//         }}
//       >
//         <div className="input-flex">
//           <img src={searchImg} width="16" />
//           <input
//             placeholder="Search by Name"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <Select
//           className="select-input"
//           onChange={(value) => setTypeFilter(value)}
//           value={typeFilter}
//           placeholder="Filter"
//           allowClear
//         >
//           <Option value="">All</Option>
//           <Option value="income">Income</Option>
//           <Option value="expense">Expense</Option>
//         </Select>
//       </div>

//       {/* <Select
//         style={{ width: 200, marginRight: 10 }}
//         onChange={(value) => setSelectedTag(value)}
//         placeholder="Filter by tag"
//         allowClear
//       >
//         <Option value="food">Food</Option>
//         <Option value="education">Education</Option>
//         <Option value="office">Office</Option>
//       </Select> */}
//       <div className="my-table">
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             width: "100%",
//             marginBottom: "1rem",
//           }}
//         >
//           <h2>My Transactions</h2>

//           <Radio.Group
//             className="input-radio"
//             onChange={(e) => setSortKey(e.target.value)}
//             value={sortKey}
//           >
//             <Radio.Button value="">No Sort</Radio.Button>
//             <Radio.Button value="date">Sort by Date</Radio.Button>
//             <Radio.Button value="amount">Sort by Amount</Radio.Button>
//           </Radio.Group>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               gap: "1rem",
//               width: "400px",
//             }}
//           >
//             <button className="btn" onClick={exportToCsv}>
//               Export to CSV
//             </button>
//             <label for="file-csv" className="btn btn-blue">
//               Import from CSV
//             </label>
//             <input
//               onChange={importFromCsv}
//               id="file-csv"
//               type="file"
//               accept=".csv"
//               required
//               style={{ display: "none" }}
//             />
//           </div>
//         </div>

//         <Table columns={columns} dataSource={dataSource} />
//       </div>
//     </div>
//   );
// };

// export default TransactionTable;