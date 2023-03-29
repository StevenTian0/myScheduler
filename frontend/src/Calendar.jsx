import React, { Component } from "react";
import Modal from "react-modal";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import { Link } from "react-router-dom";

import axios from "axios";

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
        //OLD onTimeRangeSelectedCode
        // const dp = this.calendar;
        // const modal = await DayPilot.Modal.form({
        //   title: "Create a new task:",
        //   fields: [
        //     { name: "taskName", title: "Task Name", type: "text" },
        //     { name: "startTime", title: "Start Time", type: "time" },
        //     { name: "endTime", title: "End Time", type: "time" },
        //   ],
        //   focus: "taskName",
        // });
        // dp.clearSelection();
        // if (!modal.result) {
        //   return;
        // }

        // console.log("Selected time range: ", args.start, " - ", args.end);

        // const start = args.start;
        // const end = args.end;
        // const id = DayPilot.guid();
        // const text = modal.result.taskName;

        // dp.events.add({
        //   start,
        //   end,
        //   id,
        //   text,
        // });


        console.log("Sending blocker(s) to the backend")
        // Here send the 'queries' to add blockers
        let startTotal = new Date(args.start.value);
        let endTotal = new Date(args.end.value);
        let numBlockers = (endTotal - startTotal) / (1800000);
        console.log("number of blockers to send: " + numBlockers);
        for (let i = 0; i < numBlockers; i++) {
          // Setting the start and end of the blocker to add
          let startOfBlocker = startTotal + (1800000 * i);
          let endOfBlocker = startOfBlocker + 1799999;
          //TODO Query
        }
        const dp = this.calendar;
        dp.update();
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
      onBeforeCellRender: args => {
        // console.log("cell");
        // console.log(args);
        args.cell.backColor = "#eeeeee";
        args.cell.disabled = false;

        let blockers = [
          {
            id: 1,
            start: "2022-02-03T09:00:00",
            end: "2022-02-03T14:00:00",
          }
        ];
        // let blockers = this.state.blockers;
        // console.log("blockers:")
        // console.log(blockers);
        if (blockers) {
          for (let i = 0; i < blockers.length; i++) {
            if (args.cell.start >= blockers[i].start && args.cell.end <= blockers[i].end) {
              args.cell.backColor = "#aba9a9";
              // args.cell.disabled = true;
              args.cell.fontColor = "white"
              break;
            }
          }
        }
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
