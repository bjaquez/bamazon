var mysql = require("mysql");
var inquirer = require('inquirer');
var chalk = require("chalk");
var itemsArray = [];
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    menu();
});


function menu() {

    inquirer.prompt([
        {
            type: "list",
            name: "userChoice",
            message: chalk.yellow("Welcome Manager, What would you like to do?"),
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (body) {

        switch (body.userChoice) {
            case "View Products for Sale":

                viewProducts();

                break;
            case "View Low Inventory":
                viewLow();
                break;

            case "Add to Inventory":
                addInventory();

                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
            console.log("Goodbye!");
            connection.end();
                break;
            default:
                break;
        }


    })
}



function viewProducts() {
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.log(chalk.blue("---- All Products------"));
            for (let i = 0; i < res.length; i++) {
                console.log(res[i].id + " " + res[i].product_name + " $" + res[i].price + " quantity: " + res[i].stock_quantity);
            }
            console.log(chalk.blue("---- All Products------"));
            menu();
            
        })
}

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 10",
        function (err, res) {
            console.log(chalk.red("---- Low Inventory Products------"));
            for (let i = 0; i < res.length; i++) {
                console.log(res[i].id + " " + res[i].product_name + " $" + res[i].price + " quantity: " + res[i].stock_quantity);
            }
            console.log(chalk.red("---- Low Inventory Products------"));
            menu();
        })
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            itemsArray.push(res[i].id + " " + res[i].product_name + " quantity: " + res[i].stock_quantity);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "inventoryChoice",
                message: "Which item would you like to update?",
                choices: itemsArray
            },
            {
                type: "input",
                name: "newQuantity",
                message: "How many would you like to add?"
            }
        ]).then(function (body) {
            var inventId = parseInt(body.inventoryChoice);
            var oldQuantity;
            res.forEach(element => {
                if (element.id === inventId) {
                    oldQuantity = element.stock_quantity;
                }

            });
            connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: oldQuantity + parseInt(body.newQuantity)
                },
                {
                    id: inventId
                }
            ], function (err, res) {
                console.log(chalk.green("Your inventory has been updated!"));
                menu();
            });


        });

    });
};

function addProduct() {
    inquirer.prompt([
        {
            message: "What is the name of your product?",
            type: "input",
            name: "newName",
        },
        {
            message: "What is the price of your product?",
            type: "input",
            name: "newPrice",
        },
        {
            message: "What is the department of your product?",
            type: "input",
            name: "newDepartment",
        },
        {
            message: "How many would you like to add?",
            type: "input",
            name: "newAmount",
        },

    ]).then(function (body) {
        connection.query("INSERT INTO products SET ?", [
            {
                product_name: body.newName,
                department_name: body.newDepartment,
                price: parseInt(body.newPrice),
                stock_quantity: parseInt(body.newAmount)
            }
        ], function (err, res) {
            if (err) throw err;
            console.log(chalk.green("Your new item has been added!"));
            menu();
        })
    })
}