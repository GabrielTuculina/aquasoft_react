import React from 'react';
import { useParams } from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';


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
    addButton: {
        marginTop: "1vh",
        marginRight: "1vw",
        float: "right"
    },
}

const rows = [
    {
        "id": 1,
        "name": "Gabriel",
        "email": "followMe@DoNotDisturb.com",
        "hire_date": "19.04.2017",
        "salary": "8500",
        "job_title": "Programul primul inginer",
    },
    {
        "id": 2,
        "name": "Andrew",
        "email": "sadBumpkin@gmail.com",
        "hire_date": "12.04.2021",
        "salary": "5000",
        "job_title": "Middle Software Developer",
    }
];

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
    const { order, orderBy } = props;

    return (
        <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
                .map(row => (
                    <TableRow key={row.id}>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.hire_date}</TableCell>
                        <TableCell align="left">{row.salary}</TableCell>
                        <TableCell align="left">{row.job_title}</TableCell>
                        <TableCell align="left">
                            <EditButton />
                        </TableCell>
                        <TableCell align="left">
                            <DeleteButton />
                        </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    );
}

const StyledButton = withStyles({
    root: {
      borderRadius: 3,
      border: 0,
      color: '#00cc00',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    label: {
      textTransform: 'capitalize',
    },
})(Button);

function AddButton(props) {

    return (
        <Button variant="contained" color="primary" style={styles.addButton} onClick={() => addEmployee(props)} >
            Add
        </Button>
    );
}

function addEmployee(props) {

}

function EditButton(props) {

    return (
        <StyledButton onClick={() => editEmployee(props)} >
            Edit
        </StyledButton>
    );
}

function editEmployee(props) {
    
}

function DeleteButton(props) {

    return (
        <Button variant="contained" color="secondary" onClick={() => deleteEmployee(props)} >
            Delete
        </Button>
    );
}

function deleteEmployee(props) {
    
}


function EmployeesComponent() {
    const { id } = useParams();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <div style={styles.table}>
            <AddButton /> <br/><br/>

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
                        />
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    )
}

export default EmployeesComponent;