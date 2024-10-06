const express = require("express");
const bcrypt = require('bcrypt');

require("dotenv").config();

const app = express();
app.use(express.json());
const { Sequelize, DataTypes } = require('sequelize');
const port = process.env.PORT;
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "postgres",
    logging: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

// Sync the database
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");
  }).catch(err => console.error("Error syncing database:", err));


  /*Table definitions*/
  //Items
const item = sequelize.define("item", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isInStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isInChart: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
})

//Users
const user = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
})


//HTTP METHODS

//GET
app.get("/get-items", async (req, res) => {
  try {
    const items = await item.findAll();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching the items");
  }
});


//POST
app.post("/create-user", async (req, res)=> {
    const {username, password} = req.body;

    try{
      const newUser = await user.create({
        username,
        password
      });
      res.status(201).json(newUser);
    } catch(err){
      console.error(err);
      res.status(500).send("Error inserting the new user");
    }
})

app.post("/create-item", async (req, res) => {
    const { name, isInStock, isInChart } = req.body;
  
    try {
      const newItem = await item.create({
        name,
        isInStock,
        isInChart,
      });
      res.status(201).json(newItem);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error inserting the item");
    }
  });

  //DELETE
app.delete("/delete-item/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedItem = await item.destroy({
        where: { id: id }
      });
  
      if (deletedItem === 0) {
        return res.status(404).send("Item not found"); 
      }
  
      res.status(200).send("Item deleted successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting the item");
    }
  });

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});