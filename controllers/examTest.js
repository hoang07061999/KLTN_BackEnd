const ExamTest = require('../module/examTest');
const Topic = require('../module/topic');
const Question = require('../module/question');

var findID = (data, id) => {
  var resuilt = -1;
  data.forEach((data, index) => {
    if (data.id === id) {
      resuilt = index;
    }
  });
  return resuilt;
};


try {
  const ExamControler = {
    getOne: async (req, res) => {
      const examTest = await ExamTest.findById({_id: req.params.id})
        .populate('Tests')
        .populate('topics')
        .populate('Questions');
      res.send(examTest);
    },
    getAll: async (req, res) => {
      const examYear = await ExamTest.find()
        .populate('Topic')
        .populate('Questions');
      res.send(examYear);
    },
    create: async (req, res) => {
      console.log('right');
      var examTest = new ExamTest(req.body);
      const topic = await Topic.findById({_id: req.params.id});
      topic.ExamTest.push(examTest);
      await topic.save();
      examTest.Topic = topic;
      await examTest.save();
      res.send({examTest});
    },
    delete: async (req,res) =>{
        const examTest = await ExamTest.findById({_id: req.params.id})
        const topic = await Topic.findById({_id: examTest.Topic}).populate("ExamTest")
        for(var i = 0; i< topic.ExamTest.length; i ++)
        {
            if(topic.ExamTest[i].id === examTest.id)
            {
                topic.ExamTest.splice(i,1)
            }
        }
        await topic.save()
        await examTest.delete()
        res.send({examTest})
    },
    update: async (req, res) => {
        const {ET, idNewTopic, idOldTopic} = req.body;
        const idET = req.params.id;
        const examTest = await ExamTest.findById({_id: idET}).populate('Topic').populate('Questions');
        if (idNewTopic) {
          const oldTopic = await Topic.findById({_id: idOldTopic}).populate(
            'ExamTest'
          );
          for (var i = 0; i < oldTopic.ExamTest.length; i++) {
            if (oldTopic.ExamTest[i].id === examTest.id) {
              oldTopic.ExamTest.splice(i, 1);
            }
          }
          await oldTopic.save();
          const newTopic = await Topic.findById({_id: idNewTopic});
          newTopic.ExamTest.push(examTest);
          await newTopic.save();
          examTest.Topic = newTopic;
        }
        examTest.name = ET.name;
        examTest.diem = ET.diem;
        examTest.time = ET.time;
        examTest.totalQuestion = ET.totalQuestion;
        await examTest.save();
        res.send(examTest);
    },
    addQuestion: async (req,res) =>{
      const { idexamTest } = req.params
      const listQS = req.body
      const examTest = await ExamTest.findById({_id: idexamTest}).populate("Questions").populate("Topic")
      for(var i = 0; i < listQS.length; i++)
      {
        const question = await Question.findById({_id: listQS[i]})
        if(examTest.questions.length <= 0)
        {
          examTest.questions.push(question)
        } else {
          var index = -1
            index = findID(examTest.questions,question.id)
            if(index === -1)
            {
              examTest.questions.push(question)
            }
        }
      }
      await examTest.save()
      res.status(201).send({examTest})
    }
  };
  module.exports = ExamControler;
} catch (error) {
  res.sdt(400).send(error);
}
