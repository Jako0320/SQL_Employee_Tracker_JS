-- Departments
INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Finance'),
  ('Human Resources');

-- Roles
INSERT INTO roles (title, salary, department_id) VALUES
  ('Sales Manager', 60000, 1),
  ('Sales Representative', 40000, 1),
  ('Marketing Manager', 50000, 2),
  ('Marketing Coordinator', 35000, 2),
  ('Accountant', 55000, 3),
  ('Financial Analyst', 45000, 3),
  ('HR Manager', 60000, 4),
  ('HR Assistant', 35000, 4);

-- Employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Michael', 'Johnson', 3, 1),
  ('Emily', 'Williams', 4, 3),
  ('David', 'Brown', 5, 3),
  ('Jennifer', 'Davis', 6, 5),
  ('Jessica', 'Miller', 7, 5),
  ('William', 'Wilson', 8, 7);
