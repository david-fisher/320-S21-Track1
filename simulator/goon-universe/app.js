const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const db = require('./queries')
const isnumber = require('is-number')
const cors = require('cors');

const corsOptions = {

}

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const router = express.Router()

router.use(function(req, res, next) {
    console.log('API is doing something')
    next()
});


router.get('/', (req, res) => {
    res.json({info: 'This is the API'})
})


router.route('/scenarios')

    .get(function(req, res){
        studentID = req.get('studentid')
        if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid student ID")
            res.end()
        }
        else{
            db.getScenarios(studentID, function(result){
                if(result.length == 0){
                    res.status(404).json({error: `No scenarios found for studentid: ${studentID}`})
                }
                else{
                res.status(200).json(result)
                console.log("Got all scenarios")
                }
            })

        }
    })


router.route('/scenarios/intro')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        else{
            db.getIntroPage(scenarioID, function(result){
                if(result.length == 0){
                    res.status(404).json({error: `No scenario found with scenarioid: ${scenarioID}`})
                }
                else{
                    res.status(200).json(result)
                    console.log("Got scenario introduction")
                }
            })
        }
    })


router.route('/scenarios/task')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        else {
        db.getTaskPage(scenarioID, function(result){
            if(result.length == 0) {
                res.status(404).json({error: `No scenario task found with scenarioID: ${scenarioID}`})
            }
            else{
                res.status(200).json(result)
                console.log("Got scenario task")
            }
        })

        }
    })

router.route('/scenarios/starttogatherinfo')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        else {
        db.getInitActionSubsequentPage(scenarioID, function(result){
            if(result.length == 0) {
                res.status(404).json({error: `No scenario start to gather information found with scenarioID: ${scenarioID}`})
            }
            else{
                res.status(200).json(result)
                console.log("Got start to gather information")
            }
        })

        }
    })

router.route('/scenarios/initialReflection')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        else{
        db.getInitReflectPage(scenarioID, function(result){
            if(Object.entries(result).length == 0){
                res.status(404).json({error: `No initial reflection found with scenarioID: ${scenarioID}`})
            }
            else{
            res.status(200).json(result)
            console.log("Got initial relfection")
            }
        })
        }


    })

    .put(function(req, res){
        scenarioID = req.body.scenarioID
        studentID = req.body.studentID
        data = req.body.data
        let no_error = true
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else{
            timestamp = new Date()
            for(prompt_num in data){
                if(!isnumber(prompt_num)){
                    res.status(400).json({error: `Invalid prompt: ${prompt_num}`})
                    console.log("Invalid prompt number")
                    res.end()
                }
                else{
                    input = data[prompt_num]
                    db.addInitReflectResponse(studentID, input, prompt_num, scenarioID, timestamp, function(result){
                        if(result.length === 0){
                            no_error = false
                        }
                        // else{
                        //     res.status(200).send(result)
                        //     console.log("Updated initial reflection")
                        // }
                    })
                }
            }
            if(no_error){
                res.status(200).send("Success")
                console.log("Updated initial reflection")
            }
            else{
                res.status(404).json({error: `student ID, scenario ID or prompt does not exist in database`})
                console.log("Initial reflection not added")
            }
        }
        
    })

router.route('/scenarios/initialReflection/response')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        studentID = req.get('studentid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid ID")
            res.end()
        }
        else{
        db.getInitReflectResponse(studentID, scenarioID, function(result){
            if(result == null) {
                res.status(404).json({error: `No initial reflection response found with one or both of the ID's`});
            }
            else{
                res.status(200).json(result)
                console.log("Got initial relfection response")
            }
        })
        }
    })



