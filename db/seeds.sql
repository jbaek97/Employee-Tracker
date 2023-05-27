INSERT INTO department (name) 
VALUES ("Marketing"),
        ("Finance"),
        ("HR"),
        ("Sales");

INSERT INTO role (title, department_id, salary)
VALUES ("Marketing Director", 1, 100000),
        ("Accountant", 2, 70000),
        ("Head of Sales", 4, 90000),
        ("Salesperson", 4, 60000),
        ("HR Representative", 3, 60000),
        ("PR Manager", 1, 60000),
        ("Auditor", 2, 65000),
        ("HR Manager", 3, 65000);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("James", "Connor", 1, null ),
        ("Jamie", "Nelson", 3, null),
        ("John", "Johnson", 4, 2),
        ("Mark", "Smith", 2, null),
        ("Ellen", "Holloway", 8, null),
        ("Sarah", "Carney", 5, 5),
        ("George", "Cassidy", 7, null),
        ("Elias", "Wong", 6, 1);