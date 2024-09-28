const express = require("express");

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

// app.get("/", (req, res) => {res.send("Hello World!")});

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

// POST INSERT ITEM
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

  //GET ALL ITEMS
  app.get("/get-items", async (req, res) => {
    try {
      const items = await item.findAll();
      res.status(200).json(items);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching the items");
    }
  });

  //DELETE ITEM BY ID
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