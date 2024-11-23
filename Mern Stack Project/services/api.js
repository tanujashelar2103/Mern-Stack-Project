import axios from 'axios';

const API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

export const getTransactions = (month, search = '', page = 1, perPage = 10) =>
   axios.get(`${API_URL}/transactions`, { params: { month, search, page, perPage } });

export const getStatistics = (month) =>
   axios.get(`${API_URL}/statistics`, { params: { month } });

export const getBarChartData = (month) =>
   axios.get(`${API_URL}/barchart`, { params: { month } });

export const getPieChartData = (month) =>
   axios.get(`${API_URL}/piechart`, { params: { month } });

export const getCombinedData = (month) =>
   axios.get(`${API_URL}/combined`, { params: { month } });
