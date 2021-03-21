INSERT INTO users VALUES(DEFAULT,'John Doe', 'johndoe@umass.edu');
INSERT INTO users VALUES(DEFAULT, 'Jane doe', 'janedoe@umass.edu');
INSERT INTO users VALUES(DEFAULT, 'Carl Stevens', 'cstevens@umass.edu');
INSERT INTO users VALUES(DEFAULT, 'Aisha Kirk', 'akirk@umass.edu');

INSERT INTO users VALUES(DEFAULT, 'Marc Ritter', 'mritter@umass.edu');
INSERT INTO users VALUES(DEFAULT, 'Jayla Leblanc', 'jleblanc@umass.edu');

INSERT INTO courses VALUES(DEFAULT, 'http://course1_webpage.cs.umass.edu', 'CS 320: Software Engineering', 'F2020');
INSERT INTO courses VALUES(DEFAULT, 'http://course2_webpage.cs.umass.edu', 'CS 121: Introduction to Problem Solving with Computers', 'F2020');

INSERT INTO instructs VALUES(4, 'http://mritter_webpage.umass.edu', 1);
INSERT INTO instructs VALUES(5, 'http://jleblanc_webpage.umass.edu', 2);

INSERT INTO enrolled VALUES(1, 1);
INSERT INTO enrolled VALUES(2, 1);
INSERT INTO enrolled VALUES(2, 2);
INSERT INTO enrolled VALUES(4, 2);

-- The use of \gset and RETURNING clauses removes the need to manually update references to serial primary keys
-- Do not use a semicolon after statements with \gset
-- Consult the PostgreSQL documentation for more information

-- test scenario 1
INSERT INTO scenario VALUES(DEFAULT, 'Scenario 1', '2020-12-01 23:59:59', 'description: test scenario', 'DRAFT', '<additional_data>');
insert into partof values(1,1);
INSERT INTO pages VALUES(DEFAULT, 1, 'PLAIN', 'Many software engineers trainees and providers have reported feeling unprepared for the ethical dilemmas they faced while practicing in real life. Simulation is an effective teaching modality in the training of  professionals. This resource describes the development, implementation, and assessment of an innovative simulation training program for global ethics.', 1);
INSERT INTO pages VALUES(DEFAULT, 2, 'PLAIN', 'You are a software engineer at Walmart Labs working on building a smart refridgerator with voice control and image recognition to keep track of produce.', 1);

INSERT INTO pages VALUES(DEFAULT, 3, 'PRMPT', 'Body text before initial reflection', 1);
INSERT INTO prompt VALUES(3, 'Initial reflection prompt (a)...', 1);
INSERT INTO prompt VALUES(3, 'Initial reflection prompt (b)...', 2);

INSERT INTO pages VALUES(DEFAULT, 4, 'MCQ', 'Body text before initial action', 1);
INSERT INTO mcq VALUES(4);
INSERT INTO question VALUES(DEFAULT, '(S1) MCQ Initial Action: <text>', 4);
INSERT INTO mcq_option VALUES(DEFAULT, '(S1) MCQ (IA) Approve', 1);
INSERT INTO mcq_option VALUES(DEFAULT, '(S1) MCQ (IA) Postpone', 1);

INSERT INTO pages VALUES(DEFAULT, 5, 'PLAIN', 'page: Init action subsequent (start to gather info) for scenario 1', 1);

INSERT INTO pages VALUES(DEFAULT, 6, 'CONV', 'Body text before conversation', 1);
INSERT INTO conversation_task VALUES(6,2);
INSERT INTO stakeholders VALUES(DEFAULT, 'Sherlock Holmes', 'Detective', '<description>','<conversation text>', 1, 6);
INSERT INTO stakeholders VALUES(DEFAULT, 'Bob Smith', 'Police', '<description>','<conversation text>', 1, 6);
INSERT INTO stakeholders VALUES(DEFAULT, 'John Doe', 'Chef', '<description>','<conversation text>', 1, 6);
INSERT INTO stakeholders VALUES(DEFAULT, 'John Winfrey', 'Electronic equipment installer', '<description>','<conversation text>', 1, 6);
INSERT INTO stakeholders VALUES(DEFAULT, 'Anna Pierce', 'News camera operator', '<description>','<conversation text>', 1, 6);
INSERT INTO stakeholders VALUES(DEFAULT, 'Joseph Jackson', 'Record center clerk', '<description>','<conversation text>', 1, 6);

