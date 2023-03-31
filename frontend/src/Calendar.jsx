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
    this.calendarRef = React.createRef();
    this.state = {
      showGeneratedMessage: false,
      isModalOpen: false,
      taskName: "",
      blockers: [],
      workSessions: [],
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
          //console.log("multiple blockers: ", response.data);
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
        //console.log("selectedStartOfWeek:", selectedStartOfWeek);
        //console.log("selectedEndOfWeek:", selectedEndOfWeek);
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
          console.log("delete response:", response.data);

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

      //console.log("blocker between time:", response.data);
      const blockers = response.data.blockers.map((blocker) => ({
        start: new Date(blocker.time).getTime(),
        end: new Date(blocker.time).getTime() + blocker.duration * 60000,
        backColor: "#808080",
      }));

      const currentWeekWorkSessions = this.filterCurrentWeekWorkSessions(
        this.state.workSessions,
        startTime,
        endTime
      );
      const calendarWorkSessions = this.transformWorkSessionsToEvents(
        currentWeekWorkSessions
      );
      console.log("calendarWorkSession: ", calendarWorkSessions);

      // Combine blockers and work sessions
      const combinedEvents = [...blockers, ...calendarWorkSessions];

      // Update calendar events
      this.calendar.events.list = combinedEvents;
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

  async generateSchedule() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`/api/task/getAllWorkSessions/${token}`);
      const allWorkSessions = response.data;
      console.log("allWorkSessions: ", allWorkSessions);
      const earliestStartDate = this.getEarliestDate(allWorkSessions);
      this.setState({ workSessions: allWorkSessions, earliestStartDate });
      this.toggleGeneratedMessage();
    } catch (error) {
      console.error("Error generating schedule:", error);
      let errorMessage = "An error occurred while generating the schedule.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      throw new Error(errorMessage);
    }
  }

  filterCurrentWeekWorkSessions(workSessions, startTime, endTime) {
    return workSessions.filter(
      (workSession) =>
        new Date(workSession.start) >= new Date(startTime) &&
        new Date(workSession.end) <= new Date(endTime)
    );
  }

  transformWorkSessionsToEvents(workSessions) {
    return workSessions.map((workSession) => {
      let startDate = new Date(workSession.start);
      let endDate = new Date(workSession.end);
      startDate = new Date(startDate.getTime() - 60000 * 240);
      endDate = new Date(endDate.getTime() - 60000 * 240);
      const color = this.generateColorFromString(workSession.task);
      //console.log("work session: ", workSession);
      return {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        text: workSession.task,
        backColor: color, // Add the color property
      };
    });
  }

  toggleGeneratedMessage() {
    this.setState({ showGeneratedMessage: true }, () => {
      setTimeout(() => {
        this.setState({ showGeneratedMessage: false });
      }, 2000);
    });
  }

  getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - (dayOfWeek === 0 ? 0 : dayOfWeek);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    //console.log("start of week:", startOfWeek);
    return startOfWeek;
  }

  generateColorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

  getEarliestDate(workSessions) {
    let earliestDate = new Date(workSessions[0].start);

    workSessions.forEach((workSession) => {
      const currentDate = new Date(workSession.start);

      if (currentDate < earliestDate) {
        earliestDate = currentDate;
      }
    });

    return earliestDate;
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
          </div>
          <div style={styles.main}>
            <Link to="/tasklist">
              <button>Go to Task List</button>
            </Link>
            <button onClick={() => this.generateSchedule()}>
              Generate Schedule
            </button>
            {this.state.showGeneratedMessage && (
              <span style={{ marginLeft: "10px", color: "green" }}>
                Schedule is generated! Start work on{" "}
                {this.state.earliestStartDate.toLocaleDateString()}
              </span>
            )}

            <DayPilotCalendar {...this.state} ref={this.calendarRef} />
          </div>
        </div>
      </div>
    );
  }
}

export default Calendar;
