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
import { useDispatch } from 'react-redux';
import { getProjectsAction } from './redux/actions';
import { gql, useQuery } from '@apollo/client';
    
const styles = {
    table: {
        marginTop: "5vh",
        marginLeft: "2vw",
        marginRight: "2vw",
        boxShadow: "10px 10px 8px 10px #888888"
    }
}

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
    const {rows} = props;

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
            {rows.map(row => (
                <TableRow key={row.id}>
                    <TableCell align="left">{row.project_name}</TableCell>
                    <TableCell align="left">{getFormatedDate(row.start_date)}</TableCell>
                    <TableCell align="left">{getFormatedDate(row.planned_end_date)}</TableCell>
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

function ProjectsComponent() {
    const dispatch = useDispatch();
    const [projects, setProjects] = useState();

    const { data } = useQuery( gql`
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
    `);

    useEffect(() => {
        if(data && data.projects) {
            setProjects(data.projects);
        }
    }, [data]);

    if(projects !== undefined) {
        dispatch(getProjectsAction(projects));
    }

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