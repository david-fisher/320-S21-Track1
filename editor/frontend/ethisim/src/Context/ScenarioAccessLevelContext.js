import { createContext } from 'react';
/*
USER_ACCESS: 1 = ADMIN
USER_ACCESS: 2 = EDIT-ONLY
USER_ACCESS: 3 = READ-ONLY
*/
const ScenarioAccessLevelContext = createContext(1);
export default ScenarioAccessLevelContext;
