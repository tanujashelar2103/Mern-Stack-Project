import React, { useState, useEffect } from 'react';
import { getPieChartData } from '../services/api';

const PieChart = ({ month }) => {
   const [pieChartData, setPieChartData] = useState([]);

   useEffect(() => {
      fetchPieChartData();
   }, [month]);

   const fetchPieChartData = async () => {
      try {
         const response = await getPieChartData(month);
         setPieChartData(response.data);
      } catch (error) {
         console.error('Error fetching pie chart data:', error);
      }
   };

   return (
      <div>
         <h2>Pie Chart</h2>
         <ul>
            {pieChartData.map(data => (
               <li key={data._id}>{data._id}: {data.count} items</li>
            ))}
         </ul>
      </div>
   );
};

export default PieChart;
