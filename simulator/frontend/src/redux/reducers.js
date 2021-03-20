import { combineReducers } from 'redux';

const initialCompletedStakeholders = {
    stakeholdersById: {},
    stakeholderIds: []
}

function completedStakeholders(state = initialCompletedStakeholders, action) {
    switch (action.type) {
        default:
            return state
    }
}

const playerReducer = combineReducers({
    completedStakeholders
});

export default playerReducer;