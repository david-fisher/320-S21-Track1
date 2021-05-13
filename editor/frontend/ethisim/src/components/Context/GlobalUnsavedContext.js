import React, { createContext } from 'react';
const GlobalUnsavedContext = createContext([false, () => {}]);
export default GlobalUnsavedContext;
