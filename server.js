const inquirer = require("inquirer");
const mysql = require("mysql2");
const figlet = require('figlet');

//MySQL server connection configuration
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ilovechandler",
  database: "employee_db",
});

//ASCII Title generation function
function displayASCII() {
  figlet('Employee\nManager\n1989 V1.0', (err, data) => {
    if (err) throw err;
    console.log('\n' + data);
    startApp();
  });
}

//MySQL server connection
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL server!');
    displayASCII();
  });

//Menu function
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
        "Update an employee manager",
        "View employees by manager",
        "View employees by department",
        "View all roles",
        "Add a role",
        "View all departments",
        "View total utilized budget of a department",
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
        case "Update an employee manager":
          updateEmployeeManager();
          break;
        case "View employees by manager":
          viewEmployeesByManager();
          break;
        case "View employees by department":
          viewEmployeesByDepartment();
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
        case "View total utilized budget of a department":
          viewBudget();
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
//Generate table with list of all employees
function viewEmployees() {
  connection.query(
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM employees 
      LEFT JOIN roles ON employees.role_id = roles.id 
      LEFT JOIN departments ON roles.department_id = departments.id 
      LEFT JOIN employees manager ON employees.manager_id = manager.id`,
    (err, employees) => {
      if (err) throw err;
      console.table(employees);
      startApp();
    }
  );
}

//Function to add an employee
function addEmployee() {
  connection.query("SELECT * FROM roles", (err, roles) => {
    if (err) throw err;

    connection.query(
      `SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS manager 
        FROM employees 
        WHERE employees.manager_id IS NULL`,
      (err, managers) => {
        if (err) throw err;

        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "Enter the employee's first name:",
            },
            {
              type: "input",
              name: "lastName",
              message: "Enter the employee's last name:",
            },
            {
              type: "list",
              name: "roleId",
              message: "Select the employee's role:",
              choices: roles.map((role) => ({
                name: role.title,
                value: role.id,
              })),
            },
            {
              type: "list",
              name: "managerId",
              message: "Select the employee's manager:",
              choices: managers.map((manager) => ({
                name: manager.manager,
                value: manager.id,
              })),             
            },
          ])
          .then((answers) => {
            connection.query(
              "INSERT INTO employees SET ?",
              {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleId,
                manager_id: answers.managerId,
              },
              (err) => {
                if (err) throw err;
                console.log("Employee added successfully!");
                startApp();
              }
            );
          });
      }
    );
  });
}

//Function to update an existing employee role
function updateEmployeeRole() {
  connection.query("SELECT * FROM employees", (err, employees) => {
    if (err) throw err;

    connection.query("SELECT * FROM roles", (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Select the employee to update:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            type: "list",
            name: "roleId",
            message: "Select the new role for the employee:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answers) => {
          connection.query(
            "UPDATE employees SET ? WHERE ?",
            [
              {
                role_id: answers.roleId,
              },
              {
                id: answers.employeeId,
              },
            ],
            (err) => {
              if (err) throw err;
              console.log("Employee role updated successfully!");
              startApp();
            }
          );
        });
    });
  });
}

//Function to update an existing employee manager
function updateEmployeeManager() {
  connection.query("SELECT * FROM employees", (err, employees) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee to update:",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          type: "list",
          name: "managerId",
          message: "Select the new manager for the employee:",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),       
        },
      ])
      .then((answers) => {
        connection.query(
          "UPDATE employees SET ? WHERE ?",
          [
            {
              manager_id: answers.managerId,
            },
            {
              id: answers.employeeId,
            },
          ],
          (err) => {
            if (err) throw err;
            console.log("Employee manager updated successfully!");
            startApp();
          }
        );
      });
  });
}
//Function to view all employees by manager
function viewEmployeesByManager() {
  connection.query(
    `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary 
      FROM employees 
      LEFT JOIN roles ON employees.role_id = roles.id 
      LEFT JOIN departments ON roles.department_id = departments.id 
      LEFT JOIN employees manager ON employees.manager_id = manager.id 
      ORDER BY manager`,
    (err, employees) => {
      if (err) throw err;
      console.table(employees);
      startApp();
    }
  );
}
//Function to view all employees by department
function viewEmployeesByDepartment() {
  connection.query(
    `SELECT departments.name AS department, employees.id, employees.first_name, employees.last_name, roles.title, roles.salary 
      FROM employees 
      LEFT JOIN roles ON employees.role_id = roles.id 
      LEFT JOIN departments ON roles.department_id = departments.id 
      ORDER BY department`,
    (err, employees) => {
      if (err) throw err;
      console.table(employees);
      startApp();
    }
  );
}

//Generate table with list of all roles
function viewRoles() {
  connection.query(
    "SELECT roles.*, departments.name AS department_name FROM roles JOIN departments ON roles.department_id = departments.id",
    (err, roles) => {
      if (err) throw err;
      console.table(roles);
      startApp();
    }
  );
}
//Function to add a role
function addRole() {
  connection.query("SELECT * FROM departments", (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary of the role:",
        },
        {
          type: "list",
          name: "departmentId",
          message: "Select which department the role belongs to:",
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answers) => {
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.departmentId,
          },
          (err) => {
            if (err) throw err;
            console.log("Role added successfully!");
            startApp();
          }
        );
      });
  });
}

//Generate table with list of all departments
function viewDepartments() {
  connection.query("SELECT * FROM departments", (err, departments) => {
    if (err) throw err;
    console.table(departments);
    startApp();
  });
}

//Generate table with sum of all employee salaries by department
function viewBudget() {
  connection.query(
    `SELECT departments.name AS department, SUM(roles.salary) AS utilized_budget 
      FROM employees 
      LEFT JOIN roles ON employees.role_id = roles.id 
      LEFT JOIN departments ON roles.department_id = departments.id 
      GROUP BY department`,
    (err, budgets) => {
      if (err) throw err;
      console.table(budgets);
      startApp();
    }
  );
}

//Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          name: answers.name,
        },
        (err) => {
          if (err) throw err;
          console.log("Department added successfully!");
          startApp();
        }
      );
    });
}