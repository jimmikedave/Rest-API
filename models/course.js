'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // userId: {
    //     type: Sequelize.INTEGER
    // },
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true
    },
    materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true
    }
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
        as: 'user', //alias
        foreignKey: {
            fieldName: 'userId',
            allowNull: false,
        },
    });
};

  return Course;
};

 // const newCourse = req.body;
  // const id = course.dataValues.id;
  // const errors = [];

  // if(!newCourse.title) {
  //   errors.push('Please provide a value for "title".')
  // }

  // if(!newCourse.description) {
  //   errors.push('Please provide a value for "description".');
  // }

  // if(!newCourse.userId) {
  //   errors.push('Please provide a value for "userId".')
  // }

  // if(errors.length > 0) {
  //   res.status(400).json({errors});
  // } else {
  //   const course = await Course.create(newCourse);
  //   res.location('/api/courses/' + id);
  // }