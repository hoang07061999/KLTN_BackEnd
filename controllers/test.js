const Test= require('../module/test')
const Level = require('../module/level')
const Question = require('../module/question')
const ExamYear = require('../module/examYear')

try {
    const TestControler = {     
        getOne: async (req, res) => {
            const test = await Test.findById({ _id: req.params.id }).populate("Levels").populate("Questions")
            res.send(test)
        },                  
        getAll: async (req, res) => {
            const test = await Test.find().populate("examYear")
            res.json(test)
        },
        create: async (req, res) => {
            try{
                const examYear = await ExamYear.findById({_id:req.params.id})
                var test = new Test(req.body)
                examYear.tests.push(test);
                await examYear.save();
                test.examYear = examYear;
                await test.save();
                res.status(201).send({ test })
            } catch {
                res.status(400).send({messenger: "fail"})
        }},
        addQuestion: async (req, res) => {
            const idtest = req.params.idtest;
            const test = await Test.findById({_id:idtest}).populate("examYear")
            const question = req.body
            test.questions.push(question)
            test.save();
            res.status(201).send({test})
        },
        delete: async (req,res) =>{
            const test = await Test.findById({_id: req.params.id})
            const examYear = await ExamYear.findById({_id:test.examYear}).populate("tests")
            for(var i = 0; i < examYear.tests.length; i++)
            {
                if(examYear.tests[i].id === req.params.id)
                {
                    examYear.tests.splice(i,1);
                }
            }
            await test.delete()
            await examYear.save()
            res.send({test})
        },
        update: async (req, res) => {
            const { preId } = req.params
            const { nextId } = req.body
            if(nextId){
                const preExamYear = await ExamYear.findById({_id: preId}).populate("tests")
                for (var i = 0; i <  preExamYear.tests.length; i++)
                {
                    console.log(preExamYear.tests[i].id)
                    if(preExamYear.tests[i].id === req.body.idTest)
                    {
                        preExamYear.tests.splice(i,1)
                    }
                }
                await Test.findByIdAndDelete({_id: req.body.idTest})
                await preExamYear.save()
                const nextExamYear = await ExamYear.findById({_id: nextId})
                const test = new Test(req.body.test)
                nextExamYear.tests.push(test)
                await nextExamYear.save()
                test.examYear = nextExamYear
                await test.save();
                res.json(test)
            } else {
                const test = await Test.findById({ _id: req.body.idTest }).populate("examYear")
                test.name = req.body.test.name
                test.diem = req.body.test.diem
                test.time = req.body.test.time
                test.totalQuestion = req.body.test.totalQuestion
                test.questions = req.body.test.questions
                await test.save()
                res.json(test)
            }
        }

    }
    module.exports = TestControler
} catch (error) {
    res.sdt(400).send(error)
}