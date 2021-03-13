import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, List, ListItem, ListItemText, Button, Box, Typography} from '@material-ui/core';
import { GatheredInfoContext } from '../simulationWindow';
import PersonIcon from '@material-ui/icons/Person';
import InfoModal from './infoModal';
import axios from 'axios';
import { ScenariosContext } from '../../Nav';
import {BASE_URL, STUDENT_ID} from "../../constants/config";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
    color: "#5b7f95"
  }
}));


export default function InfoGatheredList({pages}) {
  const classes = useStyles();

  const [showList, setShowContent] = React.useState(true);
  const toggleShow = () => {
    setShowContent(show => !show);
  };

  // const modalTitle = "Introduction";
  // const inputText = "Some Text 123";

  let listContentById = {};
  const [infos, setInfos] = useContext(GatheredInfoContext);
  const [scenarios, setScenarios] = React.useContext(ScenariosContext);

  /*  Retrieve the content to display for a given info button.
      If the info button onClick triggers an alert, this should be a string. If it's a modal popup, it should be html.
  */
  async function getListContent(info) {
    if (listContentById[info.id] === undefined) {
      const mockHttpRequest = async () => { // Simulating async retrieval of data
        switch (info.id) {
          case 'p0':
            return (<Typography>placeholder</Typography>);
          case 'page':
            return axios({
              method: 'get',
              url: BASE_URL + '/scenarios/task',
              headers: {
                studentID: STUDENT_ID,
                scenarioID: scenarios.currentScenarioID
              }
            }).then(response => {
              return response.data[0].body_text;
            });
          default:
            if (info.id.startsWith('stakeholder:')) {
              return (<Typography>a cool stakeholder</Typography>);
            }
            return (<Typography>default</Typography>);
        }
      }
      return mockHttpRequest()
        .then(res => {
          listContentById[info.id] = res;
          return res;
        }).catch(err => console.error(err));
    } else {
      return listContentById[info.id];
    }
  }

  //changing variables as per screensize
  const [height, width] = useWindowSize();
  const isSmall = width < 640;
  const isMedium = width < 1024; //could also be 1007 instead of 1024 depending on standard used
  const margin_left = isSmall? 1 : (isMedium ? 2 : 8);
  const title_fontSize = isSmall? '8px' : (isMedium ? '12px' : '16px'); //use it later when making it suitable for medium and small sizes

  return (
    <div className={classes.root}>
      <Box mt = {6} ml = {'20%'}>
        <Button onClick={toggleShow} 
         color = "primary"
         style = {{ fontSize: '16px'}}
         disableRipple = "true"
         >
         Gathered Information
         </Button>
        {showList &&
          <List>
            {/* {infos.filter(info => pages[info.pageId].visited).map(info => {
              return (
                <ListItem key={info.id} button onClick={() => getListContent(info).then(res => alert(res))}>
                  {(info.pageId === 'stakeholders') &&
                    <Box mr = {1} mb = {0.75}>
                      <PersonIcon style = {{ color: "#373a3c"}}/>
                    </Box>
                  }
                  <ListItemText height={400} width={300}>
                    {info.name}
                  </ListItemText>
                </ListItem>
              );
            })} */}
            {infos.filter(info => pages[info.pageId].visited).map(info => {
              return (
                <ListItem key={info.id}>
                  <InfoModal getContent={getListContent} info={info}/>
                </ListItem>
              );
            })}
          {/* <ListItem>
            <InfoModal inputText={inputText} modalTitle={modalTitle}/>
          </ListItem> */}
          </List> 
        }
     </Box> 
    </div>
  );
}

function useWindowSize(){
  const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
  useEffect(()=> {
    const handleResize = () =>{
      setSize([window.innerHeight, window.innerWidth]);
    };
    window.addEventListener("resize", handleResize);
    return ()=>{
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return size;
}