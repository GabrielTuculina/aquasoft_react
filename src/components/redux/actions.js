function getProjectsAction(data) {
    return {
        type: 'GET_PROJECTS',
        payload: data
    }
}

function addEmployeeAction(data) {
    return {
        type: 'ADD_EMPLOYEE',
        payload: data
    }
}

function deleteEmployeeAction(data) {
    return {
        type: 'DELETE_EMPLOYEE',
        payload: data
    }
}

function updateEmployeeAction(data) {
    return {
        type: 'UPDATE_EMPLOYEE',
        payload: data
    }
}

function addApolloClient(client) {
    return {
        type: 'ADD_APOLLO_CLIENT',
        payload: client
    }
}

function setEmployeeAction(data) {
    return {
        type: 'SET_EMPLOYEE',
        payload: data
    }
}

module.exports = {
    getProjectsAction,
    addEmployeeAction,
    deleteEmployeeAction,
    updateEmployeeAction,
    addApolloClient,
    setEmployeeAction
};