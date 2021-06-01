export const FlowDiagramHelpInfo = [
  {
    title: 'General Info',
    description:
            'The Flow Diagram page is where you can order the pages (scenes) of your scenario.',
  },
  {
    title: 'Introduction Page',
    description:
            'This page will be the first page of the scenario that the players will see.',
  },
  {
    title: 'Connecting edges',
    description: `To connect one page to another, you must select the bottom dot of a page component, hold,
        and connect to the top dot of the intended next page. 
        A bottom dot can only link to one top dot.
        A top dot can have many incoming dots.
        Self loops are not allowed.`,
  },
  {
    title: 'Connecting Edges for Action Page Components',
    description: `The first option is the leftest most dot,
        the second option is the second leftest most dot, and so on.
        If a player selects the first option, the player will go to the page that the leftest most dot connects to, and so on.`,
  },
  {
    title: 'Remove Edge',
    description: `To remove an edge, you must select an edge.
        The "Remove Edge" button will become active.
        Selecting "Remove Edge" will remove the edge.`,
  },
  {
    title: 'Expand | Page Preview',
    description: `Selecting the expand button that is above each component will show a page preview that will 
        present exactly how the page will look like to the player.`,
  },
  {
    title: 'Reset',
    description:
            'Selecting "Reset" will reset the flow diagram back to its initial state.',
  },
  {
    title: 'Save Changes',
    description: 'Selecting "Save Changes" will save your changes.',
  },
];
