import React, { useState, useEffect } from 'react';
import { getBarChartData } from '../services/api';

const BarChart = ({ month }) => {
   const [barChartData, setBarChartData] = useState([]);

   useEffect(() => {
      fetchBarChartData();
   }, [month]);

   const fetchBarChartData = async () => {
      try {
         const response = await getBarChartData(month);
         setBarChartData(response.data);
      } catch (error) {
         console.error('Error fetching bar chart data:', error);
      }
   };

   return (
      <div>
         <h2>Bar Chart</h2>
         <ul>
            {barChartData.map(data => (
               <li key={data.range}>{data.range}: {data.count} items</li>
            ))}
         </ul>
      </div>
   );
};

export default BarChart;
