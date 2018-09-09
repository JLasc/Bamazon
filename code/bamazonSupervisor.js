var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var tableData = [["Test", "Test Name "]];

var table = new Table({
  head: ["Dept ID", "Dept Name", "Overhead", "Sales", "Profit"],
  colWidths: [13, 13, 13, 13, 13]
});

function table() {
  table.push(tableData[0]);

  console.log(table.toString());
}

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "SuperSecretPasswordHere",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  superView();
});

function prodSales() {
  connection.query("SELECT * FROM bamazon.departments", function(err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      tempArr = [
        res[i].department_id,
        res[i].department_name,
        res[i].over_head_costs,
        res[i].product_sales,
        res[i].total_profit
      ];
      table.push(tempArr);
    }
    console.log(table.toString());
  });
}

function createDept() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Options",
        choices: ["Add new department to view", "Return to menu"]
      }
    ])
    .then(answers => {
      var userChoice = answers.Options;

      switch (userChoice) {
        case "Add new department to view":
          inquirer
            .prompt([
              {
                type: "input",
                name: "dept_name",
                message: "What is the department name?"
              },
              {
                type: "input",
                name: "dept_overhead",
                message: "What is this departments overhead?"
              }
            ])
            .then(answers => {
              var deptName = answers.dept_name;
              var deptOverhead = answers.dept_overhead;

              connection.query(
                `INSERT INTO departments (department_id, department_name, over_head_costs, product_sales, total_profit) VALUES (0, "${deptName}", ${deptOverhead}, 0,  0)`,
                function(err) {
                  if (err) throw err;
                  console.log("Department added successfully!");
                  prodSales();
                  setTimeout(superView, 1000);
                }
              );
            });
          break;
        case "Return to menu":
          break;
      }
    });
}

function superView() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Options",
        choices: ["View Product Sales By Department", "Create New Department"]
      }
    ])
    .then(answers => {
      var choice = answers.Options;

      switch (choice) {
        case "View Product Sales By Department":
          prodSales();
          setTimeout(superView, 1000);
          break;
        case "Create New Department":
          createDept();
          break;
      }
    });
}
