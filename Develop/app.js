const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

var allEmployees = [

    {
        type: `input`,
        name: `name`,
        message: `What is your employee's name?`
        
    },
    {
        type: `input`,
        name: `id`,
        message: `What is your employee's Id?`
    },
    {
        type: `input`,
        name: `email`,
        message: `What is your employee's email address?`
    },
    {
        type:  `list`,
        name: `role`,
        choices: [
            `Intern`, 
            `Engineer`, 
            `Manager`
        ]
    },
    
    
];

 function getRoleQuestion(role) {
     return [
         {
             type: `input`,
             name: `officeNumber`,
             message: `What is the office number of that manager?`,
             when: () => role == 'Manager'
         },
         {
             type: `input`,
             name: `school`,
             message: `What school does that intern attend?`,
             when: () => role == 'Intern'
         },
         {
             type: `input`,
             name: `github`,
             message: `What is the Github username of that engineer?`,
             when: () => role == 'Engineer'
         } 
    ]
 }

 const addAnother = {
     type: "confirm",
     name: "another",
     message: "Would you like to add another employee?"
 }

 function promptInquirer() {
     inquirer.prompt(allEmployees).then( (answers) => {
         inquirer.prompt(getRoleQuestion(answers.role)).then((answersRole) => {
             inquirer.prompt(addAnother).then((answersAnother) => {
            
                let employee;
                switch (answers.role) {
                    case 'Manager':
                    employee = new Manager (answers.name, answers.id, answers.email, answersRole.officeNumber)
                break;
                    case 'Engineer':
                    employee = new Engineer (answers.name, answers.id, answers.email, answersRole.github);
                    break;
                case 'Intern':
                    employee = new Intern (answers.name, answers.id, answers.email, answersRole.school);
                    break;
                default:
                    employee = new Engineer (answers.name, answers.id, answers.eamil, answersRole.github)
                
            }

            employees.push(employee)

            if(answersAnother.another) {
                promptInquirer()
            } else {

                let html = render(employees);
                fs.writeFile(outputPath, html, 'utf8', function (err) {
                    if (err) throw err;
                })
            }
        })
     })
  })

}

 promptInquirer()