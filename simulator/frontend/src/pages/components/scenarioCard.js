import React from 'react';
 
export default function ScenarioCard({finished, title, course, date}) {       //scenario card for the simulator homepage
   let word = finished ? "Completed on: " : "Assigned: "
    return(
       <div>
           <h2>{title}</h2>
           <h4>Course: {course}</h4>
           <p>{word}{date}</p>
       </div>
   )
 
}
