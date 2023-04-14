const inquirer = require('inquirer');


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
  .then((choice) => {
    action(choice);
});}

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
    
}