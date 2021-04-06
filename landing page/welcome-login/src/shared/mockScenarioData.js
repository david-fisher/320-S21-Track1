const mockComponentsFlowChart = {
    scenarioId: 2,
    components: [
        {
            id: '1',
            type: 'Generic',
            title: 'Simulation Introduction',
            position: { x: 0, y: 0 },
        },
        {
            id: '2',
            type: 'Generic',
            title: 'Project Task Assignment',
            position: { x: 0, y: 0 },
        },
        {
            id: '3',
            type: 'Reflection',
            title: 'Initial Reflection',
            position: { x: 0, y: 0 },
        },
        {
            id: '4',
            type: 'Reflection',
            title: 'Middle Reflection',
            position: { x: 0, y: 0 },
        },
        {
            id: '5',
            type: 'Reflection',
            title: 'Final Reflection',
            position: { x: 0, y: 0 },
        },
        {
            id: '6',
            type: 'Action',
            title: 'Initial action',
            position: { x: 0, y: 0 },
        },
        {
            id: '7',
            type: 'Action',
            title: 'Final Action',
            position: { x: 0, y: 0 },
        },
        {
            id: '8',
            type: 'Conversation',
            title: 'Stakeholder Conversations',
            position: { x: 0, y: 0 },
        },
        {
            id: '9',
            type: 'Generic',
            title: 'Conclusion',
            position: { x: 0, y: 0 },
        },
        {
            id: '10',
            type: 'Generic',
            title: 'Consequences',
            position: { x: 0, y: 0 },
        },
    ],
};

const mockGenericHistory = {
    type: 'Generic',
    history: [
        {
            type: 'Generic',
            title: 'Marius Minea Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #1</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime(),
            author: 'Marius Minea',
            id: 1,
        },
        {
            type: 'Generic',
            title: 'David Fisher Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #2</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime() - 300000,
            author: 'David Fisher',
            id: 2,
        },
        {
            type: 'Generic',
            title: 'Marius Minea Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #1</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime() - 400000,
            author: 'Marius Minea',
            id: 3,
        },
        {
            type: 'Generic',
            title: 'David Fisher Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #2</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime() - 500000,
            author: 'David Fisher',
            id: 4,
        },
        {
            type: 'Generic',
            title: 'Marius Minea Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #1</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime() - 600000,
            author: 'Marius Minea',
            id: 5,
        },
        {
            type: 'Generic',
            title: 'David Fisher Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #2</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime() - 700000,
            author: 'David Fisher',
            id: 6,
        },
        {
            type: 'Generic',
            title: 'Marius Minea Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #1</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime() - 800000,
            author: 'Marius Minea',
            id: 7,
        },
        {
            type: 'Generic',
            title: 'David Fisher Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #2</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime() - 900000,
            author: 'David Fisher',
            id: 8,
        },
    ],
};

const mockReflectionHistory = {
    type: 'Reflection',
    history: [
        {
            type: 'Reflection',
            title: 'David Barrington Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #1</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime(),
            questions: ['How do you feel?', 'Do you like this?'],
            author: 'David Barrington',
            id: 1,
        },
        {
            type: 'Reflection',
            title: 'David Fisher Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #2</strong></u></em></span><em></em><br></p>',
            date: new Date().getTime() - 2000000,
            questions: ['How do you feel?', 'Do you like this?'],
            author: 'David Fisher',
            id: 2,
        },
    ],
};

const mockActionHistory = {
    type: 'Action',
    history: [
        {
            type: 'Action',
            title: 'David Fisher Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #1</strong></u></em></span><em></em><br></p>',
            option1: 'Go Ahead',
            option2: 'Wait',
            date: new Date().getTime(),
            author: 'David Fisher',
            id: 1,
        },
        {
            type: 'Action',
            title: 'Gordan Anderson Version Control Introduction',
            body:
                '<p><span style="font-size: 28px;"><em><u><strong>VERSION CONTROL WORKS #2</strong></u></em></span><em></em><br></p>',
            option1: 'Die',
            option2: 'Live',
            date: new Date().getTime() - 1000000,
            author: 'Gordan Anderson',
            id: 2,
        },
    ],
};

