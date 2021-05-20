import { createContext } from 'react';
// used for coordination of unsaved work between sidebar and component in the editor
const GlobalContext = createContext({pages: [], activeIndex: 0}, () => {});
export default GlobalContext;
