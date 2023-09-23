import {  Card, Row } from 'antd';
import Button from '../Button';
import React from 'react';
import "./styles.css";
function index({income,expense,totalBalance,showExpenseModal,showIncomeModel}) {
  return (
    <div>
        <Row className='my-row'>
            <Card className='my-card' bordered={true}>
                <h2>Current Balance</h2>
                <p>₹{totalBalance}</p>
                <Button text="Reset Balance" blue={true}/>
            </Card>

            <Card className='my-card' bordered={true}>
                <h2>Total Income</h2>
                <p>₹{income}</p>
                <Button text="Add Income" blue={true} onClick={showIncomeModel}/>
            </Card>

            <Card className='my-card' bordered={true}>
                <h2>Total Expense</h2>    
                <p>₹{expense}</p>
                <Button text="Add Expense" blue={true} onClick={showExpenseModal}/>
            </Card>
        </Row>
    </div>
  )
}

export default index