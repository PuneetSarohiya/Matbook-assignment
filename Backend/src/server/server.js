import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; 
import form from './routes/form.routes.js';
import submission from './routes/submission.routes.js'

dotenv.config(); 

const app = express();

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json({ limit: "25mb"}));
app.use(express.urlencoded({ limit: "25mb"}));
app.use((req, res,next)=> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
})
app.use(cors(corsOptions));
app.use('/api/form', form);
app.use('/api/submission', submission)

const port = process.env.PORT || 5000; 

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error("MongoDB connection error:", error);
  });

app.get('/', (req, res) => {
  res.send('Hello from MongoDB and Express!');
});
