import React, { Component } from "react";
import fetchTasks from "./AddTask";
import Modal from "react-modal";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import { Link } from "react-router-dom";

import axios from "axios";
import { saveAs } from "file-saver";
import Timer from "./Timer";

//import AddBlocker from "./AddBlocker";

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
  pad: {
    padding: 20,
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
      date: "",
      // added date for the title
    };
  }

  // getAllTasks = async () => {
  //   try {
  //     const userToken = localStorage.getItem("token"); // Replace this with the actual token
  //     const response = await axios.post(
  //       "/api/task/getAllTasks",
  //       {
  //         token: userToken,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );

  //     const tasks = response.data.tasks.map((task) => ({
  //       start: new Date(
  //         task.dueDate - task.lengthOfWork * 60 * 1000
  //       ).toISOString(),
  //       end: new Date(task.dueDate).toISOString(),
  //       id: task.taskId,
  //       text: task.name,
  //       description: task.description,
  //       category: task.category,
  //       priority: task.priority,
  //       backColor:
  //         task.priority === "high"
  //           ? "red"
  //           : task.priority === "medium"
  //           ? "orange"
  //           : "green",
  //     }));
  //     this.calendar.update({ events: tasks });
  //   } catch (error) {
  //     console.error("Error fetching tasks:", error);
  //   }
  // };

  // updateCalendar = async () => {
  //   await this.getAllTasks();
  // };

  handleAddBlocker = async (newBlock) => {
    const { name, start, description, taskid, duration } = newBlock;

    const token = localStorage.getItem("token");

    console.log("Token:", token);
    console.log("Start", start);
    console.log("Duration:", duration);
    console.log("name:", name);
    console.log("description:", description);
    console.log("taskId:", taskid);
    // Prepare the data to send to the backend
    const blockerData = {
      token,
      time: start,
      duration,
      name,
      description,
      task: taskid,
    };

    try {
      // Replace '/api/blocker/add' with the correct API endpoint if needed
      const response = await axios.post("/api/blocker/add", blockerData);
      console.log(response.data);
    } catch (error) {
      console.error("Error adding blocker:", error);

      let errorMessage = "An error occurred while adding the blocker.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      throw new Error(errorMessage);
    }
  };

  get calendar() {
    return this.calendarRef.current.control;
  }

  getDate() {
    this.setState({
      date: new Date().toDateString(),
    });
  }

  exportReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/blockers/getAll/${token}`);
      const report = response.data.blockers;
      var blob = new Blob([JSON.stringify(report)], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "productivity report.txt");
    } catch (error) {
      console.error(error);
    }
  };

  exportDay = async (date) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/blockers/getAll/${token}`);
      const blockers = response.data.blockers;
      const report = [];
      const today = new Date()

      blockers.forEach((b) => {
        console.log((b.time));
        console.log(today.getFullYear())
        console.log(today.getMonth())
        console.log(today.getDay())

        if ((Date.parse(b.time.getDate) == today)) {
          report.push(b);
        }

      });

      console.log(JSON.stringify(report));

      var blob = new Blob([JSON.stringify(report)], {type: "text/plain;charset=utf-8"});
      // saveAs(blob, "productivity report.txt");
    } catch (error) {
      console.error(error);
    }
  };

  exportTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/task/getAll/${token}`);

      console.log(JSON.stringify(response.data.tasks));
      var blob = new Blob([JSON.stringify(response.data.tasks)], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "productivity report.txt");
    } catch (error) {
      console.error(error);
    }
  };

  // importTasks = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const tasks = JSON.parse(
  //       `{"_id":"6423916fc62d08a2d58548cd","taskId":"21","priority":"0","dueDate":"2025-12-17T08:24:00.000Z","lengthOfWork":5,"workDoneSoFar":0,"name":"New Task","description":"","category":"Unassigned","user":"63fae0b926b0e497994f5a8a","__v"}`
  //     )
      

  //     // console.log(tasks);
  //     console.log('{"name":"John", "age":30, "city":"New York"}'.json);

  //     const taskId = "";
	// 		const dueDate = "";
	// 		const lengthOfWork = "";
  //     const priorityValue = "";
  //     const categoryValue = "";
  //     const name = "";
  //     const description = "";

  //     const response = await axios.post("/api/blockers/add", {
  //       taskId,
	// 		  dueDate,
	// 		  lengthOfWork,
	// 		  priorityValue,
	// 		  token,
	// 		  categoryValue,
	// 		  name,
	// 		  description,
  //     });
      
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  componentDidMount() {
    //this.updateCalendar();
    this.getDate();
  }

  render() {
    return (
      <div style={styles.flex}>
        <h1>
          {" "}
          <center> {this.state.date} </center>
        </h1>
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
            <div style={styles.pad}>
              <center>
                <button type="button" onClick={this.exportReport}>
                  Get Productivity Report
                </button>
                <button type="button" onClick={this.exportTasks}>
                  Export Tasks
                </button>
                <button type="button" onClick={this.exportDay}>
                  Daily Log
                </button>
                {/* <button type="button" onClick={this.importTasks}>
                  Import Tasks
                </button> */}
              </center>
            </div>
          </div>
          <div style={styles.main}>
            <Link to="/tasklist">
              <button>Go to Task List</button>
            </Link>
            <DayPilotCalendar {...this.state} ref={this.calendarRef} />
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
