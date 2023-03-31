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
import {create} from "string-table"

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
      blockers: [],
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
        console.log("Sending blocker(s) to the backend");
        let startTotal = new Date(args.start.value);
        let endTotal = new Date(args.end.value);
        let numBlockers = (endTotal - startTotal) / 1800000;
        const token = localStorage.getItem("token");
        const blockerData = {
          token,
          time: startTotal.toISOString(), // Convert the date to ISO string format
          number: numBlockers,
        };
        try {
          // Call the backend endpoint with the prepared data
          const response = await axios.post(
            "/api/blocker/addMultiple",
            blockerData
          );
          console.log(response.data);
        } catch (error) {
          console.error("Error adding multiple blockers:", error);

          let errorMessage =
            "An error occurred while adding multiple blockers.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            errorMessage = error.response.data.error;
          }

          throw new Error(errorMessage);
        }
        const dp = this.calendar;
        dp.update();
        const selectedStartOfWeek = this.getStartOfWeek(args.start.value);
        const selectedEndOfWeek = new Date(selectedStartOfWeek);
        console.log("selectedStartOfWeek:", selectedStartOfWeek);
        console.log("selectedEndOfWeek:", selectedEndOfWeek);
        selectedEndOfWeek.setDate(selectedEndOfWeek.getDate() + 7);
        await this.updateCalendar(
          selectedStartOfWeek.toISOString(),
          selectedEndOfWeek.toISOString()
        );
      },

      eventDeleteHandling: "Update",
      onEventClick: async (args) => {
        if (!window.confirm("Are you sure you want to delete this blocker?")) {
          return;
        }

        const blockerStartTime = args.e.start().toString();

        try {
          const token = localStorage.getItem("token");
          const response = await axios.delete(
            `/api/blocker/delete/${token}/${blockerStartTime}`
          );
          console.log(response.data);

          const dp = this.calendar;
          dp.events.remove(args.e);
          dp.update();
        } catch (error) {
          console.error("Error deleting blocker:", error);

          let errorMessage = "An error occurred while deleting the blocker.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            errorMessage = error.response.data.error;
          }

          alert(errorMessage);
        }
      },
      onBeforeCellRender: (args) => {
        // console.log("cell");
        // console.log(args);
        args.cell.backColor = "#eeeeee";
        args.cell.disabled = false;
        // let blockers = this.state.blockers;
        // console.log("blockers:")
        // console.log(blockers);
        let blockers = this.state.blockers;
        if (blockers) {
          for (let i = 0; i < blockers.length; i++) {
            if (
              args.cell.start >= blockers[i].start &&
              args.cell.end <= blockers[i].end
            ) {
              //args.cell.backColor = "#aba9a9";
              // args.cell.disabled = true;
              args.cell.backColor = "#808080";
              args.cell.fontColor = "white";
              break;
            }
          }
        }
      },

      date: "",
      // added date for the title
    };
  }

  get calendar() {
    return this.calendarRef.current.control;
  }

  getDate() {
    this.setState({
      date: new Date().toDateString(),
    });
  }

  async componentDidMount() {
    //this.updateCalendar();
    this.getDate();
    const startOfWeek = this.getStartOfWeek(new Date());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    await this.updateCalendar(
      startOfWeek.toISOString(),
      endOfWeek.toISOString()
    );
  }

  async updateCalendar(startTime, endTime) {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `/api/blockers/getBetweenTimes/${token}/${startTime}/${endTime}`
      );

      console.log(response.data);
      const blockers = response.data.blockers.map((blocker) => ({
        start: new Date(blocker.time).getTime(),
        end: new Date(blocker.time).getTime() + blocker.duration * 60000,
        backColor: "#808080",
      }));

      this.calendar.events.list = blockers;
      //this.setState({ blockers: blockers }); // Add this line here
      console.log(blockers);
      this.calendar.update();
    } catch (error) {
      console.error("Error updating calendar:", error);

      let errorMessage = "An error occurred while updating the calendar.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      throw new Error(errorMessage);
    }
  }

  // getStartOfWeek(date) {
  //   const startOfWeek = new Date(date);
  //   const dayOfWeek = startOfWeek.getDay();
  //   const diff = startOfWeek.getDate() - dayOfWeek;
  //   startOfWeek.setDate(diff);
  //   return startOfWeek;
  // }


  exportReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/blockers/getAll/${token}`);
      const blockers = response.data.blockers;
      var tasks = []
      var report = "Productivity Report\n\n";

      //TODO: after merging with final task model, remove blockers and format
      //(remove ids, __V, user info...)

      // blockers.forEach(function (blocker) {
      //   if (hero.hasOwnProperty('task')) {
      //     const displayTask = {
            
      //     };

      //   }
      // });

      // report += create(tasks);
      report += create(blockers);

      var blob = new Blob([report], {
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
      const todayTask =[];
      var report = "Daily Log\n\n";
      const today = new Date()

      blockers.forEach((b) => {

        if ((today.toISOString().substring(0,10) === b.time.substring(0,10))) {
          todayTask.push(b);
        }

      });

      if (todayTask.length == 0) {
        report += "nothing planned for today"
      }
      else {
        report += create(todayTask)
      }

      var blob = new Blob([report], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "Daily Log.txt");
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
      saveAs(blob, "tasks.txt");
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

  getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - (dayOfWeek === 0 ? 0 : dayOfWeek);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    console.log("start of week:", startOfWeek);
    return startOfWeek;
  }

  render() {
    const currentDate = new Date();
    const startOfWeek = this.getStartOfWeek(currentDate)
      .toISOString()
      .slice(0, 10);
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
              startDate={startOfWeek}
              selectionDay={startOfWeek}
              //weekStarts={"Sunday"} // Add this line to start the week on Sundays
              onTimeRangeSelected={async (args) => {
                const selectedStartOfWeek = this.getStartOfWeek(args.day);
                const selectedEndOfWeek = new Date(selectedStartOfWeek);
                selectedEndOfWeek.setDate(selectedEndOfWeek.getDate() + 7);

                await this.updateCalendar(
                  selectedStartOfWeek.toISOString(),
                  selectedEndOfWeek.toISOString()
                );

                this.calendar.update({
                  startDate: args.day,
                });
              }}
            />
            <div style={styles.pad}>
              <center>
                <button type="button" onClick={this.exportTasks}>
                  Export Tasks
                </button>
                <button type="button" onClick={this.exportReport}>
                  Get Productivity Report
                </button>
                <button type="button" onClick={this.exportDay}>
                  Daily Log
                </button>
                {/* <button type="button" onClick={this.importTasks}>
                  Import Tasks
                </button> */}
              </center>
            </div>
            <Timer />
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
