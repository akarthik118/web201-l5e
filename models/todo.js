// models/todo.js
"use strict";
const { Model } = require("sequelize");

var Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      const d = new Date();

      console.log("My Todo list \n");

      console.log("Overdue");
      const over = await this.overdue();
      over.map((task) =>
        console.log(
          `${task.id}. [${task.completed ? "x" : " "}] ${task.title} ${
            task.dueDate
          }`
        )
      );
      console.log("\n");

      console.log("Due Today");
      const today = await this.dueToday();
      today.map((task) =>
        console.log(`${task.id}. [${task.completed ? "x" : " "}] ${task.title}`)
      );
      console.log("\n");

      console.log("Due Later");
      const later = await this.dueLater();
      later.map((task) =>
        console.log(
          `${task.id}. [${task.completed ? "x" : " "}] ${task.title} ${
            task.dueDate
          }`
        )
      );
    }

    static async overdue() {
      const d = new Date();
      const task = await Todo.findAll({
        where: { dueDate: { [Op.lte]: d.toLocaleDateString("en-CA") } },
        order: [["id", "ASC"]],
      });
      return task;
    }

    static async dueToday() {
      const d = new Date();
      const task = await Todo.findAll({
        where: { dueDate: { [Op.eq]: d.toLocaleDateString("en-CA") } },
        order: [["id", "ASC"]],
      });
      return task;
    }

    static async dueLater() {
      const d = new Date();
      const task = await Todo.findAll({
        where: { dueDate: { [Op.gte]: d.toLocaleDateString("en-CA") } },
        order: [["id", "ASC"]],
      });
      return task;
    }

    static async markAsComplete(id) {
      return Todo.update({ completed: true }, { where: { id: id } });
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
