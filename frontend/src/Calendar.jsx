import React, { Component } from "react";
import Modal from "react-modal";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import { Link } from "react-router-dom";

import axios from "axios";

import AddTask from "./AddTask";

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    marginRight: "10px",
  },
  main: {
    flexGrow: "1",
  },
};

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      taskName: "",
    };
    this.state = {
      isModalOpen: false,
      taskName: "",
    };
    this.calendarRef = React.createRef();
    this.state = {
      viewType: "Week",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async (args) => {
        const dp = this.calendar;
        const modal = await DayPilot.Modal.form({
          title: "Create a new task:",
          fields: [
            { name: "taskName", title: "Task Name", type: "text" },
            { name: "startTime", title: "Start Time", type: "time" },
            { name: "endTime", title: "End Time", type: "time" },
          ],
          focus: "taskName",
        });
        dp.clearSelection();
        if (!modal.result) {
          return;
        }

        console.log("Selected time range: ", args.start, " - ", args.end);

        const start = args.start;
        const end = args.end;
        const id = DayPilot.guid();
        const text = modal.result.taskName;

        dp.events.add({
          start,
          end,
          id,
          text,
        });
      },
      eventDeleteHandling: "Update",
      onEventClick: async (args) => {
        const dp = this.calendar;
        const modal = await DayPilot.Modal.prompt(
          "Update event text:",
          args.e.text()
        );
        if (!modal.result) {
          return;
        }
        const e = args.e;
        e.data.text = modal.result;
        dp.events.update(e);
      },
    };
  }

  getAllTasks = async () => {
    try {
      const userToken = localStorage.getItem("token"); // Replace this with the actual token
      const response = await axios.post(
        "/api/task/getAllTasks",
        {
          token: userToken,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const tasks = response.data.tasks.map((task) => ({
        start: new Date(
          task.dueDate - task.lengthOfWork * 60 * 1000
        ).toISOString(),
        end: new Date(task.dueDate).toISOString(),
        id: task.taskId,
        text: task.name,
        description: task.description,
        category: task.category,
        priority: task.priority,
        backColor:
          task.priority === "high"
            ? "red"
            : task.priority === "medium"
            ? "orange"
            : "green",
      }));
      this.calendar.update({ events: tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  updateCalendar = async () => {
    await this.getAllTasks();
  };

  handleAddTask = async (task) => {
    const dp = this.calendar;
    const { text, start, end, description, category, priority } = task;
    const id = DayPilot.guid();
    const eventColor =
      priority === "high" ? "red" : priority === "medium" ? "orange" : "green";
    const newTask = {
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      id,
      text: text,
      description: description,
      category: category,
      priority: priority,
      backColor: eventColor,
    };
    dp.events.add(newTask);
    console.log("New task added: ", newTask);
    console.log(dp.events);
    this.setState({ isModalOpen: false });
    await this.updateCalendar();
  };

  get calendar() {
    return this.calendarRef.current.control;
  }

  componentDidMount() {
    this.updateCalendar();
  }

  render() {
    return (
      <div style={styles.wrap}>
        <div style={styles.left}>
          <DayPilotNavigator
            selectMode={"week"}
            showMonths={1}
            skipMonths={1}
            startDate={"2023-03-07"}
            selectionDay={"2023-03-07"}
            onTimeRangeSelected={(args) => {
              this.calendar.update({
                startDate: args.day,
              });
            }}
          />
        </div>
        <div style={styles.main}>
          <Link to="/tasklist">
            <button>Go to Task List</button>
          </Link>
          <DayPilotCalendar {...this.state} ref={this.calendarRef} />
          <AddTask onSubmit={this.handleAddTask} />
        </div>
      </div>
    );
  }
}

export default Calendar;
