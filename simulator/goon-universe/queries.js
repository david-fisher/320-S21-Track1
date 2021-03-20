var env = require('node-env-file');
env(__dirname + '/.env');
// require("dotenv").config()
/*
 * These constants are concatenated into SQL queries below, so be careful
 * WHEN IN DOUBT, PATCH CONCATENATION OUT
 */
// constants for page numbers/order
// re-order once all functions are written

const INTROPAGE = 1
const TASKPAGE = 2
const INITIAL_REFLECTION = 3
const INIT_ACTION = 4
const INIT_ACTION_SUBSEQUENT = 5
const CONVERSATION = 6
const MIDDLE_REFLECTION = 7
const FINAL_ACTION = 8
const SUMMARY_PAGE = 9
const FEEDBACK_PAGE = 10
const FINAL_REFLECTION = 11
const CONCLUSIONPAGE = 12

// constants for page types
const TYPE_PLAIN = 'PLAIN'
const TYPE_PROMPT = 'PRMPT'
const TYPE_MCQ = 'MCQ'
const TYPE_CONV = 'CONV'

const SUCCESS = "Success!"

const Pool = require('pg').Pool

/* Example .env file
 * PGUSER=<username>
 * PGHOST="localhost"
 * PGDATABASE="ethicssimulatordb"
 * PGPASSWORD=<password>
 * PGPORT=5432
 */
const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    max: 20,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0
})

function getScenarios(studentID, callback){
    let thisQuery= 'select scenario.id, scenario.name, scenario.description, scenario.due_date from scenario, partof, enrolled where enrolled.student_id = $1 and enrolled.course_id = partof.course_id and partof.scenario_id = scenario.id '
    
    pool.query(thisQuery, [studentID], (error,results) => {
        if (error) {

            throw error
        }
        callback(results.rows)
    })  
}

function getPlainPage(scenarioID, order, callback){
    let thisQuery= 'select pages.body_text from pages where pages.order = ' + order + 'and scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })
}

function getSummaryPage(scenarioID, callback){
    getPlainPage(scenarioID, SUMMARY_PAGE, callback)
}

function getIntroPage(scenarioID, callback){
    getPlainPage(scenarioID, INTROPAGE, callback)
}

function getTaskPage(scenarioID, callback){
    getPlainPage(scenarioID, TASKPAGE, callback)
}

// May not be usable
function getConversationTaskPage(scenarioID, callback){
    let thisQuery= 'select pages.body_text from conversation_task, pages where conversation_task.page_id = pages.id and pages.scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })
}

function getConclusionPage(scenarioID, callback){
    getPlainPage(scenarioID, CONCLUSIONPAGE, callback)
}

function getAuthenticatedInstructorDashboardSummary(instructorID, callback){
    let thisQuery= 'select scenario.id, scenario.name, scenario.description, scenario.due_date from scenario, partof, instructs where instructs.instructor_id = $1 and instructs.course_id = partof.course_id and partof.scenario_id = scenario.id '
    
    pool.query(thisQuery, [instructorID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })  
}

function getStudentsSummary(scenarioID, callback){
    let thisQuery = 'select enrolled.student_id, submission.id from scenario, partof, enrolled, submissions where scenario.id = $1 and enrolled.course_id = partof.course_id and partof.scenario_id = scenario.id and submissions.scenario_id = scenario.id and submissions.user_id = enrolled.student_id'

    pool.query(thisQuery, [instructorID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    })  
}

async function getReflectResponse(studentID, scenarioID, pageOrder) {
    const client = await pool.connect();
    let testIDExistenceQuery = 'SELECT users.id, scenario.id FROM users, scenario WHERE users.id=$1 AND scenario.id=$2'
    let getReflectQuery = 'SELECT prompt_response.response, prompt_response.prompt_num FROM prompt_response, response, submissions, pages WHERE pages.order=$3 AND response.page_id=pages.id AND response.id=prompt_response.id AND response.submission_id=submissions.id AND submissions.user_id=$1 AND submissions.scenario_id=$2 AND pages.scenario_id=$2'
    try {
        await client.query("BEGIN");
        let existenceResult = await client.query(testIDExistenceQuery, [studentID, scenarioID]);
        if (existenceResult.rows.length !== 1) {
            throw new RangeError("IDs invalid");
        }
        let reflectResult = await client.query(getReflectQuery, [studentID, scenarioID, pageOrder]);
		await client.query("COMMIT");
        return reflectResult.rows;
    } catch (e) {
        await client.query("ROLLBACK");
        if (e.message === "IDs invalid") {
            return null;
        } else {
            throw e;
        }
    } finally {
        client.release();
    }
}

function getInitReflectResponse(studentID, scenarioID, callback) {
    getReflectResponse(studentID, scenarioID, INITIAL_REFLECTION).then((result) => callback(result));
}
function getMidReflectResponse(studentID, scenarioID, callback) {
    getReflectResponse(studentID, scenarioID, MIDDLE_REFLECTION).then((result) => callback(result));
}
function getFinalReflectResponse(studentID, scenarioID, callback) {
    getReflectResponse(studentID, scenarioID, FINAL_REFLECTION).then((result) => callback(result));
}

