const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employees_db',
    password:'password123'
}
)

function init() {
inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'choice',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    },
  ])
  .then((choice) =>
    action(choice)
)}

function action(choice) {
    switch(choice.choice) {
        case "View all departments":
            viewAllDepartments();
            break;
        case "View all roles":
            viewAllRoles();
            break;
        case "View all employees":
            viewAllEmployees();
            break;
        case "Add a department":
            addADepartment();
            break;
        case "Add a role":
            addARole();
            break;
        case "Add an employee":
            addAnEmployee();
            break;
        case "Update an employee role":
            updateAnEmployeeRole();
            break;
    }
};


function viewAllDepartments() {
    db.query(`SELECT department.id AS id, 
                department.name AS department 
                FROM department`, 
                (err,res) =>{
                    console.table(res);
                    init();
    });
};

function viewAllRoles() {
    db.query(`SELECT role.id, 
                role.title, 
                department.name AS department, 
                role.salary 
                FROM role 
                RIGHT JOIN department ON role.department_id = department.id 
                ORDER BY role.id ASC`, 
                (err,res) => {
                    console.table(res);
                    init();
    });
};

function viewAllEmployees() {
    db.query(`SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title AS title, 
                department.name AS department, 
                role.salary AS salary, 
                CONCAT(manager.first_name, " ", manager.last_name) AS manager
                FROM employee 
                employee JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`, 
                (err,res) => {
                    console.table(res);
                    init();
                });
};

function addADepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter a name for the new department:",
                name: "department"
            }
        ])
        .then((department) => {
            db.query(`INSERT INTO department (name)
                        Values ("${department.department}")`, (err,res) =>{
                        console.log(`Added ${department.department} to the database`);
                            init();
                        });
        })
};

function addARole() {
    const departments = () => db.promise().query(`SELECT * FROM department`)
        .then((choices) => {
            let arrayChoices = choices[0].map(choice => choice.name);
            return arrayChoices;
        })
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter a name for the role:",
                name: "role"
            },
            {
                type: "input",
                message: "Enter a salary for this role",
                name: "salary"
            },
            {
                type: "list",
                message: "Select a department to place that role in:",
                name: "department",
                choices: departments
            }
        ]) 
        .then((answers) => {
            db.promise().query(`SELECT id FROM department WHERE name = ?`, answers.department)
                .then(answer => {
                    let iD = answer[0].map(department => department.id);
                    console.log(iD);
                    return iD
                })
                .then((iD) => {
                    db.promise().query(`INSERT INTO role (title, department_id, salary)
                VALUES(?,?,?)`, [answers.role, iD, answers.salary]);
                     init()
                })
        })
};

function addAnEmployee() {
    const role = () => db.promise().query(`SELECT * FROM role`)
        .then((rolesData) => {
            let rolesNames = rolesData[0].map(roles => roles.title)
            return rolesNames
        });
    const manager = () => db.promise().query(`SELECT * FROM employee`)
        .then((employeesData) => {
            let managerNames = employeesData[0].map(managers => managers.first_name)
            return managerNames
        });
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter a first name for the new employee:",
                name: "first_name"
            },
            {
                type: "input",
                message: "Please enter a last name for the new employee:",
                name: "last_name"
            },
            {
                type: "list",
                message: "Choose the new employee's role:",
                name: "role",
                choices: role
            },
            {
                type: "list",
                message: "Choose the new employee's manager:",
                name: "manager",
                choices: manager
            }
        ]).then((answers) => {db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, 
        [answers.first_name, answers.last_name,1, 1])
    init();
});
        // .then((answers) => {
        //     // let roleID = ""
        //     db.promise().query('SELECT id FROM role WHERE title = ?', answers.role)
        //     .then((answer) => {
        //         let roleId = answer[0].map(role => role.id);
        //         return {role: roleId,
        //         firstName: answers.first_name,
        //     lastName: answers.last_name};
        //         // console.log(roleID);
        //     })
        //     .then((answers) =>{db.promise().query('SELECT id FROM employee WHERE first_name = ?', answers.role)
        //     .then((answer) => {
        //         let managerId = answer[0].map(manager => manager.id);
        //         return {manager: managerId,
        //         firstName: answers.firstName,
        //     lastName: answers.lastName,
        // role: roleId};
        //     })})

        //     // console.log(roleId[0]);
        //     // const manager = db.query('SELECT id FROM employee WHERE first_name = ?', answers.manager);
        //     // console.log(manager.values);
        //    .then((answers) => {db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
        //     [answers.firstName, answers.lastName, answers.role[0], answers.manager[0]])});
}

init();