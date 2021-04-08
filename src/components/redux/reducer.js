const initialState = {
    projects: [],
    employees: [],
    client: {},
    editEmployee: {}
}

function deleteEmployee(employees, id) {
    const new_emp = [];

    for(let i = 0; i < employees.length; ++i)
        if(i !== id)
            new_emp.push(employees[i]);

    return new_emp;
}

function updateEmployee(employees, obj) {
    const new_emp = [];

    for(let i = 0; i < employees.length; ++i)
        if(i !== obj.id)
            new_emp.push(employees[i]);

    new_emp.push(obj);

    return new_emp;
}

export default function appReducer(state = initialState, action) {
    switch(action.type) {
        case "ADD_APOLLO_CLIENT":
            return {
                ...state,
                client: action.payload
            }
        case "GET_PROJECTS":
            return {
                ...state,
                projects: action.payload
            }
        case "ADD_EMPLOYEE":
            return {
                ...state,
                employees: [
                    ...state.employees,
                    action.payload
                ]
            }
        case "SET_EMPLOYEE":
            return {
                ...state,
                employees: action.payload
            }
        case "DELETE_EMPLOYEE":
            return {
                ...state,
                employees: [
                    deleteEmployee(state.employees, action.payload)
                ]
            }
        case "UPDATE_EMPLOYEE":
            return {
                ...state,
                employees: [
                    updateEmployee(state.employees, action.payload)
                ],
            }
        default:
            return state;
    }
}