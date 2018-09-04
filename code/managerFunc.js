//Modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

//Sql Server connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "SuperSecretPasswordHere",
    database: "bamazon"
});

//Misc Variables
var headline = "#".repeat(10)
var banner = "#".repeat(35)

//Keep record of how many items in DB
var itemCount = [];
connection.query("SELECT * FROM bamazon.products", function (err, res) {
    if (err) throw err
    for (i = 0; i < res.length; i++) {
        itemCount.push(res[i].item_id)
    }
})

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
                    module.exports.products()
                    break;
                case "View Low Inventory":
                    module.exports.lowInv()
                    break;
                case "Add to Inventory":
                    module.exports.addInv()
                    break;
                case "Add New Product":
                    module.exports.newProd()
                    break;
            }
        })
}

module.exports = {
    products: function () {
        connection.query("SELECT * FROM bamazon.products", function (err, res) {
            if (err) throw err
            console.log(`${"#".repeat(14)} ${colors.yellow("INVENTORY")} ${"#".repeat(14)}\n${"#".repeat(39)}`)
            for (i = 0; i < res.length; i++) {
                console.log(`\nID: ${res[i].item_id}\nName:${res[i].product_name}\nDepartment: ${res[i].product_department}\nPrice: ${res[i].price}\nQuantity: ${res[i].quantity}\n`)
            }
            console.log("#".repeat(31) + "\n")
            mainMenu()
        })
    },
    lowInv: function () {
        connection.query("SELECT item_id, product_name, product_department, quantity FROM bamazon.products WHERE quantity<5", function (err, res) {
            if (err) throw err;

            console.log(`${headline} ${colors.yellow("LOW INVENTORY")} ${headline}\n${banner}`)
            for (j = 0; j < res.length; j++) {
                console.log(`\nID: ${res[j].item_id}\nName:${res[j].product_name}\nDepartment: ${res[j].product_department}\nQuantity: ${res[j].quantity}\n`)
            }
            console.log(banner + "\n")
            mainMenu()
        })
    },
    addInv: function () {
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
                        module.exports.addInv()
                        return
                    } else {
                        var itemQuan = parseInt(res[0].quantity);
                        console.log(`\nID: ${res[0].item_id}\nName: ${res[0].product_name}\nDepartment: ${res[0].product_department}\nPrice: ${res[0].price}\nQuantity: ${res[0].quantity}\n`)
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
    },
    addProd: function () {
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
    }

}