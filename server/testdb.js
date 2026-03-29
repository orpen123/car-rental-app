import mongoose from 'mongoose';

const uri = "mongodb+srv://admin:admin1234@cluster0.otjmwbc.mongodb.net/car-rental-app.db=Cluster0";

mongoose.connect(uri, { family: 4 })
  .then(() => console.log('✅ Connected to Atlas!'))
  .catch((err) => console.log('❌ Error:', err.message));