const mockIssuesHistory = {
    type: 'Issues',
    history: [
        {
            date: new Date().getTime(),
            author: 'Marius Minea',
            id: 1,
            issues: [
                {
                    ISSUE_ID: 1,
                    NAME: 'Personal Wealth',
                    IMPORTANCE_SCORE: 1,
                    SCENARIO_ID: 1,
                    VERSION_ID: 2,
                },
                {
                    ISSUE_ID: 2,
                    NAME: 'User Privacy',
                    IMPORTANCE_SCORE: 5,
                    SCENARIO_ID: 1,
                    VERSION_ID: 2,
                },
                {
                    ISSUE_ID: 3,
                    NAME: 'Career Building Opportunity',
                    IMPORTANCE_SCORE: 2,
                    SCENARIO_ID: 1,
                    VERSION_ID: 2,
                },
                {
                    ISSUE_ID: 4,
                    NAME: 'Project Harms Career',
                    IMPORTANCE_SCORE: 2,
                    SCENARIO_ID: 1,
                    VERSION_ID: 2,
                },
                {
                    ISSUE_ID: 5,
                    NAME: 'Short Term Company Profits',
                    IMPORTANCE_SCORE: 2,
                    SCENARIO_ID: 1,
                    VERSION_ID: 2,
                },
                {
                    ISSUE_ID: 6,
                    NAME: 'Long Term Company Profits',
                    IMPORTANCE_SCORE: 2,
                    SCENARIO_ID: 1,
                    VERSION_ID: 2,
                },
                {
                    ISSUE_ID: 7,
                    NAME: 'User Health Improvement',
                    IMPORTANCE_SCORE: 2,
                    SCENARIO_ID: 1,
                    VERSION_ID: 2,
                },
            ],
        },
    ],
};

const mockConversationEditorHistory = {
    history: [
        {
            date: new Date().getTime(),
            author: 'Marius Minea',
            id: 1,
            stakeholders: [
                {
                    id: 1,
                    name: 'Da Big Cheeze',
                    bio: 'Spiffy',
                    mainConvo: 'Big Spiffy',
                    questionsResponses: [
                        {
                            question: 'Do you like this idea?',
                            response: "Yes, I love stealing everyone's data",
                        },
                        {
                            question: 'Do you like this idea?',
                            response: "Yes, I love stealing everyone's data",
                        },
                    ],
                    stakeHolderIssues: [
                        {
                            id: 1,
                            issue: 'Personal Wealth',
                            stakeHolderScore: 3,
                        },
                        {
                            id: 2,
                            issue: 'Privacy',
                            stakeHolderScore: 4,
                        },
                    ],
                },
            ],
        },
    ],
};

const mockGenericComponent = {
    type: 'Generic',
    id: 5,
    title: 'Introduction',
    body: 'Sample Introduction for Generic Component',
};

const mockReflectionComponent = {
    type: 'Reflection',
    id: 6,
    title: 'Initial Reflection',
    body: 'Sample Introduction for Reflection Component',
};

const mockActionComponent = {
    type: 'Action',
    id: 7,
    title: 'Initial Action',
    body: 'Sample Introduction for Action Component',
};

const mockUnfinishedScenario = {
    id: 1,
    scenarioName: 'Unfinished Scenario',
    className: 'CS320',
    authors: ['David Fisher', 'Peter Haas', 'Lee Osterweil'],
    finished: false,
};

const mockUnfinishedScenarioData = {
    id: 1,
    authors: ['David Fisher', 'Peter Haas', 'Lee Osterweil'],
    components: [
        mockGenericComponent,
        mockReflectionComponent,
        mockActionComponent,
    ],
    finished: false,
};

const mockFinishedScenario = {
    id: 2,
    scenarioName: 'Finished Scenario',
    className: 'CS320',
    authors: ['David Fisher', 'Peter Haas', 'Lee Osterweil'],
    finished: true,
};

const mockFinishedScenarioData = {
    id: 2,
    authors: ['David Fisher', 'Peter Haas', 'Lee Osterweil'],
    components: [
        mockGenericComponent,
        mockReflectionComponent,
        mockActionComponent,
    ],
    finished: true,
};

