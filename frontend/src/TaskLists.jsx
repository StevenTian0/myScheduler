import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Button,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { Link } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/task/getAll/${token}`);

      console.log(response.data);

      if (Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = (task) => {
    if (selectedTask === task) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/task/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.taskId !== taskId)
      );
      setSelectedTask(null);
    } catch (error) {
      console.error(error);
    }
  };

  const renderTaskRow = (task) => {
    const isExpanded = task === selectedTask;
    return (
      <React.Fragment key={task.taskId}>
        <TableRow onClick={() => handleRowClick(task)}>
          <TableCell>
            <IconButton size="small">
              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
            {task.name}
          </TableCell>
          <TableCell align="right">{task.dueDate}</TableCell>
          <TableCell align="right">{task.priority}</TableCell>
          <TableCell align="right">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteTask(task.taskId)}
            >
              Delete task
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <div>
                <p>{task.description}</p>
                <p>Length of work: {task.lengthOfWork}</p>
                <p>Work done so far: {task.workDoneSoFar}</p>
                <p>Category: {task.category}</p>
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <div>
      <button onClick={loadTasks}>Load Tasks</button>
      <Link to="/calendar">
        <button>Go to Calendar</button>
      </Link>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="right">Priority</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tasks && tasks.map(renderTaskRow)}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TaskList;
