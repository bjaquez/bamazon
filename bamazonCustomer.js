var mysql = require("mysql");
var inquirer = require('inquirer');
var itemsArray = [];
var userChoiceId;
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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
 
});



connection.query("SELECT * FROM products", 

function(err, res){
    for(var i=0; i<res.length; i++){
        itemsArray.push(res[i].id + " " + res[i].product_name + ": " + "$" + res[i].price );
    }
    //console.log(itemsArray);


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
    ]).then(function(body){
        userChoiceId = parseInt(body.userChoice);
        var userChoiceQuantity;
        var userChoicePrice;
        res.forEach(element => {
            if( element.id === userChoiceId){
                
                userChoiceQuantity = element.stock_quantity;
                userChoicePrice = element.price;
            }
            
        });

        if(body.userQuantity <= userChoiceQuantity ){
            
            var newQuantity = userChoiceQuantity - body.userQuantity  
            //console.log(newQuantity);
            var query = connection.query("UPDATE products SET ? WHERE ? ", [
                {
                  stock_quantity: newQuantity
                },
                {
                  id: userChoiceId  
                }
            ], function(err, res){
                if (err) throw err;
                //console.log(query.sql);
                connection.end();

            })
            var total = (body.userQuantity * parseInt(userChoicePrice))
            console.log("Here is your " + body.userChoice +"!");
            console.log("Your total is " + "$" + total);
        }
        else {
            console.log("sorry not enough inventory");
            connection.end();
        }
        
    })

    
});