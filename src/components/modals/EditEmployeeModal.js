import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { TextField, Button, Grid, Modal } from '@material-ui/core';

import {MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import { useDispatch } from 'react-redux';
import { gql, useMutation } from '@apollo/client';

import { updateEmployeeAction } from '../redux/actions';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: "25vh"
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    addButton: {
        marginTop: "1vh",
        marginRight: "1vw",
        float: "right"
    },
    form: {
        // borderStyle: "solid",
        // borderWidth: "2px",
        // boxShadow: "10px 10px 5px grey",
        // width: "50%",
        minHeight: "55wh",
        textAlign: "center"
    },
}));

const StyledButton = withStyles({
    root: {
      background: '#00cc00',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 36,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
})(Button);

function ModalBody(props) {
    const { employeeToUpdate } = props;

    const [employee, setEmployee] = useState({
        id: employeeToUpdate.id,
        name: employeeToUpdate.name,
        email: employeeToUpdate.email,
        salary: employeeToUpdate.salary,
        job_title: employeeToUpdate.job_title,
        project_id: employeeToUpdate.project_id
    });

    const [selectedDate, setSelectedDate] = useState(new Date(Number.parseInt(employeeToUpdate.hire_date)));

    const classes = useStyles();

    const handleChange = (event) => {
        if(event.target) {
            const param_name = event.target.name;
            const param_value = event.target.value;

            const emp = employee;
            emp[param_name] = param_value;
            setEmployee(emp);
        } else {
            console.log(event);

            const emp = employee;
            emp.hire_date = event;
            setEmployee(emp);
        }
    }

    return (
        <div className={classes.paper} >
            <form className={classes.form} >
                <br/> 
                <TextField
                    id="name"
                    label="Name of the employee"
                    name="name"
                    defaultValue={employee.name}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                /><br/>

                <TextField
                    id="email"
                    label="Email of the employee"
                    name="email"
                    defaultValue={employee.email}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                /><br/>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                        <KeyboardDatePicker
                            // disablePast
                            variant="inline"
                            format="MM/dd/yyyy"
                            value={selectedDate}
                            label="Hiring date"
                            style={{marginRight: 10}}
                            onChange={setSelectedDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>

                <TextField
                    id="salary"
                    label="Salary"
                    name="salary"
                    defaultValue={employee.salary}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                /><br/>

                <TextField
                    id="job_title"
                    label="Job title"
                    name="job_title"
                    defaultValue={employee.job_title}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                /><br/>

                <TextField
                    id="project_id"
                    label="Working project id"
                    name="project_id"
                    defaultValue={employee.project_id}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                /><br/>

                <EditButton
                    dispatch={props.dispatch}
                    handleClose={props.handleClose}
                    fields={employee}
                    selectedDate={selectedDate}
                    editTrigger={props.editTrigger}
                    setEditTrigger={props.setEditTrigger}
                />
            </form>
        </div>
    )
}

const UPDATE_EMPLOYEE = gql`
    mutation UpdateEmployee(
        $id: ID!,
        $name: String!,
        $email: String!,
        $hire_date: String!,
        $salary: String!,
        $job_title: String!,
        $project_id: Int!) {
            updateEmployee (
                id: $id
                name: $name
                email: $email
                hire_date: $hire_date
                salary: $salary
                job_title: $job_title
                project_id: $project_id
            ) {
                id
                name
                email
                hire_date
                salary
                job_title
                project_id
            }
    }`;

function EditButton(props) {
    const { dispatch, handleClose, fields, selectedDate, editTrigger, setEditTrigger } = props;

    const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);

    return (
        <Button variant="contained" color="primary" onClick={e => {
            e.preventDefault();
            updateEmployee({variables: {
                    id: Number.parseInt(fields.id),
                    name: fields.name,
                    email: fields.email,
                    hire_date: selectedDate,
                    salary: fields.salary,
                    job_title: fields.job_title,
                    project_id: Number.parseInt(fields.project_id)}})
                .then(response => {
                    dispatch(updateEmployeeAction(response.data.updateEmployee));
                    setEditTrigger(!editTrigger);
                    handleClose();
                })
                .catch(err => {
                    console.log(JSON.stringify(err, null, 2));
                });
        }} >
            Finish edit
        </Button>
    );
}

function OpenButton(props) {
    const { handleOpen } = props;

    return (
        <StyledButton variant="contained" color="primary" onClick={handleOpen} >
            Edit
        </StyledButton>
    );
}

export default function EditEmployeeModal(props) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
        <div>
            <OpenButton handleOpen={handleOpen} />

            <Modal className={classes.modal} open={open} onClose={handleClose} >
                <div>
                    <ModalBody
                        dispatch={dispatch}
                        handleClose={handleClose}
                        editTrigger={props.editTrigger}
                        setEditTrigger={props.setEditTrigger}
                        employeeToUpdate={props.employeeToUpdate}
                    />
                </div>
            </Modal>
        </div>
    );
}