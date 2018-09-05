var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var tableData = [
    ['Test', 'Test Name '],
];

var table = new Table({
    head: ['Dept ID', 'Dept Name', 'Overhead', 'Sales', 'Profit'],
    colWidths: [13, 13, 13, 13, 13]
});

function table() {
    table.push(
        tableData[0]
    );

    console.log(table.toString());
}


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "SuperSecretPasswordHere",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) throw err
    superView()
})

function prodSales() {
    connection.query("SELECT * FROM bamazon.departments", function (err, res) {
        if (err) throw err
        for (i = 0; i < res.length; i++) {
            tempArr = [
                res[i].department_id,
                res[i].department_name,
                res[i].over_head_costs,
                res[i].product_sales,
                res[i].total_profit
            ]
            table.push(tempArr)
        }
        console.log(table.toString());
    })
}


function superView() {
    inquirer
        .prompt([{
            type: "list",
            name: "Options",
            choices: ["View Product Sales By Department", "Create New Department"]
        }]).then(answers => {
            var choice = answers.Options;

            switch (choice) {
                case "View Product Sales By Department":
                    prodSales()
                    break;
                case "Create New Department":
                    createDept()
                    break;
            }
        })
}