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

var tableTemp = {
    head: ["ID", "Name", "Dept", "Price", "Quantity"],
    colWidths: [6, 13, 13, 13, 13]
};

//Drills down on specific item in table
function itemTable(id) {
    connection.query(
        `SELECT * FROM bamazon.products WHERE item_id=${id}`,
        function (err, res) {
            var itemTable = new Table(tableTemp);
            for (i = 0; i < res.length; i++) {
                tableArr = [
                    res[i].item_id,
                    res[i].product_name,
                    res[i].product_department,
                    res[i].price,
                    res[i].quantity
                ];
                itemTable.push(tableArr);
            }
            console.log(itemTable.toString());
        }
    );
}

//Table that displays all of the products in DB
function productTable() {
    connection.query("SELECT * FROM bamazon.products", function (err, res) {
        if (err) throw err;
        var table = new Table(tableTemp);
        for (i = 0; i < res.length; i++) {
            tableArr = [
                res[i].item_id,
                res[i].product_name,
                res[i].product_department,
                res[i].price,
                res[i].quantity
            ];
            table.push(tableArr);
        }
        console.log(table.toString());
    });
}

//UI purchase item interaction
function purchaseQ() {
    inquirer
        .prompt([{
            type: "input",
            name: "quantity",
            message: "How many would you like to buy?"
        }])
        .then(answer => {
            connection.query(
                `SELECT * FROM products WHERE item_id=${productId}`,
                function (err, res) {
                    productQuan = res[0].quantity;
                    var quan = parseInt(answer.quantity);
                    var updQuan = productQuan - quan;
                    var price = res[0].price;
                    var dept = res[0].product_department;

                    if (productQuan <= 0) {
                        console.log("Insufficient Quantity!");
                        inquirer
                            .prompt([{
                                type: "confirm",
                                name: "insuff_confirm",
                                message: "Would you like to try another item?"
                            }])
                            .then(answers => {
                                var userConfirm = answers.insuff_confirm;
                                if (userConfirm) {
                                    productInit();
                                } else {
                                    connection.end();
                                }
                            });
                    } else if (productQuan > 0) {
                        //Update product sell count by quan purchased
                        connection.query(
                            `UPDATE products SET item_count_sold= item_count_sold + ${quan} WHERE item_id=${productId}`,
                            function (err) {
                                if (err) throw err;
                                console.log("Item count updated");
                            }
                        );

                        connection.query(
                            `UPDATE departments SET product_sales=${price *
                quan} WHERE department_name="${dept}"`,
                            function (err, res) {
                                if (err) throw err;
                                console.log("Product Sales have been updated");
                            }
                        );

                        //Update total profit on Department
                        connection.query(
                            `UPDATE departments SET total_profit=product_sales - over_head_costs WHERE department_name="${dept}"`,
                            function (err) {
                                if (err) throw err;
                            }
                        );

                        //Update total profit on Products
                        connection.query(
                            `UPDATE products SET product_sales=${price *
                quan}WHERE item_id="${productId}"`,
                            function (err) {
                                if (err) throw err;
                            }
                        );
                        //Update server quantity to subtract amount purchased
                        connection.query(
                            `UPDATE products SET quantity=${updQuan} WHERE item_id=${productId}`,
                            function (err, res) {
                                if (err) throw err;
                                console.log("Purchase Complete!");
                                setTimeout(productInit, 2000);
                            }
                        );
                    }
                }
            );
        });
}

//User purchase quantity input
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
            itemTable(productId);
            // Ask the user how much they want to buy
            setTimeout(purchaseQ, 1000);
        });
}

//Initialize product menu on start
function productInit() {
    //Displays all products
    connection.query("SELECT * FROM bamazon.products;", function (err) {
        if (err) throw err;

        //Display table with all products
        productTable();

        //Asks the user to enter ID of product
        setTimeout(purchasePrompt, 1000);
    });
}

//Connect to DB and run initalizer
connection.connect(function (err) {
    if (err) throw err;
    productInit();
});