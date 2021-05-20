import { makeStyles } from '@material-ui/core';
import React from 'react';
 
const useStyles = makeStyles((theme) => ({
   container: {
       height: 10,
       width: '100%',
       marginTop: 20,
       marginBottom: 10,
       backgroundColor: "#b5b5b5",
       borderRadius: 50,
       margin: 0
   },
    label : {
       padding: 5,
       color: 'white',
       fontWeight: 'bold'
   }
}));
 
export default function CardProgressBar({completed, max, size}) {
   const classes = useStyles();

   const percentage = (max > 0) ? completed/max*100 : 100;
   const red = (max > 0) ?  136*(100 - percentage)/100 : 136;
   const green = (max > 0) ? 28*(100 -percentage)/100 : 28;
   const blue = (max > 0) ? 28*(100 - percentage)/100 : 28;
 
   const fillStyle = {
       height: '100%',
       width: `${percentage}%`,
       backgroundColor: `rgb(${red}, ${green}, ${blue})`,
       borderRadius: 'inherit',
       textAlign: 'right'
   }

 
   return (
   <div className={classes.container} style={{height : size}}>
       <div style={fillStyle}>
         <span className={classes.label} />
       </div>
     </div>
   );
}