const mockFinishedScenarioStudentResponse = {
    id: 0,
    actions: [
        {
            id: 0,
            title: 'Initial Action',
            option1: 'Go ahead with the project.',
            option2: 'Wait and talk with stakeholders.',
            choice: 2,
        },
        {
            id: 1,
            title: 'Final  Action',
            option1: 'Go ahead with the project.',
            option2: 'Wait and talk with team members.',
            choice: 2,
        },
    ],
    reflections: [
        {
            id: 2,
            title: 'Initial Reflection',
            questionResponses: [
                {
                    question:
                        'What are some ethical issues that may arise from this project task assignment?',
                    response: 'I believe user privacy will be a major issue.',
                },
                {
                    question:
                        'Have you ever thought of the ethical issues you answered above in your day-to-day life?',
                    response: 'No.',
                },
            ],
        },
        {
            id: 3,
            title: 'Final Reflection',
            questionResponses: [
                {
                    question:
                        'What is some information you believe that you still need to know in order to proceed?',
                    response:
                        'I still need information about how this technology could impact vulnerable people.',
                },
                {
                    question: 'What ethical issues did you explore?',
                    response:
                        'I explored how my project task assignment could affect user privacy, short-term and long-term company profits, personal wealth, and environmental issues.',
                },
            ],
        },
    ],
};

const mockStudents = [
    {
        name: 'Enoch Hsiao',
        age: 19,
        grade: 'Sophomore',
        gender: 'Male',
        race: 'N/A',
        major: 'Computer Science',
        id: 0,
    },
    {
        name: 'John Smith',
        age: 20,
        grade: 'Sophomore',
        gender: 'Male',
        race: 'N/A',
        major: 'Computer Science',
        id: 1,
    },
    {
        name: 'Susie Lee',
        age: 21,
        grade: 'Junior',
        gender: 'Female',
        race: 'N/A',
        major: 'Computer Science',
        id: 2,
    },
    {
        name: 'Rebecca Curr',
        age: 19,
        grade: 'Freshman',
        gender: 'Female',
        race: 'N/A',
        major: 'Computer Science',
        id: 3,
    },
    {
        name: 'Sean Parker',
        age: 22,
        grade: 'Senior',
        gender: 'Male',
        race: 'N/A',
        major: 'Computer Science',
        id: 4,
    },
    {
        name: 'Vicenzo lar',
        age: 20,
        grade: 'Junior',
        gender: 'Male',
        race: 'N/A',
        major: 'Computer Science',
        id: 5,
    },
    {
        name: 'Filler1',
        age: 20,
        grade: 'Junior',
        gender: 'Female',
        race: 'N/A',
        major: 'Computer Science',
        id: 6,
    },
    {
        name: 'Filler2',
        age: 20,
        grade: 'Junior',
        gender: 'Female',
        race: 'N/A',
        major: 'Computer Science',
        id: 7,
    },
    {
        name: 'Filler3',
        age: 20,
        grade: 'Junior',
        gender: 'Female',
        race: 'N/A',
        major: 'Computer Science',
        id: 8,
    },
    {
        name: 'Filler4',
        age: 20,
        grade: 'Junior',
        gender: 'Female',
        race: 'N/A',
        major: 'Computer Science',
        id: 9,
    },
    {
        name: 'Filler5',
        age: 20,
        grade: 'Junior',
        gender: 'Male',
        race: 'N/A',
        major: 'Math',
        id: 10,
    },
    {
        name: 'Filler6',
        age: 20,
        grade: 'Junior',
        gender: 'Male',
        race: 'N/A',
        major: 'Math',
        id: 11,
    },
];

export {
    mockUnfinishedScenarioData,
    mockFinishedScenarioData,
    mockUnfinishedScenario,
    mockFinishedScenario,
    mockActionHistory,
    mockGenericHistory,
    mockReflectionHistory,
    mockIssuesHistory,
    mockGenericComponent,
    mockActionComponent,
    mockReflectionComponent,
    mockConversationEditorHistory,
    mockFinishedScenarioStudentResponse,
    mockStudents,
    mockComponentsFlowChart,
};