router.route('/scenarios/initialAction')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        else{
        db.getInitActionPageQuestionsAndChoices(scenarioID, function(result){
            if(result.length == 0) {
                res.status(404).json({error: `No initial actions found with scenarioID: ${scenarioID}`})
            }
            else{
            res.status(200).json(result)
            console.log("Got initial actions")
            }
        })
        }
    })

    .put(function(req, res){
        scenarioID = req.body.scenarioID
        studentID = req.body.studentID
        data = req.body.data
        let no_error = true
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else{
            timestamp = new Date()
            for(questionID in data){
                if(!isnumber(questionID)){
                    res.status(400).json({error: `Invalid question ID: ${questionID}`})
                    console.log("Invalid Question ID")
                    res.end()
                }
                else{
                    choiceID = data[questionID]
                    if(!isnumber(choiceID)){
                        res.status(400).json({error: `Invalid choice ID: ${choiceID}`})
                        console.log("Invalid Choice ID")
                        res.end()                        
                    }
                    else{
                        db.addInitActionResponse(studentID, questionID, choiceID, scenarioID, timestamp, function(result){
                            if(result === "scenario/status ID error"){
                                no_error = false
                                // res.status(404).json({error: `student ID or scenario ID does not exist in database`})
                            }
                            else if (result === "response/question/choice ID error"){
                                no_error = false
                                // res.status(404).json({error: `response ID or question ID does not exist in database`})
                            }
                            // else{
                            //     res.status(200).send(result)
                            //     console.log("Updated inital action")
                            // }
                    })
                    }
                }
            }
            if(no_error){
                res.status(200).send("Success")
                console.log("Updated initial action")
            }
            else{
                res.status(404).json({error: `student ID, scenario ID or question ID does not exist in database`})
                console.log("Initial Action not added")
            }
        }
    })


router.route('/scenarios/initialAction/response')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        studentID = req.get('studentid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid ID")
            res.end()
        }   
        else{
        db.getInitActionResponse(studentID, scenarioID, function(result){
            if(result.length == 0) {
                res.status(404).json({error: `No initial action response found with one or both of the ID's`});
            }
            else{
                res.status(200).json(result)
                console.log("Got initial action response")
            }
        })
        }
    })

router.route('/scenarios/finalAction')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        else {
        db.getFinalActionPageQuestionsAndChoices(scenarioID, function(result){
            if(result.length == 0) {
                res.status(404).json({error: `No scenario final action page found for scenarioID: ${scenarioID}`})
            }
            else{
                res.status(200).json(result)
                console.log("Got scenario final action page")
            }
        })

        }
    })

    .put(function(req, res){
        scenarioID = req.body.scenarioID
        studentID = req.body.studentID
        data = req.body.data
        let no_error = true
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else{
            timestamp = new Date()
            for(questionID in data){
                if(!isnumber(questionID)){
                    res.status(400).json({error: `Invalid question ID: ${questionID}`})
                    console.log("Invalid Question ID")
                    res.end()
                }
                else{
                    choiceID = data[questionID]
                    if(!isnumber(choiceID)){
                        res.status(400).json({error: `Invalid choice ID: ${choiceID}`})
                        console.log("Invalid Choice ID")
                        res.end()                        
                    }
                    else{
                        db.addFinalActionResponse(studentID, questionID, choiceID, scenarioID, timestamp, function(result){
                            if(result === "scenario/status ID error"){
                                no_error = false
                                // res.status(404).json({error: `student ID or scenario ID does not exist in database`})
                            }
                            else if (result === "response/question/choice ID error"){
                                no_error = false
                                // res.status(404).json({error: `response ID or question ID does not exist in database`})
                            }
                            // else{
                            //     res.status(200).send(result)
                            //     console.log("Updated inital action")
                            // }
                    })
                    }
                }
            }
            if(no_error){
                res.status(200).send("Success")
                console.log("Updated final action")
            }
            else{
                res.status(404).json({error: `student ID, scenario ID or question ID does not exist in database`})
                console.log("Final Action not added")
            }
        }
    })


router.route('/scenarios/finalAction/response')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        studentID = req.get('studentid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid ID")
            res.end()
        }   
        else{
        db.getFinalActionResponse(studentID, scenarioID, function(result){
            if(result.length == 0) {
                res.status(404).json({error: `No final action response found with one or both of the ID's`});
            }
            else{
                res.status(200).json(result)
                console.log("Got final action response")
            }
        })
        }
    })


router.route('/scenarios/consequences')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid scenario ID")
            res.end()
        }
        else {
        db.getConsequencesPage(scenarioID, function(result){
            if(result.length == 0) {
                res.status(404).json({error: `No consequences found for scenarioID: ${scenarioID}`})
            }
            else{
                res.status(200).json(result)
                console.log("Got consequences")
            }
        })
        }
    })

router.route('/scenarios/stakeholders/history')

    .get(function(req, res){
        studentID = req.get('studentid')
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid student ID")
            res.end()
        }
        else{
        db.getStakeholderHistory(studentID, scenarioID, function(result){
            /*if(result.length == 0){
                res.status(404).json({error: `No stakeholder history found for scenarioID: ${scenarioID} and studentID: ${studentID}`})
            }
            else*/
            res.status(200).json(result)
            console.log("Got stakeholder history")
        })
        }


    })

