function addProjectAction(data) {
    return {
        type: 'ADD_PROJECTS',
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

module.exports = {
    addProjectAction,
    addEmployeeAction,
    deleteEmployeeAction,
    updateEmployeeAction,
    addApolloClient
};