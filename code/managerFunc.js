//Modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");
var Table = require("cli-table");

//Template for table
var tableTemp = {
    head: ["ID", "Name", "Dept", "Price", "Quantity"],
    colWidths: [6, 13, 13, 13, 13]
};

var addItemTable = {
    head: ["ID", "Name", "Quantity"],
    colWidths: [6, 13, 6]
};


//Sql Server connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "SuperSecretPasswordHere",
    database: "bamazon"
});


//Keep record of how many items in DB
var itemCount = [];

connection.query("SELECT * FROM bamazon.products", function (err, res) {
    if (err) throw err
    for (i = 0; i < res.length; i++) {
        itemCount.push(res[i].item_id)
    }
})

//Creates the table of product items
function productTable(query) {
    connection.query(`${query}`, function (err, res) {
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


function addTable(query) {
    connection.query(`${query}`, function (err, res) {
        if (err) throw err;
        var table = new Table(addItemTable);
        for (i = 0; i < res.length; i++) {
            tableArr = [
                res[i].item_id,
                res[i].product_name,
                res[i].quantity
            ];
            table.push(tableArr);
        }
        console.log(table.toString());
    });
}


//Add Quantity to Item
function addQuantity() {
    inquirer
        .prompt([{
            type: "input",
            name: "item_id",
            message: "Enter the ID of the product: "
        }]).then(answers => {

            productId = parseInt(answers.item_id);


            connection.query(`SELECT * FROM bamazon.products WHERE item_id=${productId}`, function (err, res) {
                if (err) throw err
                var idChecker = itemCount.indexOf(productId)

                if (idChecker < 0) {
                    console.log("There is no item with this ID")
                    addQuantity()
                    return
                } else {
                    var itemQuan = parseInt(res[0].quantity);
                    inquirer
                        .prompt([{
                            type: "list",
                            name: "Options",
                            choices: ["Add to product stock", "Return to menu"]
                        }]).then(answers => {
                            var choice = answers.Options
                            switch (choice) {
                                case "Add to product stock":
                                    inquirer
                                        .prompt([{
                                            type: "input",
                                            name: "quan_add",
                                            message: "How much would you like to add?"
                                        }]).then(answers => {
                                            var qAdd = parseInt(answers.quan_add);
                                            var newQuan = itemQuan + qAdd
                                            connection.query(`UPDATE bamazon.products SET quantity=${newQuan} WHERE item_id=${productId}`, function (err, res) {
                                                if (err) throw err
                                                console.log(colors.red("\nProduct quantity has been updated!\n"))
                                                mainMenu()
                                            })
                                        })
                                    break;
                                case "Return to menu":
                                    mainMenu()
                                    break;
                            }
                        })
                }

            })
        })
}

function createNewItem() {
    inquirer
        .prompt([{
            type: "list",
            name: "Options",
            choices: ["Add Product", "Return to Menu"]
        }]).then(answers => {
            var userChoice = answers.Options
            switch (userChoice) {
                case "Add Product":
                    inquirer
                        .prompt([{
                            type: "input",
                            name: "product_name",
                            message: "Enter name of product:"
                        }, {
                            type: "input",
                            name: "product_dept",
                            message: "Enter department of product:"
                        }, {
                            type: "input",
                            name: "price",
                            message: "Enter the price:"
                        }, {
                            type: "quantity",
                            name: "quantity",
                            message: "Enter quantity:"
                        }]).then(answers => {
                            var name = answers.product_name;
                            var dept = answers.product_dept;
                            var price = parseFloat(answers.price);
                            var quantity = parseInt(answers.quantity);

                            connection.query(
                                "INSERT INTO products SET ?", {
                                    product_name: name,
                                    product_department: dept,
                                    price: price,
                                    quantity: quantity
                                },
                                function (err, res) {
                                    if (err) throw err
                                    console.log(colors.red("New product has been added!"))
                                    mainMenu()
                                })
                        })
                    break;
                case "Return to Menu":
                    mainMenu()
                    break;
            }
        })
}


//Main Menu Inquirer function
function mainMenu() {
    inquirer
        .prompt([{
            type: "list",
            name: "Options",
            choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }]).then(answers => {
            userChoice = answers.Options
            switch (userChoice) {
                case "View Products For Sale":
                    productTable("SELECT * FROM products")
                    setTimeout(mainMenu, 1000)
                    break;
                case "View Low Inventory":
                    productTable("SELECT * FROM products WHERE quantity < 5")
                    setTimeout(mainMenu, 1000)
                    break;
                case "Add to Inventory":
                    addTable("SELECT item_id, product_name, quantity FROM products WHERE quantity < 5")
                    setTimeout(addQuantity, 1000)
                    break;
                case "Add New Product":
                    createNewItem()
                    break;
            }
        })
}



module.exports = {
    products: function () {
        productTable("SELECT * FROM products")
        setTimeout(mainMenu, 1000)
    },
    lowInv: function () {
        productTable("SELECT * FROM products WHERE quantity < 5")
        setTimeout(mainMenu, 1000)
    },

    addInv: function () {
        addTable("SELECT item_id, product_name, quantity FROM products WHERE quantity < 5")
        setTimeout(addQuantity, 1000)

    },
    addProd: function () {
        createNewItem()
    }

}