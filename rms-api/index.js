const express = require('express');
const app = express()

require('dotenv').config()

const PORT = process.env.PORT

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Application routes
require("./routes/referenceData.routes")(app);
require("./routes/projectRequisition.routes")(app);

app.listen(PORT , () => {console.log(`Server started on port ${PORT}`)})