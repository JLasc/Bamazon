//Inquirer
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "SuperSecretPasswordHere",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showProducts();
});

function showProducts() {
    connection.query("SELECT * FROM bamazon.products;", function (err, res) {
        if (err) throw err
        for (i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id}\nName:${res[i].product_name}\nDepartment: ${res[i].product_department}\nPrice: ${res[i].price}\nQuantity: ${res[i].quantity}\n`)
        }

        inquirer
            .prompt([{
                type: "input",
                name: "product_id",
                message: "Enter the ID of the item you'd like to buy:"
            }])
            .then(answers => {
                productId = answers.product_idl
                productQuan = answers.quantity;

                connection.query(`SELECT * FROM bamazon.products WHERE item_id=${productId}`, function (err, res) {
                    if (err) throw err
                    console.log(`ID:${res.item_id}\nName:${res.product_name}\nDepartment:${res.product_department}\nPrice:${res.price}\nQuantity:${res.quantity}`)
                    inquirer
                        .prompt([{
                            type: "input",
                            name: "quantity",
                            message: "How many would you like to buy?",
                            validate: function (value) {
                                if (isNaN(value) === false) {
                                    return true;
                                }
                                return false;
                            }
                        }]).then(answer => {
                            var quan = answer.quantity;

                            var updQuan = quan - productQuan

                            connect.query(`UPDATE products SET quantity=${updQuan}WHERE item_id="${productId}"`)
                        })


                })

                connection.end()
            });




    })


}