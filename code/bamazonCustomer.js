//Modules
var mysql = require("mysql");
var inquirer = require("inquirer");

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

//Initialize product menu
function productInit() {
    //Displays all products
    connection.query("SELECT * FROM bamazon.products;", function (err, res) {
        if (err) throw err
        for (i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id}\nName:${res[i].product_name}\nDepartment: ${res[i].product_department}\nPrice: ${res[i].price}\nQuantity: ${res[i].quantity}\n`)
        }

        //Asks the user to enter ID of product
        inquirer
            .prompt([{
                type: "input",
                name: "product_id",
                message: "Enter the ID of the item you'd like to buy:"
            }])
            .then(answers => {
                productId = answers.product_id;

                //Grab and display item with corresponding ID
                connection.query(`SELECT * FROM bamazon.products WHERE item_id=${productId}`, function (err, res) {
                    if (err) throw err
                    console.log(`\nID: ${res[0].item_id}\nName: ${res[0].product_name}\nDepartment: ${res[0].product_department}\nPrice: ${res[0].price}\nQuantity: ${res[0].quantity}\n`)
                    // Ask the user how much they want to buy
                    inquirer
                        .prompt([{
                            type: "input",
                            name: "quantity",
                            message: "How many would you like to buy?",
                        }]).then(answer => {
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
                                    setTimeout(productInit, 3000)
                                })
                            }

                        })
                })
            });
    })
}