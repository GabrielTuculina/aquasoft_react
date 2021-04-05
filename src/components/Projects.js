import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import {addProjectAction} from './redux/actions';
import { gql } from '@apollo/client';
import usePromise from 'react-promise';
    
const styles = {
    table: {
        marginTop: "5vh",
        marginLeft: "2vw",
        marginRight: "2vw",
        boxShadow: "10px 10px 8px 10px #888888"
    }
}

const rows = [
    {
        "id": 1,
        "project_name": "Aquasoft first project",
        "start_date": "30.03.2021",
        "planned_end_date": "31.07.2022",
        "description": "Hello World project that weirdly works ... or not",
        "project_code": "insert random code here"
    },
    {
        "id": 2,
        "project_name": "Ana are mere",
        "start_date": "03.04.2020",
        "planned_end_date": "30.09.2020",
        "description": "Just another failure",
        "project_code": "insert random code here2"
    },
    {
        "id": 3,
        "project_name": "Hello friends",
        "start_date": "22.04.2021",
        "planned_end_date": "27.09.2021",
        "description": "The legend has it they never answered",
        "project_code": "insert random code here3"
    }
];

const headCells = [
    { id: 'project_name', label: 'Name' },
    { id: 'start_date', label: 'Start Date' },
    { id: 'planned_end_date', label: 'Expected Planned Date' },
    { id: 'description', label: 'Description' },
    { id: 'project_code', label: 'Code' },
    { id: 'view_employees', label: '' },
];

function TblHead(props) {

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

function TblBody(props) {
    console.log(props);
    // const {rows} = props;
    // console.log(rows);

    return (
        <TableBody>
            {rows.map(row => (
                <TableRow key={row.id}>
                    <TableCell align="left">{row.project_name}</TableCell>
                    <TableCell align="left">{row.start_date}</TableCell>
                    <TableCell align="left">{row.planned_end_date}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">{row.project_code}</TableCell>
                    <TableCell align="left">
                        <ViewEmployees id={row.id}/>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

function ViewEmployees(props) {
    const {id} = props;
    const history = useHistory();

    const routeChange = () =>{ 
        let path = `/projects/${id}`; 
        history.push(path);
    }

    return (
        <Button variant="contained" color="primary" onClick={() => routeChange(props)} >
            Check employees
        </Button>
    );
}

const selectProjects = state => state.projects;
const selectClient = state => state.client;

function ProjectsComponent() {
    const dispatch = useDispatch();
    const client = useSelector(selectClient);
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        const fetchProjects = async () => {
            const result = await client
                .query({
                    query: gql`
                        query {
                            projects {
                                id
                                project_name
                                start_date
                                planned_end_date
                                description
                                project_code
                            }
                        }
                    `
                });
            setProjects(result.data);
        }
    }, []);

    dispatch(addProjectAction(projects));
    console.log(projects);

    return (
        <div style={styles.table}>
            <Paper>
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        aria-label="enhanced table"
                    >
                        <TblHead />

                        <TblBody rows={projects}/>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

export default ProjectsComponent;