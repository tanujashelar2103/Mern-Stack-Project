import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api'; // This imports the function for API calls

const TransactionsTable = () => {
   const [transactions, setTransactions] = useState([]);
   const [month, setMonth] = useState('03');  // Default month is March
   const [search, setSearch] = useState('');
   const [page, setPage] = useState(1);
   const [total, setTotal] = useState(0);
   const perPage = 10;

   useEffect(() => {
      fetchTransactions();
   }, [month, search, page]);

   const fetchTransactions = async () => {
      try {
         const response = await getTransactions(month, search, page, perPage);
         setTransactions(response.data.transactions);
         setTotal(response.data.total);
      } catch (error) {
         console.error('Error fetching transactions:', error);
      }
   };

   return (
      <div>
         <h2>Transactions Table</h2>
         <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
               <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
         </select>
         <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions"
         />
         <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</button>
         <button onClick={() => setPage(prev => (page * perPage < total) ? prev + 1 : prev)}>Next</button>
         <table>
            <thead>
               <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Date of Sale</th>
               </tr>
            </thead>
            <tbody>
               {transactions.map(transaction => (
                  <tr key={transaction._id}>
                     <td>{transaction.title}</td>
                     <td>{transaction.description}</td>
                     <td>${transaction.price}</td>
                     <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default TransactionsTable;
