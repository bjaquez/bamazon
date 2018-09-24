var mysql = require("mysql");
var inquirer = require('inquirer');
var itemsArray = [];
var userChoiceId;
var department;
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
            message: "Welcome, how would you like to shop?",
            choices: ["See All Items", "Shop By Department", "Exit"]
        }
    ]).then(function (body) {
        switch (body.userChoice) {
            case "See All Items":
                showAll();
                break;
            case "Shop By Department":
                showByDept();
                break;
            case "Exit":
            console.log("Goodbye!");
            connection.end();
            default:
                break;
        }
    })
}




function showByDept() {
    inquirer.prompt([
        {
            type: "list",
            name: "userDept",
            message: "Select a Department",
            choices: ["Home", "Electronics", "Food"]

        }
    ]).then(function (body) {
        switch (body.userDept) {
            case "Home":
                deptQuery("home");
                break;
            case "Electronics":
                deptQuery("electronics");
                break;
            case "Food":
                deptQuery("food");
                break;

            default:
                break;
        }



    })

}


function deptQuery(department) {
    connection.query("SELECT * FROM products WHERE department_name = ?", [department],
        function (err, res) {
            shop(res);
        })
}



function showAll() {

    connection.query("SELECT * FROM products",

        function (err, res) {

            shop(res);

        })
}



function shop(res) {
    itemsArray = [];

    for (var i = 0; i < res.length; i++) {
        itemsArray.push(res[i].id + " " + res[i].product_name + ": " + "$" + res[i].price);
    }

    inquirer.prompt([
        {
            type: "list",
            name: "userChoice",
            message: "Select an Item",
            choices: itemsArray
        },
        {
            type: "input",
            name: "userQuantity",
            message: "How many?"
        }
    ]).then(function (body) {
        userChoiceId = parseInt(body.userChoice);
        var userChoiceQuantity;
        var userChoicePrice;
        var userChoicename;
        res.forEach(element => {
            if (element.id === userChoiceId) {

                userChoiceQuantity = element.stock_quantity;
                userChoicePrice = element.price;
                userChoicename = element.product_name;
            }

        });

        if (body.userQuantity <= userChoiceQuantity) {

            var newQuantity = userChoiceQuantity - body.userQuantity
            //console.log(newQuantity);
            var query = connection.query("UPDATE products SET ? WHERE ? ", [
                {
                    stock_quantity: newQuantity
                },
                {
                    id: userChoiceId
                }
            ], function (err, res) {
                if (err) throw err;
                //console.log(query.sql);
                menu();

            })
            var total = (body.userQuantity * parseInt(userChoicePrice))
            console.log("~~~~~~~~~~~~~~~~~~~~~");
            console.log("Thanks for shopping at Bamazon!");
            console.log("Here is your " + userChoicename + "!");
            console.log("Your total is " + "$" + total);
            console.log("~~~~~~~~~~~~~~~~~~~~~");
        }
        else {
            console.log("~~~~~~~~~~~~~~~~~~~~~");
            console.log("Sorry not enough inventory");
            console.log("~~~~~~~~~~~~~~~~~~~~~");
            menu();
        }

    })
}