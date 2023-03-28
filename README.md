# Task list - core app

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Set up](#set-up)

## General info
This application is a frontend site of the task list project. 

## Technologies
Project is created with:
* Angular CLI: 15.2.4
* Node: 18.15.0

## Set up
This section shows how to set up and install the application on the Tomcat server.

Important: Before the app installation on the Tomcat server make sure you have Node.js installed.

To set up the application follow these steps:
1. Clone the application using ```git clone https://github.com/m3tler/task-list-web.git```
2. Install npm using ```npm install``` command.
3. Build the application using ```ng build --base-href=/angular/``` command.
4. Copy content of the .dist folder.
5. Paste it to the ./webapps folder in the Tomcat container.
6. Rename pasted folder to "angular".
7. Go to the .conf folder and open server.xml file.
8. Search for <Connector> tag and make sure the port property is set to 8081.
7. Go to the ./bin folder.
8. Run the application using Tomcat.exe file.
9. Go to http://localhost:8081/angular/
