const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()

const PORT = process.env.PORT

// enable cors
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin" , "http://localhost:4200");
    res.setHeader("Access-Control-Allow-Headers" , "Origin , X-Requested-With , Content-Type , Accept , Authorization");
    res.setHeader("Access-Control-Allow-Methods" , "GET , POST , PATCH , DELETE , OPTIONS");
    next();
});

app.get("/api/healthCheck", (req, res) => {
    res.json({"Status": "OK"});
});


// Application routes
require("./routes/referenceData.routes")(app);
require("./routes/projectRequisition.routes")(app);

app.listen(PORT , () => {console.log(`Server started on port ${PORT}`)})