//Get the names, ids, and descriptions of each stakeholder in a scenario
async function getStakeholdersHelper(scenarioID){
    const stakeholderLimitQuery='SELECT conversation_task.conversation_limit FROM pages, conversation_task WHERE pages.scenario_id=$1 AND conversation_task.page_id=pages.id'
    const stakeholderListQuery= 'select stakeholders.name, stakeholders.id, stakeholders.designation, stakeholders.description from stakeholders where stakeholders.scenario_id =$1'
    let stakeholderLimitResult = pool.query(stakeholderLimitQuery, [scenarioID])
    let stakeholderListResult = pool.query(stakeholderListQuery, [scenarioID])
    let stakeholderList = (await stakeholderListResult).rows
    if (stakeholderList.length === 0) {
        return {}
    }
    let stakeholderLimit = await stakeholderLimitResult
    let resultObject = {
        conversation_limit: stakeholderLimit.rows[0].conversation_limit,
        stakeholders: stakeholderList
    }
    return resultObject
}

function getStakeholders(scenarioID, callback) {
    getStakeholdersHelper(scenarioID).then((res) => callback(res))
}

function getName(userID, callback){
    let thisQuery= 'select users.full_name from users where id =$1'
    pool.query(thisQuery, [userID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

function getCourseInfo(courseID, callback){
    let thisQuery= 'select webpage, name, semester from courses where id =$1'
    pool.query(thisQuery, [courseID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

function getInstructorInfo(instructorID, callback){
    let thisQuery= 'select full_name, email, webpage, course_id from instructs, users where instructs.instructor_id =$1 and users.id=$1'
    pool.query(thisQuery,[instructorID], (error,results) => {
        if (error) {
            throw error
        }
        callback(results.rows)
    }) 
}

//Maybe change to addStudent and addInstructor?
function addUser(fullName, email, callback){
    let thisQuery= 'insert into users(full_name, email) values ($1 , $2)';
    pool.query(thisQuery, [fullName, email], (error,results) => {
        if (error) {
            throw error
        }
        callback(SUCCESS)
    }) 
}

function addCourse(coursePage, courseName, semester, callback){
    let thisQuery= 'insert into courses(webpage, name, semester) values ($1, $2, $3)';
    pool.query(thisQuery, [coursePage, courseName, semester], (error,results) => {
        if (error) {
            throw error
        }
        callback(SUCCESS)
    }) 
}

async function addReflectionResponse(studentID, input, promptNum, scenarioID, timestamp, page_order) {
    const selectPageQuery = 'select id from pages where pages.scenario_id=$1 and pages.order=$2';
    const selectSubmissionsQuery = 'select id from submissions where submissions.scenario_id=$1 and submissions.user_id=$2';
    const insertResponseQuery = 'INSERT INTO response(submission_id, page_id, time) VALUES ($1, $2, $3) ON CONFLICT (submission_id, page_id) DO UPDATE SET TIME = $3 RETURNING id';
    const insertPromptResponseQuery='insert into prompt_response(id, prompt_num, response) VALUES ($1, $2, $3) ON CONFLICT (id, prompt_num) DO UPDATE SET response = $3';
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const pageSelection = await client.query(selectPageQuery, [scenarioID, page_order]);
        if (pageSelection.rows.length == 0) {
            throw new RangeError("Empty SQL selection");
        }
        let pageID = pageSelection.rows[0].id;
        const submissionSelection = await client.query(selectSubmissionsQuery, [scenarioID, studentID]);
        if (submissionSelection.rows.length == 0) {
            throw new RangeError("Empty SQL selection");
        }
        let submissionID = submissionSelection.rows[0].id;
        // RETURNING clause returns ID at the same time
        const responseCreation = await client.query(insertResponseQuery, [submissionID, pageID, timestamp]);
        let responseID = responseCreation.rows[0].id;
        await client.query(insertPromptResponseQuery, [responseID, promptNum, input]);
        await client.query("COMMIT");
        return true;
    } catch (e) {
        await client.query("ROLLBACK");
        if (e.message === "Empty SQL selection") {
            return false;
        } else {
            throw e;
        }
    } finally {
        client.release();
    }
}


function addInitReflectResponse(studentID, input, promptNum, scenarioID, timestamp, callback) {
    addReflectionResponse(studentID, input, promptNum, scenarioID, timestamp, INITIAL_REFLECTION)
        .then((succeeded) => callback(succeeded ? SUCCESS : ""));
}
function addMidReflectResponse(studentID, input, promptNum, scenarioID, timestamp, callback) {
    addReflectionResponse(studentID, input, promptNum, scenarioID, timestamp, MIDDLE_REFLECTION)
        .then((succeeded) => callback(succeeded ? SUCCESS : ""));
}
function addFinalReflectResponse(studentID, input, promptNum, scenarioID, timestamp, callback) {
    addReflectionResponse(studentID, input, promptNum, scenarioID, timestamp, FINAL_REFLECTION)
        .then((succeeded) => callback(succeeded ? SUCCESS : ""));
}


// scenarioExists(scenarioID)
// .then(function(result){
//     console.log(result);
// })
// .catch(function(err){
//     console.log(err);
// });
function scenarioExists(scenarioID){
    //returns True if scenarioID exists
    let thisQuery = 'select scenario.id from scenario where scenario.id = $1'
        return new Promise(function(resolve, reject){
            pool.query(thisQuery, [scenarioID], (error, results) => {
                if (error){
                    return reject(error)
                }
                // TODO return if results is not zero
                return resolve(results.rows.length!=0)
            })
        })

}

/*
// helper for createScenario
function addScenario(name, due_date, description, additional_data){
    let thisQuery = 'insert into scenario values($1, $2, $3, DEFAULT, $4)'
    pool.query(thisQuery, [name, due_date, description, additional_data], (error, results) => {
        if (error){
            throw error
        }
        return results.rows
    })

}
*/
async function createScenario(courseID, name, due_date, description, additional_data, callback){
    const insertScenarioQuery='insert into scenario values(DEFAULT, $1, $2, $3, DEFAULT, $4) RETURNING id';
    const insertScenarioToCoursesQuesry='insert into partof values($1, $2)';
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        const scenarioInsert= await client.query(insertScenarioQuery, [name, due_date, description, additional_data]);
        let scenarioID=scenarioInsert.rows[0].id;
        const partofInsert= await client.query(insertScenarioToCoursesQuesry, [courseID, scenarioID]);

        await client.query("COMMIT");
        callback(scenarioID);
    } catch (e) {
        console.log("ROLLBACK")
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

function setScenarioStatus(scenarioID, scenarioStatus) {
    // We assume the editor backend already checked that this is valid
    // Let PostgreSQL error propagate if invalid parameters passed
    let thisQuery = "UPDATE scenario SET scenario.status = $2 WHERE scenario.id = $1"
    pool.query(thisQuery, [scenarioID, scenarioStatus], (error, results) => {
        if (error) {
            throw error
        } else if (results.rowCount == 0) {
            throw new RangeError(`Scenario with ID ${scenarioID} does not exist`)
        }
    })
}

/*
function addScenarioToCourse(scenarioID, courseID){
    // check course exists
    // check scenario exists
    
    let thisQuery = 'insert into partof values($1, $2)'
    pool.query(thisQuery, [courseID, scenarioID], (error, results) => {
        if (error){
            throw error
        }
        return results.rows
    })
}
*/

// scenarioPageExists(1, 'PLAIN', scenarioID)
// .then(function(result){
//     console.log(result);
// })
// .catch(function(err){
//     console.log(err);
// });
async function scenarioPageExists(order, type, scenarioID){
    // returns pageID
    let thisQuery = 'select pages.id from pages, scenario where pages.scenario_id = $1 and pages.order = $2 and pages.type = $3'
    let pageID = -1;
    const client = await pool.connect();
    try{
        await client.query("BEGIN")
        let pageResult = await client.query(thisQuery, [scenarioID, order, type])
        pageID = pageResult.rows[0].id
        await client.query("COMMIT")
    } catch (e) {
        await client.query("ROLLBACK")
    } finally {
        client.release()
    }
    return pageID
    
    // return new Promise(function(resolve, reject){
    //     pool.query(thisQuery, [scenarioID, order, type], (error, results) => {
    //         if (error){
    //             return reject(error);
    //         }
    //         // return pageID from results
    //         if (results.rows.length != 0){
    //             return resolve(results.rows[0].id);
    //         }
    //         else{
    //             return resolve(-1)
    //         }
    //     })
    // })
}

async function createPage(order, type, body_text, scenarioID){
    // returns pageID if exists, else creates new
    let thisQuery = 'insert into pages values(DEFAULT, $1, $2, $3, $4)'
    const client = await pool.connect();
    let pageID = -1;
    try{
        await client.query("BEGIN");
        pageID = scenarioPageExists(order, type, scenarioID);
        if (pageID === null){
            await client.query(thisQuery, [order, type, body_text, scenarioID]);
            await client.query("COMMIT");
            pageID = scenarioPageExists(order, type, scenarioID);
        }
    } catch (e) {
        await client.query("ROLLBACK")
        throw e;
    } finally {
        client.release()
    }
    return pageID
}

async function getPageID(scenarioID, order){
    // returns pageID if exists else -1
    let pageIDQuery = "select * from pages where pages.scenario_id = $1 and pages.order = $2"
    const client = await pool.connect()
    let pageID = -1
    try{
        let pageIDresult = client.query(pageIDQuery, [scenarioID, order])
        pageID = pageIDresult.rows[0].id
    } catch (e) {
        // error handling can be improved
        pageID = -1
    } finally {
        client.release()
    }
    return pageID
}

// TODO: client BEGIN/COMMIT/ROLLBACK does not have intended effect
// Helper functions allocate their own clients
// The helpers may need to take an allocated client as a parameter
async function addIntroPage(scenarioID, body_text, callback){
    let pageID = await addPlainPage(scenarioID, body_text, INTROPAGE)
    callback(SUCCESS)
    return pageID
}

async function addTaskPage(scenarioID, body_text, callback){
    let pageID = await addPlainPage(scenarioID, body_text, TASKPAGE)
    callback(SUCCESS)
    return pageID
}

async function addSummaryPage(scenarioID, body_text, callback){
    let pageID = await addPlainPage(scenarioID, body_text, SUMMARY_PAGE)
    callback(SUCCESS)
    return pageID
}
async function addConclusionPage(scenarioID, body_text, callback){
    let pageID = await addPlainPage(scenarioID, body_text, CONCLUSIONPAGE)
    callback(SUCCESS)
    return pageID
}

async function addPlainPage(scenarioID, body_text, order){
    const client = await pool.connect();
    let pageID = -1
    try{
        await client.query("BEGIN");
        if (scenarioExists(scenarioID)){
            pageID = createPage(order, TYPE_PLAIN, body_text, scenarioID)
            await client.query("COMMIT");
        }
        else{
            throw error
        }
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();

    }
    return pageID
}


async function addInitReflectPage(scenarioID, body_text, prompts, callback){
    addReflectPage(scenarioID, body_text, prompts, INITIAL_REFLECTION).then((result) => callback(result));
}

async function addMidReflectPage(scenarioID, body_text, prompts, callback){
    addReflectPage(scenarioID, body_text, prompts, MIDDLE_REFLECTION).then((result) => callback(result));
}

async function addFinalReflectPage(scenarioID, body_text, prompts, callback){
    addReflectPage(scenarioID, body_text, prompts, FINAL_REFLECTION).then((result) => callback(result));
}

async function addReflectPage(scenarioID, body_text, prompts, ORDER){
    let thisQuery = 'insert into prompt values($1, $2, DEFAULT)';
    let pageID = -1
    const client = await pool.connect();
    try{
        await client.query("BEGIN");
        if (scenarioExists(scenarioID)){
            pageID = createPage(ORDER, TYPE_PROMPT, body_text, scenarioID)
            for (let p of prompts){
                await client.query(thisQuery, [pageID, p]);
            }
            await client.query("COMMIT");
        }
        else{
            throw error;
        }
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally{
        client.release();
    }
    callback(SUCCESS);
    return pageID
}


async function addConvTaskPage(scenarioID, body_text, convLimit, callback){
    // check scenario exists
    // upsert final reflect page
    let thisQuery = 'insert into conversation_task values($1, $2)'
    let pageID = -1
    const client = await pool.connect()
    try {
        client.query("BEGIN")
        if (scenarioExists(scenarioID)){

            // create page object (checks for conflicts)
            pageID = createPage(CONVERSATION, TYPE_CONV, body_text, scenarioID)
            //TODO: upsert new limit count?
            client.query(thisQuery, [pageID, convLimit])

            client.query("COMMIT")
        } else {
            // TODO return InvalidScenarioError
            throw error;
        }
    } catch (e) {
        client.query("ROLLBACK")
        throw e
    } finally {
        client.release()
    }
    return pageID
}

// function addConclusionPage(scenarioID, text, callback){
//     //check scenario exists
//     // upsert intro page
//     if (scenarioExists(scenarioID)){
//         // create page object - plain-page when no prompt linked
//         let pageID = createPage(CONCLUSIONPAGE, TYPE_PLAIN, text, scenarioID)
//         callback(SUCCESS)
//     }
//     else{
//         // TODO return InvalidScenarioError
//         throw RangeError(`ScenarioID ${scenarioID} does not exist`)
//     }
// }


async function addStakeholder(scenarioID, name, designation, description, callback){
    // check scenario exists
    // check conversation task page exists (create if does not exist?)
    // insert stakeholder
    let thisQuery = 'insert into stakeholders values(DEFAULT, $1, $2, $3, "", $4, $5) returning id;'
    const client = await pool.connect()
    try {
        client.query("BEGIN")
        if (scenarioExists(scenarioID)){
            // create page object (checks for c)
            let conv_task_pageID = getPageID(scenarioID, CONVERSATION)
            if (conv_task_pageID === -1) throw RangeError(`conversation task page does not exist for scenarioID ${scenarioID}`);
            //create conversation_task object
            client.query(thisQuery, [name, designation, description, scenarioID, conv_task_pageID])       
            client.query("COMMIT")
        }
        else{
            throw RangeError(`scenarioID ${scenarioID} does not exist`);
        }
    } catch (e) {
        client.query("ROLLBACK")
        throw e
    } finally {
        client.release()
    }
    callback(SUCCESS)
}

// helper function for addStakeholder
async function addStakeholderConversations(stakeholderID, conv_ques_text_array){
    // conv_ques_text_array = [[question1, conversation1], [question2, conversation2], ...]
    // TODO check stakeholder exists
    let thisQuery = 'insert into conversation values(DEFAULT, $1, $2, $3)'
    const client = await pool.connect();
    try{
        client.query("BEGIN")
        // insert conversations from array
        for(let conv of conv_ques_text_array){    
            await client.query(thisQuery, [stakeholderID, conv[0], conv[1]])
        }
        client.query("COMMIT")
    } catch (e) {
        client.query("ROLLBACK")
        throw e
    } finally {
        client.release()
    }
    callback(SUCCESS)
    
}

function addInitActionPage(scenarioID, body_text, QA_array, callback){
    try {
        addActionPage(sceanrioID, INIT_ACTION, body_text, QA_array)
        addMCQ(scenarioID, INIT_ACTION, QA_array)
    } catch (e) {
        console.log("Failed to add InitActionPage")
        throw (e)
    }
    callback(SUCCESS)
}

function addFinalActionPage(scenarioID, body_text, QA_array, callback){
    try {
        addActionPage(sceanrioID, FINAL_ACTION, body_text, QA_array)
        addMCQ(scenarioID, FINAL_ACTION, QA_array)
    } catch (e) {
        console.log("Failed to add FinalActionPage")
        throw (e)
    }
    callback(SUCCESS)

}

function addActionPage(scenarioID, order, body_text, QA_array){
    try {
        if (scenarioExists(scenarioID)){
            let pageID = createPage(order, TYPE_MCQ, body_text, scenarioID)
            addMCQ(scenarioID, FINAL_ACTION, QA_array)
        }
        else{
            throw RangeError(`ScenarioID ${scenarioID} does not exist`);
        }
    } catch (e) {
        console.log("Failed to add final action page")
    }
    return
}

// function addMCQ(scenarioID, )
async function addMCQ(scenarioID, order, QA_array){
    // QA_array = [[Q1, [op1, op2, op3]], [Q2, [op1, op2, op3]]]
    let pageID = getPageID(scenarioID, order)
    try {
        for (let QA of QA_array){
            let Q_ID = addMCQQuestion(QA[0], pageID)
            addMCQOptions(QA[1], Q_ID)
        }
    } catch (e){
        console.log("failed to add MCQs")
        throw e
    }
    return
}

// may be used as a helper
async function addMCQQuestion(question, mcq_id){
    // TODO check for invalid parameters
    let thisQuery = 'insert into question values(DEFAULT, $1, $2) RETURNING id'
    let questionID = -1
    const client = pool.connect()
    try{
        await client.query("BEGIN")
        let query_result = pool.query(thisQuery, [question, mcq_id])
        questionID = query_result.rows[0].id
        if (questionID === -1) throw RangeError("failed to add question")
        await client.query("COMMIT")
    } catch (e) {
        await client.query("ROLLBACK")
    } finally {
        await client.release()
    }
    return questionID
}

// may be used as a helper
async function addMCQOptions(option_array, question_id){
    // TODO check for invalid parameters
    let thisQuery = 'insert into mcq_option values(DEFAULT, $1, $2)'
    const client = pool.connect()
    try {
        (await client).query("BEGIN")
        for (let option of option_array){
            await client.query(thisQuery, [option, question_id])
        }
        (await client).query("COMMIT")
    } catch (e){
        (await client).query("ROLLBACK")
        throw e
    } finally {
        await client.release()
    }
    return SUCCESS
}

function getStakeholderDescriptions(scenarioID){
    // TODO check for invalid parameters
    if (scenarioExists()){
        let thisQuery = 'select stakeholders.id, stakeholders.description from stakeholders where stakeholders.scenario_id=$1'
        pool.query(thisQuery, [scenarioID], (error, results) => {
            if (error){
                throw error;
            }
            callback(results.rows)
        })
    }
}

// Replace all these with a single helper taking an order parameter?
function getInitReflectPage(scenarioID, callback){
    let thisQuery= 'select pages.body_text, prompt.prompt, prompt.prompt_num from pages, prompt where pages.id = prompt.page_id and pages.order = '+ INITIAL_REFLECTION +' and scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        let response = {}
        if (results.rows.length !== 0) {
            response.prompts = results.rows.map(row => ({
                text: row.prompt,
                id: row.prompt_num
            }))
            response.body_text = results.rows[0].body_text
        }
        callback(response)
    })  
}

function getMidReflectPage(scenarioID, callback){
    let thisQuery= 'select pages.body_text, prompt.prompt, prompt.prompt_num from pages, prompt where pages.id = prompt.page_id and pages.order = '+ MIDDLE_REFLECTION +' and scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        let response = {}
        if (results.rows.length !== 0) {
            response.prompts = results.rows.map(row => ({
                text: row.prompt,
                id: row.prompt_num
            }))
            response.body_text = results.rows[0].body_text
        }
        callback(response)
    })  
}

function getFinalReflectPage(scenarioID, callback){
    let thisQuery= 'select pages.body_text, prompt.prompt, prompt.prompt_num from pages, prompt where pages.id = prompt.page_id and pages.order ='+ FINAL_REFLECTION +'and scenario_id = $1'
    pool.query(thisQuery, [scenarioID], (error,results) => {
        if (error) {
            throw error
        }
        let response = {}
        if (results.rows.length !== 0) {
            response.prompts = results.rows.map(row => ({
                text: row.prompt,
                id: row.prompt_num
            }))
            response.body_text = results.rows[0].body_text
        }
        callback(response)
    })  
}




//Returns question IDs as well for getChoices functions

function getActionPageQuestionsAndChoices(scenarioID, pageOrder, callback) {
    let thisQuery='SELECT question.id AS question_id, question.question, mcq_option.id AS option_id, mcq_option.option FROM pages, mcq, question, mcq_option WHERE pages.scenario_id = $1 AND pages.order = $2 AND mcq.page_id = pages.id AND question.mcq_id = mcq.page_id AND mcq_option.question_id = question.id ORDER BY question_id'
    pool.query(thisQuery, [scenarioID, pageOrder], (error,results) => {
        if (error) {
            throw error
        }
        let resultObject = []
        if (results.rows.length !== 0) {
            /*
             * Populate the first item, then use difference in loop
             * Group rows with the same question together
             * Delta checking below relies on ORDER BY clause above
             */
            let questionObject = {
                question_id: results.rows[0].question_id,
                question: results.rows[0].question,
                option_id: [results.rows[0].option_id],
                option: [results.rows[0].option]
            }
            for (i = 1; i < results.rows.length; i++) {
                let question_id_current = questionObject.question_id
                let question_id_new = results.rows[i].question_id
                /*
                 * If question is new, create new question object
                 * Otherwise, append MCQ option to existing question
                 */
                if (question_id_current !== question_id_new) {
                    resultObject.push(questionObject)
                    // Create new object to avoid shallow copy issues
                    questionObject = {
                        question_id: results.rows[i].question_id,
                        question: results.rows[i].question,
                        option_id: [results.rows[i].option_id],
                        option: [results.rows[i].option]
                    }
                } else {
                    questionObject.option_id.push(results.rows[i].option_id)
                    questionObject.option.push(results.rows[i].option)
                }
            }
            // Push the final question+MCQ choices into result list
            if (Object.entries(questionObject).length !== 0) {
                resultObject.push(questionObject)
            }
        }
        callback(resultObject)
    })
}
function getInitActionPageQuestionsAndChoices(scenarioID,callback){
    getActionPageQuestionsAndChoices(scenarioID, INIT_ACTION, callback);
}

function getFinalActionPageQuestionsAndChoices(scenarioID,callback){
    getActionPageQuestionsAndChoices(scenarioID, FINAL_ACTION, callback);
}

async function addMCQResponse(studentID, questionID, choiceID, scenarioID, timestamp, page_order){
    const selectPageQuery = 'select id from pages where pages.scenario_id=$1 and pages.order=$2';
    const selectSubmissionsQuery = 'select id from submissions where submissions.scenario_id=$1 and submissions.user_id=$2';
    const insertResponseQuery = 'INSERT INTO response(submission_id, page_id, time) VALUES ($1, $2, $3) ON CONFLICT (submission_id, page_id) DO UPDATE SET TIME = $3 returning id';
    const IDExistenceQuery = 'SELECT response.id, question.id, mcq_option.id FROM response, question, mcq_option WHERE response.id=$1 AND question.id=$2 AND mcq_option.id=$3'
    const insertMCQResponseQuery='INSERT INTO mcq_response(id, question_id, choice_id) VALUES($1, $2, $3) ON CONFLICT (id, question_id) DO UPDATE SET choice_id=$3;';
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const submissionSelection = await client.query(selectSubmissionsQuery, [scenarioID, studentID]);
        if (submissionSelection.rows.length === 0) {
            await client.query("ROLLBACK");
            return "scenario/status ID error";
        }
        let submissionID = submissionSelection.rows[0].id;
        const pageSelection = await client.query(selectPageQuery, [scenarioID, page_order]);
        let pageID = pageSelection.rows[0].id;
        // RETURNING clause returns ID at the same time
        const responseCreation = await client.query(insertResponseQuery, [submissionID, pageID, timestamp]);
        let responseID = responseCreation.rows[0].id;
        let existenceQueryResult = await client.query(IDExistenceQuery, [responseID, questionID, choiceID]);
        if (existenceQueryResult.rows.length === 0) {
            await client.query("ROLLBACK")
            return "response/question/choice ID error"
        }
        await client.query(insertMCQResponseQuery, [responseID, questionID, choiceID]);
        await client.query("COMMIT");
        return SUCCESS;
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

function addInitActionResponse(studentID, questionID, choiceID, scenarioID, timestamp, callback){
    addMCQResponse(studentID, questionID, choiceID, scenarioID, timestamp, INIT_ACTION).then((status_string) => callback(status_string));
}
function addFinalActionResponse(studentID, questionID, choiceID, scenarioID, timestamp, callback){
    addMCQResponse(studentID, questionID, choiceID, scenarioID, timestamp, FINAL_ACTION).then((status_string) => callback(status_string));
}

// helper for version control
function getScenarioCSV(scenarioID){
    // returns CSV string for a scenario

}

// helper for version control
function loadScenarioCSV(scenario_csv_string){
    // creates new scenario using scenario_csv_string
    
}

// Was submissionID and questionID
async function getMCQResponse(pageOrder,studentID, scenarioID){
    const getSubmissionIDQuery='SELECT submissions.id FROM users, scenario, submissions WHERE submissions.user_id=users.id AND submissions.scenario_id=scenario.id AND users.id=$1 AND scenario.id=$2'
    const mcqResponseQuery='select mcq_response.* from response, mcq_response, pages where pages.order=$1 AND response.page_id=pages.id AND response.submission_id=$2 AND response.id=mcq_response.id'
    const client = await pool.connect();
    try {
        await client.query("BEGIN")
        const submissionIDResult = await client.query(getSubmissionIDQuery, [studentID, scenarioID]);
        const submissionID = submissionIDResult.rows[0].id
        const queryReturn = await client.query(mcqResponseQuery, [pageOrder, submissionID]);
        await client.query("COMMIT")
        return queryReturn.rows;
    } catch (e) {
        await client.query("ROLLBACK")
        throw e;
    } finally {
        client.release();
    }
}
function getInitActionResponse(studentID, scenarioID, callback){
    getMCQResponse(INIT_ACTION, studentID, scenarioID).then((result) => callback(result));
}

function getFinalActionResponse(studentID, scenarioID, callback){
    getMCQResponse(FINAL_ACTION, studentID, scenarioID).then((result) => callback(result));
}

async function addStakeholderChoiceHelper(studentID, scenarioID, stakeholderID, timestamp) {
	const selectPageQuery = 'select id from pages where pages.scenario_id=$1 and pages.order=$2';
	const selectSubmissionsQuery = 'select id from submissions where submissions.scenario_id=$1 and submissions.user_id=$2';
    const insertResponseQuery = 'INSERT INTO response(submission_id, page_id, time) VALUES ($1, $2, $3) ON CONFLICT (submission_id, page_id) DO UPDATE SET TIME = $3 RETURNING id';
    //const getConvIdQuery = 'select id from conversation where stakeholder_id=$1';
    const checkStakeholderQuery = 'SELECT * FROM stakeholders WHERE stakeholders.id=$1'
    const checkStakeholderChoiceQuery = 'SELECT * FROM conversation_choices WHERE id=$1 AND stakeholder_id=$2'
    const insertStakeholderChoiceQuery='insert into conversation_choices(id, stakeholder_id) VALUES ($1, $2)';

	const client = await pool.connect();
	try {
		await client.query("BEGIN");
        const submissionSelection = await client.query(selectSubmissionsQuery, [scenarioID, studentID]);
        if (submissionSelection.rows.length === 0) {
            return "";
        }
        const pageSelection = await client.query(selectPageQuery, [scenarioID, CONVERSATION]);
        let pageID = pageSelection.rows[0].id;
        let submissionID = submissionSelection.rows[0].id;
        //const convIdSelection = await client.query(getConvIdQuery, [stakeholderID]);
		//let convID = convIdSelection.rows[0].id;
		// RETURNING clause returns ID at the same time
		const responseCreation = await client.query(insertResponseQuery, [submissionID, pageID, timestamp]);
        let responseID = responseCreation.rows[0].id;
        
        const stakeholderExistsCheck = await client.query(checkStakeholderQuery, [stakeholderID]);
        if (stakeholderExistsCheck.rows.length === 0) {
            await client.query("ROLLBACK")
            return ""
        }
        const stakeholderChoiceExistsCheck = await client.query(checkStakeholderChoiceQuery, [responseID, stakeholderID]);
        if (stakeholderChoiceExistsCheck.rows.length === 0) {
            await client.query(insertStakeholderChoiceQuery, [responseID, stakeholderID]);
        }
        await client.query("COMMIT");
        return SUCCESS
	} catch (e) {
		await client.query("ROLLBACK");
		throw e;
	} finally {
		client.release();
	}
}

function addStakeholderChoice(studentID, scenarioID, stakeholderID, timestamp, callback) {
    addStakeholderChoiceHelper(studentID, scenarioID, stakeholderID, timestamp).then((res_str) => callback(res_str))
}

async function getStakeholderHistoryHelper(studentID, scenarioID) {
	const selectPageQuery = 'select id from pages where pages.scenario_id=$1 and pages.order=$2';
	const selectSubmissionsQuery = 'select id from submissions where submissions.scenario_id=$1 and submissions.user_id=$2';
    const selectResponseQuery = 'select id from response where submission_id=$1 and page_id=$2';
    const getConvsFromResponse = 'select stakeholder_id from conversation_choices where id=$1'
	const client = await pool.connect();
	try {
		const pageSelection = await client.query(selectPageQuery, [scenarioID, CONVERSATION]);
		let pageID = pageSelection.rows[0].id;
		const submissionSelection = await client.query(selectSubmissionsQuery, [scenarioID, studentID]);
        let submissionID = submissionSelection.rows[0].id;
		const responseSelection = await client.query(selectResponseQuery, [submissionID, pageID]);
        let responseID = responseSelection.rows[0].id;
        const convIdSelection = await client.query(getConvsFromResponse, [responseID]);
		let convIDs = convIdSelection.rows;
        // RETURNING clause returns ID at the same time
        //convIDs.forEach(el => el= convIdToStakeholderId(el.conversation_id))
        return convIDs;
	} catch (e) {
		throw e;
	} finally {
		client.release();
	}
}

// Function is not helpful anymore
async function convIdsToStakeholderIds(convIds){
    const getStakeholderID = 'select stakeholder_id from conversation where id=$1'
    var output=[];
	const client = await pool.connect();
	try {
        for(let i=0;i<convIds.length;i++){
            let convId=convIds[i].conversation_id
            const thisStakeholderID = await client.query(getStakeholderID, [convId]);
            let stakeholderID = thisStakeholderID.rows[0].stakeholder_id;
            output.push(stakeholderID);
        }
        //console.log(stakeholderID)
        return output
	} catch (e) {
		throw e;
	} finally {
		client.release();
	}
}

function getStakeholderHistory(studentID, scenarioID, callback){
    getStakeholderHistoryHelper(studentID, scenarioID)
            .then((result) => callback(result))
}

async function getScenarioIssueCoverageMatrix(scenarioID, callback){
    let matrixquery = `
    select score.stakeholder_id, score.issue_id, score.value
    from stakeholders
    left join score on score.stakeholder_id = stakeholders.id
    where stakeholders.scenario_id = $1
    `
    const client = await pool.connect()
    try{
        let matrix = await client.query(matrixquery, [scenarioID])
        callback(matrix.rows)

    } catch (e) {

    } finally {
        client.release()
    }
}

async function getScenarioSubmissions(courseID, scenarioID){
    let submissions_query = 
    `
    select * from enrolled
    left join submissions on enrolled.student_id = submissions.user_id
    where enrolled.course_id = $1
    and submissoins.scenario_id = $2
    `

    const client = await pool.connect()
    try{
        await client.query(submissions_query, [courseID, scenarioID])

    } catch (e) {
        console.log(`failed to get submissions for [courseID, scenarioID] ${[courseID, scenarioID]}`)

    } finally {
        client.release()
    }
}

function getStakeholderConversation(stakeholderID, callback){
    let thisQuery = 'select conversation.question, conversation.conversation_text from conversation where conversation.stakeholder_id=$1'
    pool.query(thisQuery, [stakeholderID], (error, results) => {
        if (error){
            throw error
        }
        return callback(results.rows)
    })
}

function cb(results){
    console.log(results)
    pool.end()
}

//addInitReflectResponse(1, 'John Doe\'s first scenario initial response updated', 1, '2020-10-28 11:12:13', cb)
//addFinalReflectResponse(1, 'John Doe\'s second scenario final response', 2, '2020-10-28 11:00:00', cb)
//addFinalReflectResponse(1, 'John Doe\'s second scenario final response updated', 2, '2020-10-29 10:12:13', cb)




//getInstructorInfo(4).then(x => console.log(x[0]));
//addCourse('New Course','CS305','F2020').then(x => console.log(x));
//pool.end()

module.exports = {
    getScenarios,
    getIntroPage,
    getConclusionPage,
    getTaskPage,
    getAuthenticatedInstructorDashboardSummary,
    getStudentsSummary,
    getInitReflectResponse,
    getMidReflectResponse,
    getFinalReflectResponse,
    getStakeholders,
    getName,
    getCourseInfo,
    getInstructorInfo,
    addUser,
    addCourse,
    setScenarioStatus,
    addInitReflectResponse,
    addMidReflectResponse,
    addFinalReflectResponse,
    addIntroPage,
    addInitReflectPage,
    addMidReflectPage,
    addFinalReflectPage,
    getInitReflectPage,
    getMidReflectPage,
    getFinalReflectPage,
    addStakeholder,
    addStakeholderConversations,
    addInitActionPage,
    addFinalActionPage,
    addConclusionPage,
    getInitActionPageQuestionsAndChoices,
    getFinalActionPageQuestionsAndChoices,
    addMCQResponse,
    addInitActionResponse,
    addFinalActionResponse,
    createScenario,
    getMCQResponse,
    getInitActionResponse,
    getFinalActionResponse,
    addStakeholderChoice,
    getStakeholderHistoryHelper,
    getStakeholderHistory,
    getScenarioIssueCoverageMatrix,
    getScenarioSubmissions,
    getStakeholderConversation
}
