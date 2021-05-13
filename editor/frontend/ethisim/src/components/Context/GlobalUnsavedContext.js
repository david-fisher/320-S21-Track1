import { createContext } from 'react';
//used for coordination of unsaved work between sidebar and component in the editor
const GlobalUnsavedContext = createContext([false, () => {}]);
export default GlobalUnsavedContext;
