import React, { useState, useEffect } from 'react';
import { getCombinedData } from '../services/api';

const CombinedData = () => {
   const [combinedData, setCombinedData] = useState({});
   const [month, setMonth] = useState('03');  // Default month is March

   useEffect(() => {
      fetchCombinedData();
   }, [month]);

   const fetchCombinedData = async () => {
      try {
         const response = await getCombinedData(month);
         setCombinedData(response.data);
      } catch (error) {
         console.error('Error fetching combined data:', error);
      }
   };

   return (
      <div>
         <h2>Combined Data</h2>
         <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
               <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
         </select>
         <div>
            <h3>Transactions</h3>
            <ul>
               {combinedData.transactions?.map((transaction) => (
                  <li