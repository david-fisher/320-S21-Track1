import React, { useState } from "react";
import StakeHolder from "./stakeHolder";
import Button from "@material-ui/core/Button";
import "./stakeHolders.css";

function StakeHolderFields (){
  
  const[stakeHolders, setStakeHolders] = useState([]);

  const [stakeHolder, setEdit] = useState({
   id: Math.floor(Math.random() * 10000),
 });



 const removeStakeHolder = (stakeHolderID) => {
   console.log(stakeHolderID);
   const leftStakeHolders = stakeHolders.filter((s) => s.id !== stakeHolderID);
   setStakeHolders(leftStakeHolders);
 };
 
 const addStakeHolder = (e) => {
   
   const newStakeHolders = [...stakeHolders, stakeHolder];
   setStakeHolders(newStakeHolders);
   console.log(...stakeHolders);
   setEdit( {id: Math.floor(Math.random() * 10000) } );

 };

 function updateStakeholder(stakeholderID, stakeholderBody) {
   //TODO
   //functional code to save items to backend
 };





 
    return (
      <div className="stakeHolders">
        <Button
          id="button"
          onClick={addStakeHolder}
          variant="contained"
          color="primary"
        >
          Add Stake Holder
        </Button>

        <form id="form">
          {stakeHolders.map((stakeHolder) => (
            <StakeHolder
              key={stakeHolder.id}
              removeStakeHolder={removeStakeHolder}
              stakeHolder={stakeHolder}
            />
          ))}
        </form>
      </div>
    );
  }


export default StakeHolderFields;