INSERT INTO conversation VALUES(DEFAULT, 1, 'question?', 'Hi im Sherlock Holmes.');
INSERT INTO conversation VALUES(DEFAULT, 2, 'question?', 'Hi im Bob Smith.');
INSERT INTO conversation VALUES(DEFAULT, 3, 'question?', 'Hi im John Doe.');
INSERT INTO conversation VALUES(DEFAULT, 4, 'question?', 'Hi im John Winfrey.');
INSERT INTO conversation VALUES(DEFAULT, 5, 'question?', 'Hi im Anna Pierce.');
INSERT INTO conversation VALUES(DEFAULT, 6, 'question?', 'Hi im Joseph Jackson.');

INSERT INTO pages VALUES(DEFAULT, 7, 'PRMPT', 'Body text before middle reflection', 1);
INSERT INTO prompt VALUES(7, 'prompt: middle reflection', 1);

INSERT INTO pages VALUES(DEFAULT, 8, 'MCQ', 'Body text before final action multiple choice question objects', 1);
INSERT INTO mcq VALUES(8);
INSERT INTO question VALUES(DEFAULT, '(S1) MCQ Final Action: <text>', 8);
INSERT INTO mcq_option VALUES(DEFAULT, '(S1) MCQ (FA) Approve', 2);
INSERT INTO mcq_option VALUES(DEFAULT, '(S1) MCQ (FA) Reject', 2);

-- Double check page types
INSERT INTO pages VALUES(DEFAULT, 9, 'PLAIN', 'Body text of summary page', 1);
INSERT INTO pages VALUES(DEFAULT, 10, 'PLAIN', 'Body text of feedback page', 1);

INSERT INTO pages VALUES(DEFAULT, 11, 'PRMPT', 'Body text before final reflection', 1);
INSERT INTO prompt VALUES(11, 'prompt: final reflection', 1);

INSERT INTO pages VALUES(DEFAULT, 12, 'PLAIN', 'Page: results will be available in one week', 1);

-- TODO: fix sample submissions
-- ID is 2 for some reason?
INSERT INTO submissions VALUES(DEFAULT, 1, 1, '2020-10-10 10:10:00');
INSERT INTO response VALUES(DEFAULT, 1, 2, '2020-10-10 10:10:00');
INSERT INTO prompt_response VALUES(1, 1, 'John Doe''s response to initial reflection (a)');
INSERT INTO prompt_response VALUES(1, 2, 'John Doe''s response to initial reflection (b)');

INSERT INTO response VALUES(DEFAULT, 1, 4, '2020-10-11 10:10:00');
INSERT INTO prompt_response VALUES(2, 1, 'John Doe''s response to middle reflection');

INSERT INTO response VALUES(DEFAULT, 1, 6, '2020-10-12 10:10:00');
INSERT INTO prompt_response VALUES(3, 1, 'John Doe''s response to final reflection');

INSERT INTO response VALUES(DEFAULT, 1, 3, '2020-10-10 10:10:00');
--INSERT INTO conversation_choices VALUES(4, 1);


INSERT INTO submissions VALUES(DEFAULT, 2, 1, '2020-10-10 10:10:00');
INSERT INTO response VALUES(DEFAULT, 2, 2, '2020-10-11 09:10:00');
INSERT INTO prompt_response VALUES(5, 1, 'Jane Doe''s response to Initial reflection (a)');
INSERT INTO prompt_response VALUES(5, 2, 'Jane Doe''s response to Initial reflection (b)');


