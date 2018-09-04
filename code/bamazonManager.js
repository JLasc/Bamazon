//Modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var manager = require("./managerFunc")


//Sql Server connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "SuperSecretPasswordHere",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    managerView()
});


//Manager View Function
function managerView() {
    inquirer
        .prompt([{
            type: "input",
            name: "managerUser",
            message: "Enter manager username:"
        }]).then(answers => {
            managerUser = answers.managerUser;
            if (managerUser === managerUser) {
                function inputPass() {
                    inquirer
                        .prompt([{
                            type: "password",
                            name: "mgrPwd",
                            message: "Enter password (default is admin)"
                        }]).then(answers => {
                            password = answers.mgrPwd
                            if (password === "admin") {
                                console.log(`Welcome ${managerUser}`)
                                inquirer
                                    .prompt([{
                                        type: "list",
                                        name: "Options",
                                        choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
                                    }]).then(answers => {
                                        var userChoice = answers.Options
                                        switch (userChoice) {
                                            case "View Products For Sale":
                                                manager.products()
                                                break;
                                            case "View Low Inventory":
                                                manager.lowInv()
                                                break;
                                            case "Add to Inventory":
                                                manager.addInv()
                                                break;
                                            case "Add New Product":
                                                manager.newProd()
                                                break;
                                        }
                                    })
                            } else {
                                console.log("That's the wrong password!")
                            }
                        })
                }
                inputPass()
            }
        })

}