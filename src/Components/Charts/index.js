import React from 'react';
import { Line ,Pie } from '@ant-design/charts';

const ChartComponent = ({sortedTransactions}) => {
  const data = sortedTransactions.map((item)=>{
    return {date:item.date,amount:item.amount}
  });

  const config = {
    data:data,
    autoFit: false,
    xField: 'date',
    yField: 'amount',
   
  };

  const SpendingData=sortedTransactions.filter((transaction)=>{
    if(transaction.type=="expense")
    {
        return {tag:transaction.tag,amount:transaction.amount}
    }
  });

  let newSpendings=[
    {tag:"food",amount:0},
    {tag:"education",amount:0},
    {tag:"office",amount:0}
  ];

  SpendingData.forEach((item)=>{
    if(item.tag=="food")
    {
        newSpendings[0].amount+=item.amount;
    }
    else if(item.tag=="education")
    {
        newSpendings[1].amount+=item.amount;
    }
    else 
    {
        newSpendings[2].amount+=item.amount;
    }
  });

  const spendingConfig={
    data:newSpendings,
    width:500,
    angleField:"amount",
    colorField:"tag"
  };


  let chart;
  let pieChart;
  return (
    
    <>
    
        <div className="analytics">
            <div className="charts-Analytics">
                
                <h2>Your Analytics</h2><br/>
                <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
            </div>
        
            <div className='spendings-chart'>
                <h2>Your Spendings</h2><br/>
                <Pie  {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
          </div>  
        </div>
    </>
  );
};
export default ChartComponent;