INSERT INTO response VALUES(DEFAULT, 2, 4, '2020-10-11 09:10:00');
INSERT INTO prompt_response VALUES(6, 1, 'Jane Doe''s response to middle reflection');

INSERT INTO response VALUES(DEFAULT, 2, 5, '2020-10-11 09:10:00');
INSERT INTO mcq_response VALUES(7, 1, 3);


-- test scenario 2
-- Fix this
INSERT INTO scenario VALUES(DEFAULT, 'Scenario 2', '2020-12-18 23:59:59', 'description: sceanrio 2', 'DRAFT', '<additional_data for scenario 2>');
INSERT INTO partof VALUES(2, 2);
-- INSERT INTO partof VALUES(1, 2); 
-- two courses have the same scenario, one student is enrolled in both

INSERT INTO pages VALUES(DEFAULT, 1 , 'PLAIN', 'page: Intro page content for scenario 2', 2);

INSERT INTO pages VALUES(DEFAULT, 2, 'PLAIN', 'Body text before task assignment', 2);

INSERT INTO pages VALUES(DEFAULT, 3, 'PRMPT', 'Body text before initial reflection', 2) RETURNING id \gset scenario_2_init_reflect_
INSERT INTO prompt VALUES(:scenario_2_init_reflect_id, 'prompt: s2 Initial reflection', 1);
-- Enter pages here
INSERT INTO pages VALUES(DEFAULT, 4, 'MCQ', 'Body text before initial action multiple choice question', 2);
INSERT INTO mcq VALUES(12);
INSERT INTO question VALUES(DEFAULT, '(S2) MCQ Initial Action: <text>', 4);
INSERT INTO mcq_option VALUES(DEFAULT, '(S2) MCQ (1) option A', 3);
INSERT INTO mcq_option VALUES(DEFAULT, '(S2) MCQ (1) option B', 3);
INSERT INTO mcq_option VALUES(DEFAULT, '(S2) MCQ (1) option C', 3);
INSERT INTO mcq_option VALUES(DEFAULT, '(S2) MCQ (1) option D', 3);

--INSERT INTO conversation_task VALUES(10,1); -- ??
-- Enter pages here?
INSERT INTO pages VALUES(DEFAULT, 7, 'PRMPT', 'Body text before middle reflection', 2) RETURNING id \gset scenario_2_mid_reflect_
INSERT INTO prompt VALUES(:scenario_2_mid_reflect_id, 'prompt: s2 middle reflection', 1);

INSERT INTO pages VALUES(DEFAULT, 11, 'PRMPT', 'Body text before final reflection', 2) RETURNING id \gset scenario_2_final_reflect_
INSERT INTO prompt VALUES(:scenario_2_final_reflect_id, 'prompt: s2 final reflection', 1);

INSERT INTO pages VALUES(DEFAULT, 12, 'PLAIN', 'Page: s2 results will be available in one week', 2);
--INSERT INTO plain_page VALUES(##, 'Page: s2 results will be available in one week');

-- TODO: fix sample submissions
INSERT INTO submissions VALUES(DEFAULT, 2, 2, '2020-10-10 10:10:00');
INSERT INTO response VALUES(DEFAULT, 3, 2, DEFAULT);
INSERT INTO prompt_response VALUES(8, 1, 'Jane''s response to scenario 2 initial reflection');

-- display all responses in submission 1 (John)
-- select * from response, submissions 
-- where submissions.id = response.submission_id	
-- and submissions.id = 1;

-- select * from response;

-- -- display all prompt responses that are in a submission
-- select * from response, submissions, prompt_response
-- where submissions.id = response.submission_id
-- and response.id = prompt_response.id
-- and submissions.id = 2;

-- select * from response, pages, conversation_task, stakeholders
-- where response.page_num = pages.id
-- and pages.order = 2
-- and conversation_task.page_id = pages.id
-- and stakeholders.scenario_id = pages.scenario_id
-- and stakeholders.conversation_task_id = conversation_task.page_id;
