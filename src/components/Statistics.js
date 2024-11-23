import React, { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';

const Statistics = ({ month }) => {
   const [statistics, setStatistics] = useState({});

   useEffect(() => {
      fetchStatistics();
   }, [month]);

   const fetchStatistics = async () => {
      try {
         const response = await getStatistics(month);
         setStatistics(response.data);
      } catch (error) {
         console.error('Error fetching statistics:', error);
      }
   };

   return (
      <div>
         <h2>Statistics</h2>
         <div>
            <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
         </div>
      </div>
   );
};

export default Statistics;
