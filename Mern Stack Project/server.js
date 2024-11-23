const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('https://s3.amazonaws.com/roxiler.com/product_transaction.json', { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err));

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

mongoose.connect('https://s3.amazonaws.com/roxiler.com/product_transaction.json', { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('MongoDB connected'))
   .catch(err => console.log(err));

   const ProductTransaction = require('./models/ProductTransaction');

app.get('/api/init', async (req, res) => {
   try {
      const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      // Clear existing data
      await ProductTransaction.deleteMany();
      // Insert new data
      await ProductTransaction.insertMany(data);
      res.send('Database initialized');
   } catch (error) {
      res.status(500).send('Error initializing database');
   }
});


app.get('/api/transactions', async (req, res) => {
  const { search = '', page = 1, perPage = 10 } = req.query;
  const searchQuery = new RegExp(search, 'i');  // 'i' makes it case-insensitive

  try {
     // Find transactions with search and pagination
     const transactions = await ProductTransaction.find({
        $or: [
           { title: searchQuery },
           { description: searchQuery },
           { price: searchQuery }
        ]
     })
     .skip((page - 1) * perPage)
     .limit(parseInt(perPage));

     // Get total number of transactions for pagination
     const total = await ProductTransaction.countDocuments({
        $or: [
           { title: searchQuery },
           { description: searchQuery },
           { price: searchQuery }
        ]
     });

     res.json({
        transactions,
        total,
        page: parseInt(page),
        perPage: parseInt(perPage)
     });tt
  } catch (error) {
     res.status(500).send('Error fetching transactions');
  }
});

const ProductTransaction = require('./models/ProductTransaction');


app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2022-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const totalSaleAmount = await ProductTransaction.aggregate([
     { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
     { $group: { _id: null, totalAmount: { $sum: "$price" } } }
  ]);

  const totalSoldItems = await ProductTransaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: true });
  const totalNotSoldItems = await ProductTransaction.countDocuments({ dateOfSale: { $gte: startDate, $lt: endDate }, sold: false });

  res.json({
     totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
     totalSoldItems,
     totalNotSoldItems
  });
});

app.get('/api/barchart', async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2022-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
     const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity },
     ];

     const data = await Promise.all(priceRanges.map(async ({ range, min, max }) => {
        const count = await ProductTransaction.countDocuments({
           dateOfSale: { $gte: startDate, $lt: endDate },
           price: { $gte: min, $lt: max === Infinity ? max : max + 1 }
        });
        return { range, count };
     }));

     res.json(data);
  } catch (error) {
     res.status(500).send('Error fetching bar chart data');
  }
});

app.get('/api/piechart', async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(`2022-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
     const categories = await ProductTransaction.aggregate([
        { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: "$category", count: { $sum: 1 } } }
     ]);

     res.json(categories);
  } catch (error) {
     res.status(500).send('Error fetching pie chart data');
  }
});

































































