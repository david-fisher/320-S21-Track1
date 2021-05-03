import React from 'react';
 
export default function ScenarioCard({title, course, date}) {       //scenario card for the simulator homepage
   return(
       <div>
           <h2>{title}</h2>
           <h4>Course: {course}</h4>
           <p>Assigned: {date}</p>
       </div>
   )
 
}
