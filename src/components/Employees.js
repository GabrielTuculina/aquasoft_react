import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    Button
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { gql, useQuery, useMutation } from '@apollo/client';

import { setEmployeeAction, deleteEmployeeAction } from './redux/actions';
import CreateEmployeeModal from './modals/CreateEmployeeModal';
import EditEmployeeModal from './modals/EditEmployeeModal';

const styles = {
    table: {
        marginTop: "5vh",
        marginLeft: "2vw",
        marginRight: "2vw",
        boxShadow: "10px 10px 8px 10px #888888"
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}

const headCells = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'hire_date', label: 'Hire Date' },
    { id: 'salary', label: 'Salary' },
    { id: 'job_title', label: 'Job Title' },
    { id: 'edit_employees', label: '' },
    { id: 'delete_employees', label: '' },
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
  
function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}
  
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
            return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function TblHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell 
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.id === "salary" || headCell.id === "hire_date" ?
                            (
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <span style={styles.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                            ) :
                            headCell.label
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

function TblBody(props) {
    const { order, orderBy, rows, setStateEmployees, dispatch, selector } = props;

    const { editTrigger, setEditTrigger } = useState(false);

    if(rows === undefined)
        return null;

    const getFormatedDate = (timestamp) => {
        const dateObj = new Date(Number.parseInt(timestamp));
        
        const month = dateObj.getMonth();
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();

        return day  + '-'+ month  + '-' + year;
    }
    
    return (
        <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
                .map(row => (
                    <TableRow key={row.id}>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{getFormatedDate(row.hire_date)}</TableCell>
                        <TableCell align="left">{row.salary}</TableCell>
                        <TableCell align="left">{row.job_title}</TableCell>
                        <TableCell align="left">
                            <EditEmployeeModal
                                editTrigger={editTrigger}
                                setEditTrigger={setEditTrigger}
                                employeeToUpdate={row}
                            />
                        </TableCell>
                        <TableCell align="left">
                            <DeleteButton
                                employeeToDelete={row}
                                setStateEmployees={setStateEmployees}
                                dispatch={dispatch}
                                selector={selector}
                            />
                        </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    );
}

const DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($id: Int!, $project_id: Int!) {
        deleteEmployee (
            id: $id,
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

function DeleteButton(props) {

    const { employeeToDelete, setStateEmployees, dispatch } = props;

    const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

    return (
        <Button variant="contained" color="secondary" onClick={e => {
            e.preventDefault();
            deleteEmployee({variables: {
                    id: Number.parseInt(employeeToDelete.id),
                    project_id: Number.parseInt(employeeToDelete.project_id)
                }})
                .then(response => {
                    console.log(response);
                    dispatch(deleteEmployeeAction(employeeToDelete.id));
                    setStateEmployees( response.data.deleteEmployee );
                })
                .catch(err => {
                    console.log(JSON.stringify(err, null, 2));
                });
        }} >
            Delete
        </Button>
    );
}

function EmployeesComponent() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('hire_date');
    const [employees, setEmployees] = useState();

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const { data } = useQuery( gql`
        query {
            employeesByProjectId (project_id: ${id}) {
                id
                name
                email
                hire_date
                salary
                job_title
                project_id
              }
        }
    `);

    useEffect(() => {
        if(data && data.employeesByProjectId) {
            setEmployees(data.employeesByProjectId);
            dispatch(setEmployeeAction(employees));
        }
    }, [data]);

    return (
        <div style={styles.table}>
            <CreateEmployeeModal
                stateEmployees={employees}
                setStateEmployees={setEmployees}
            />
            <br/><br/>
            <Paper>
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        aria-label="enhanced table"
                    >
                        <TblHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />

                        <TblBody
                            order={order}
                            orderBy={orderBy}
                            rows={employees}
                            setStateEmployees={setEmployees}
                            dispatch={dispatch}
                        />
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    )
}

export default EmployeesComponent;