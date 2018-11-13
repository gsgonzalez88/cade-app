
const mongoose = require("mongoose");
// const Joi = require('joi');
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://gsgonzalez88:5LbVnKSmDb58F9p@ds043329.mlab.com:43329/employeecontrol";


//connects our back end code with the database, checks for errors in the connection
mongoose.connect(dbRoute, {useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('No se pudo conectar a la base de datos...',err))

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));


// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
    Data.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
  });
  
  // this is our update method
  // this method overwrites existing data in our database
  router.post("/updateData", (req, res) => {
    const { dni, update } = req.body;
    Data.findOneAndUpdate(dni, update, err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });

  // this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
    const { dni } = req.body;
    Data.findOneAndDelete(dni, err => {
      if (err) return res.send(err);
      return res.json({ success: true });
    });
  });
  
  // this is our create methid
  // this method adds new data in our database
  router.post("/putData", (req, res) => {
    let data = new Data();
    
    const { dni, name } = req.body;
  
    if ((!dni && dni !== 0) || !name) {
      return res.json({
        success: false,
        error: "INVALID INPUTS"
      });
    }
    data.name = name;
    data.dni = dni;    
    data.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });
  
  // append /api for our http requests
  app.use("/api", router);
  
  // launch our backend into a port
  // hacemos que express "escuche" en el puerto api_port
  app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
  