import { createContext } from 'react';
// used for coordination of scenario player data
const GlobalContext = createContext([{ pages: [], activeIndex: 0 }, () => {}]);
export default GlobalContext;