router.route('/scenarios/stakeholders')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        else{
        db.getStakeholders(scenarioID, function(result){
            if(Object.entries(result).length == 0){
                res.status(404).json({error: `No stakeholders found for scenarioID: ${scenarioID}`})
            }
            else{
            res.status(200).json(result)
            console.log("Got all stakeholders")
            }
            })
        }
    })

    .put(function(req, res){
        scenarioID = req.body.scenarioID
        studentID = req.body.studentID
        stakeholderID = req.body.stakeholderID
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else if(!isnumber(stakeholderID)){
            res.status(400).json({error: `Invalid stakeholder ID: ${stakeholderID}`})
            console.log("Invalid Stakeholder ID")
            res.end()
        }
        else {
            timestamp = new Date()
            db.addStakeholderChoice(studentID, scenarioID, stakeholderID, timestamp, function(result){
                if(result.length === 0){
                    res.status(404).json({error: `student ID, scenario ID or stakeholder ID does not exist in database`})
                }
                else{
                    res.status(200).send(result)
                    console.log("Added stakeholder")
                }
            })
        }
    })

router.route('/scenarios/stakeholders/conversation')

    .get(function(req, res){
        stakeholderID = req.get('stakeholderid')
        if(!isnumber(stakeholderID)){
            res.status(400).json({error: `Invalid Stakeholder ID: ${stakeholderID}`})
            console.log("Invalid stakeholder ID")
            res.end()
        }
        else{
        db.getStakeholderConversation(stakeholderID, function(result){
            if(Object.entries(result).length == 0){
                res.status(404).json({error: `No conversation found for scenarioID: ${scenarioID} and stakeholderid: ${stakeholderID}`})
            }
            else{
            res.status(200).json(result)
            console.log("Got stakeholder conversation")
            }
        })
        }

    })

router.route('/scenarios/middleReflection')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        else {
        db.getMidReflectPage(scenarioID, function(result){
            if(Object.entries(result).length == 0){
                res.status(404).json({error: `No middle reflection found with scenarioID: ${scenarioID}`})
            }
            else{
                res.status(200).json(result)
                console.log("Got initial reflection")
            }
        })
        }
    })

    .put(function(req, res){
        scenarioID = req.body.scenarioID
        studentID = req.body.studentID
        data = req.body.data
        let no_error = true
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else{
            timestamp = new Date()
            for(prompt_num in data){
                if(!isnumber(prompt_num)){
                    res.status(400).json({error: `Invalid prompt: ${prompt_num}`})
                    console.log("Invalid prompt number")
                    res.end()
                }
                else{
                    input = data[prompt_num]
                    db.addMidReflectResponse(studentID, input, prompt_num, scenarioID, timestamp, function(result){
                        if(result.length === 0){
                            no_error = false
                        }
                        // else{
                        //     res.status(200).send(result)
                        //     console.log("Updated initial reflection")
                        // }
                    })
                }
            }
            if(no_error){
                res.status(200).send("Success")
                console.log("Updated middle reflection")
            }
            else{
                res.status(404).json({error: `student ID, scenario ID or prompt does not exist in database`})
                console.log("Middle reflection not added")
            }
        }
    })

router.route('/scenarios/middleReflection/response')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        studentID = req.get('studentid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid ID")
            res.end()
        }
        else{
        db.getMidReflectResponse(studentID, scenarioID, function(result){
            if(result == null) {
                res.status(404).json({error: `No middle reflection response found with one or both of the ID's`});
            }
            else{
                res.status(200).json(result)
                console.log("Got middle relfection response")
            }
        })
        }
    })

