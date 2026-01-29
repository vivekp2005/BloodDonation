const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "bloodappsecret";


// ================= DB =================
mongoose.connect("mongodb://127.0.0.1:27017/bloodDonationDB")
.then(()=>console.log("MongoDB Connected ✅"));


// ================= SCHEMAS =================

// User
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// Donor
const donorSchema = new mongoose.Schema({
  name: String,
  bloodGroup: String,
  phone: String,
  city: String
});
const Donor = mongoose.model("Donor", donorSchema);


// ================= JWT MIDDLEWARE =================
function auth(req, res, next){
  const token = req.headers.authorization;

  if(!token) return res.status(401).send("Login Required");

  try{
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  }catch{
    res.status(401).send("Invalid Token");
  }
}


// ================= AUTH =================

// Register
app.post("/register", async (req,res)=>{
  const {email,password} = req.body;

  const hashed = await bcrypt.hash(password,10);

  await User.create({email,password:hashed});

  res.send("Registered ✅");
});

// Login
app.post("/login", async (req,res)=>{
  const {email,password} = req.body;

  const user = await User.findOne({email});
  if(!user) return res.status(400).send("User not found");

  const ok = await bcrypt.compare(password,user.password);
  if(!ok) return res.status(400).send("Wrong password");

  const token = jwt.sign({id:user._id}, SECRET);

  res.json({token});
});


// ================= DONOR ROUTES =================

// Add donor
app.post("/donors", auth, async (req,res)=>{
  await Donor.create(req.body);
  res.send("Donor Added");
});

// Get donors
app.get("/donors", auth, async (req,res)=>{
  const donors = await Donor.find();
  res.json(donors);
});


app.listen(5000, ()=>console.log("Server running 🚀"));
