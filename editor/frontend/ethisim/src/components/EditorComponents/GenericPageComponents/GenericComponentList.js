import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GenericComponent from './GenericComponent';

export default function GenericComponentList() {
  const [components, setComponent] = useState([<GenericComponent key={1} />]);

  const addComponent = (event) => {
    // eslint-disable-next-line no-undef
    setComponent(components.concat(<GenericComponent key={key + 1} />));
    event.preventDefault();
  };

  return (
    <div>
      <Typography align="center" variant="h2">
        Generic Page List
      </Typography>
      {components}
      <Button variant="contained" onClick={addComponent}>
        Add Generic Page
      </Button>
    </div>
  );
}
