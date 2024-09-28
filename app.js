const express = require("express");

require("dotenv").config();

const app = express();
const {Sequelize} = require('sequelize');
const port = process.env.PORT;

    
    const sequelize = new Sequelize( process.env.DB_URL, {
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: true,
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
});

sequelize.sync({alter: true}).then(() => {console.log("Database connected!")})
                            .catch((err) => {console.log(err)}); 

// app.get("/", (req, res) => {res.send("Hello World!")});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});