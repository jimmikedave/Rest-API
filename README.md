
# Full Stack JavaScript Techdegree v2 - REST API Project


This Rest API was created using Express. It provides a way for users to administer a school database containing information about courses. Each user can interact with the database by retrieving a list of courses, adding courses, as well as updating and deleting courses in the database. In order to make changes to the database the user must have an account or create a new account. From there, the user will only have access to courses that are owned by them.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
