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
      onBeforeCellRender: (args) => {
        // console.log("cell");
        // console.log(args);
        args.cell.backColor = "#eeeeee";
        args.cell.disabled = false;

        let blockers = [
          {
            id: 1,
            start: "2022-02-03T09:00:00",
            end: "2022-02-03T14:00:00",
          },
        ];
        // let blockers = this.state.blockers;
        // console.log("blockers:")
        // console.log(blockers);
        if (blockers) {
          for (let i = 0; i < blockers.length; i++) {
            if (
              args.cell.start >= blockers[i].start &&
              args.cell.end <= blockers[i].end
            ) {
              args.cell.backColor = "#aba9a9";
              // args.cell.disabled = true;
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

  componentDidMount() {
    //this.updateCalendar();
    this.getDate();
  }

  getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
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
