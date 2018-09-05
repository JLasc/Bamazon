//Modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

//Sql Server connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "SuperSecretPasswordHere",
    database: "bamazon"
});

//Connect to DB and run initalizer
connection.connect(function (err) {
    if (err) throw err;
    productInit();
});

var tableTemp = {
    head: ['ID', 'Name', 'Dept', 'Price', 'Quantity'],
    colWidths: [6, 13, 13, 13, 13]
}


function itemTable(id) {
    connection.query(`SELECT * FROM bamazon.products WHERE item_id=${id}`, function (err, res) {

        var itemTable = new Table(tableTemp)
        for (i = 0; i < res.length; i++) {
            tableArr = [
                res[i].item_id,
                res[i].product_name,
                res[i].product_department,
                res[i].price,
                res[i].quantity
            ]
            itemTable.push(tableArr)
        }
        console.log(itemTable.toString());
    })

}

function productTable() {
    connection.query("SELECT * FROM bamazon.products", function (err, res) {
        if (err) throw err
        var table = new Table(tableTemp);
        for (i = 0; i < res.length; i++) {
            tableArr = [
                res[i].item_id,
                res[i].product_name,
                res[i].product_department,
                res[i].price,
                res[i].quantity
            ]
            table.push(tableArr)
        }
        console.log(table.toString());
    })
}

function purchaseQ() {
    inquirer
        .prompt([{
            type: "input",
            name: "quantity",
            message: "How many would you like to buy?",
        }]).then(answer => {
            connection.query(`SELECT * FROM products WHERE item_id=${productId}`, function (err, res) {
                productQuan = res[0].quantity;
                var quan = parseInt(answer.quantity);
                var updQuan = productQuan - quan;

                if (productQuan <= 0) {
                    console.log("Insufficient Quantity!")
                    inquirer
                        .prompt([{
                            type: "confirm",
                            name: "insuff_confirm",
                            message: "Would you like to try another item?"
                        }]).then(answers => {
                            var userConfirm = answers.insuff_confirm;
                            if (userConfirm) {
                                productInit()
                            } else {
                                connection.end()
                            }
                        })
                } else if (productQuan > 0) {
                    //Update server quantity
                    connection.query(`UPDATE products SET quantity=${updQuan} WHERE item_id="${productId}"`, function (err, res) {
                        if (err) throw err
                        console.log("Purchase Complete!")
                        setTimeout(productInit, 1)
                    })
                }
            })
        })
}


function purchasePrompt() {
    inquirer
        .prompt([{
            type: "input",
            name: "product_id",
            message: "Enter the ID of the item you'd like to buy:"
        }])
        .then(answers => {
            productId = parseInt(answers.product_id);
            //Grab and display item with corresponding ID
            itemTable(productId)
            // Ask the user how much they want to buy   
            setTimeout(purchaseQ, 1000)
        })
}




//Initialize product menu
function productInit() {
    //Displays all products
    connection.query("SELECT * FROM bamazon.products;", function (err) {
        if (err) throw err

        //Display table with all products
        productTable()

        //Asks the user to enter ID of product
        setTimeout(purchasePrompt, 1000)

    })
}