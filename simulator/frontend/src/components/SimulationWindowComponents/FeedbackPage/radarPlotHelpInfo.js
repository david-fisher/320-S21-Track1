export const RadarPlotHelpInfo = [
  {
    title: 'General Info',
    description: `The Radar Plot allows you to see a graphical view of the ethical issues pertaining to the scenario and your
    coverage of each individual issue, based on the stakeholders you talked to.
    The List View allows you to see statistics pertaining to your ethical issue coverage while undergoing the scenario.
    Here you can see the ethical issues pertaining to this scenario, their overall ethical importance, 
    your importance coverage score per issue, and individual issue coverage.`,
  },
  {
    title: 'Total Summary Value Score',
    description: `The summary value is a score that combines the degree of coverage with the importance of the issues covered.
    A score >= 0.4 equals good coverage behavior.
    A score between 0.4 and 0.2 equals ok coverage behavior.
    A score between 0.2 and 0 equals poor coverage behavior.`,
  },
  {
    title: 'Issue Importance Score',
    description: `This score represents "ethical importance" of the issue.
  Scores range from 0 to 5, 0 being not ethically important at all and 5 being very ethically important.
  For example, the issue "Personal Profit" can be given an importance factor of 1, 
  as the issue may be important for oneself, but not ethically important to the wellbeing of others.
  On the other hand, the issue "User Data Privacy" can be given an importance factor of 5, 
  as proper handling of user data is ethically important especially to all users using the pertaining system.`,
  },
  {
    title: 'Issue Coverage %',
    description: `The issue coverage percentage represents the relative extent to which the ethical
    issue pertaining to the scenario has been explored by you via the stakeholders that you selected.`,
  },
  {
    title: 'Total Coverage Score',
    description: `Total Coverage Score for a given issue is equal to 
    (issue_coverage_percentage) * (importance_score / 5)`,
  },
];