router.route('/scenarios/finalReflection')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else{
            db.getFinalReflectPage(scenarioID, function(result){
                // console.log("Final Relfection-", result)
                if(Object.entries(result).length == 0){
                    res.status(404).json({error: `No final reflection found for scenarioID: ${scenarioID}`})
                }
                else{
                res.status(200).json(result)
                console.log("Got final reflection")
                }
            })
        }

    })

    .put(function(req, res){
        scenarioID = req.body.scenarioID
        studentID = req.body.studentID
        data = req.body.data
        let no_error = true
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else{
            timestamp = new Date()
            for(prompt_num in data){
                if(!isnumber(prompt_num)){
                    res.status(400).json({error: `Invalid prompt: ${prompt_num}`})
                    console.log("Invalid prompt number")
                    res.end()
                }
                else{
                    input = data[prompt_num]
                    db.addFinalReflectResponse(studentID, input, prompt_num, scenarioID, timestamp, function(result){
                        if(result.length === 0){
                            no_error = false
                        }
                        // else{
                        //     res.status(200).send(result)
                        //     console.log("Updated initial reflection")
                        // }
                    })
                }
            }
            if(no_error){
                res.status(200).send("Success")
                console.log("Updated final reflection")
            }
            else{
                res.status(404).json({error: `student ID, scenario ID or prompt does not exist in database`})
                console.log("Final reflection not added")
            }
        }
    })


router.route('/scenarios/finalReflection/response')

        .get(function(req, res){
            scenarioID = req.get('scenarioid')
            studentID = req.get('studentid')
            if(!isnumber(scenarioID)){
                res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
                console.log("Invalid ID")
                res.end()
            }
            if(!isnumber(studentID)){
                res.status(400).json({error: `Invalid student ID: ${studentID}`})
                console.log("Invalid ID")
                res.end()
            }
            else{
            db.getFinalReflectResponse(studentID, scenarioID, function(result){
                if(result == null) {
                    res.status(404).json({error: `No middle reflection response found with one or both of the ID's`});
                }
                else{
                    res.status(200).json(result)
                    console.log("Got final relfection response")
                }
            })
            }
        })

router.route('/scenarios/conclusion')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid ID")
            res.end()
        }
        else {
        db.getConclusionPage(scenarioID, function(result){
            if(result.length == 0) {
                res.status(404).json({error: `No scenario found with scenarioid: ${scenarioID}`})
            }
            else {
                res.status(200).json(result)
                console.log("Got scenario conclusion")
            }
        })

        }
    })

    .put(function(req, res){
        scenarioID = req.body.scenarioID
        studentID = req.body.studentID
        data = req.body.data
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else{
        db.addConclusionResponse(studentID, scenarioID, data, function(result){
          if(result.length === 0){
              res.status(404).json({error: `student ID or scenario ID does not exist in database`})
          }
          else{
              res.status(200).send(result)
              console.log("Updated Conclusion response")
          }
        })}
    })

router.route('/scenarios/feedback')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        studentID = req.get('studentid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else {
            db.getFeedback(scenarioID, studentID, function(result){
                if(result.length == 0) {
                    res.status(404).json({error: `No feedback found for scenarioID: ${scenarioID} and studentid: ${studentID}`})
                }
                else {
                    res.status(200).json(result)
                    console.log("Got student feedback")
                }
            })
        }
    })


router.route('/scenarios/summary')
    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        studentID = req.get('studentid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else {
            db.getSummary(scenarioID, studentID, function(result){
                if(result.length == 0) {
                    res.status(404).json({error: `No summary found for scenarioID: ${scenarioID} and studentid: ${studentID}`})
                }
                else {
                    res.status(200).json(result)
                    console.log("Got student summary")
                }
            })
        }
    })


router.route('/scenarios/lastPage')

    .get(function(req, res){
        scenarioID = req.get('scenarioid')
        studentID = req.get('studentid')
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else {
            db.getLastPage(scenarioID, studentID, function(result){
                if(result.length == 0) {
                    res.status(404).json({error: `No Last Page found for scenarioID: ${scenarioID} and studentid: ${studentID}`})
                }
                else {
                    res.status(200).json(result)
                    console.log("Got Last Page")
                }
            })
        }
    })

    .put(function(req, res){
        scenarioID = req.body.scenarioID
        studentID = req.body.studentID
        data = req.body.data
        if(!isnumber(scenarioID)){
            res.status(400).json({error: `Invalid scenario ID: ${scenarioID}`})
            console.log("Invalid Scenario ID")
            res.end()
        }
        else if(!isnumber(studentID)){
            res.status(400).json({error: `Invalid student ID: ${studentID}`})
            console.log("Invalid Student ID")
            res.end()
        }
        else{
        db.addLastPage(studentID, scenarioID, data, function(result){
          if(result.length === 0){
              res.status(404).json({error: `student ID or scenario ID does not exist in database`})
          }
          else{
              res.status(200).send(result)
              console.log("Updated Last Page")
          }
        })}
    })

app.use('/api', router)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
