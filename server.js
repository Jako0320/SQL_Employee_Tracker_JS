const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ilovechandler",
  database: "employee_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL server!");
  startApp();
});

function startApp() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "Add an employee",
        "Update an employee role",
        "View all roles",
        "Add a role",
        "View all departments",
        "Add a department",
        "Quit",
      ],
    })
    .then((answers) => {
      switch (answers.action) {
        case "View all employees":
          viewEmployees();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "Add a role":
          addRole();
          break;
        case "View all departments":
          viewDepartments();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Quit":
          connection.end();
          console.log("Mischief managed!");
          break;
        default:
          console.log("Invalid action. Please try again.");
          startApp();
      }
    });
}
