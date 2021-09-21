const Question = require('../module/question');
const Level = require('../module/level');
const Topic = require('../module/topic');

try {
  const QuestionControler = {
    getOne: async (req, res) => {
      const question = await Question.findById({_id: req.params.id});
      res.send(question);
    },
    getAll: async (req, res) => {
      const question = await Question.find().populate('Topic');
      res.json(question);
    },
    create: async (req, res) => {
      try {
        const idTopic = req.params.idTopic;
        const topic = await Topic.findById({_id: idTopic});
        const question = new Question(req.body);
        topic.Questions.push(question);
        await topic.save();
        question.Topic = topic;
        await question.save();
        return res.status(201).send({question});
      } catch {
        return res
          .status(400)
          .send({msg: 'Đã xảy ra lỗi trong quá trình tạo câu hỏi'});
      }
    },
    delete: async (req, res) => {
      const question = await Question.findById({_id: req.params.id}).populate(
        'Topic'
      );
      if (!question) {
        return res.status(400).send({msg: ' Câu hỏi không tồn tại '});
      }
      const topic = await Topic.findById({_id: question.Topic.id}).populate(
        'Questions'
      );
      for (var i = 0; i < topic.Questions.length; i++) {
        if (topic.Questions[i].id === question.id) {
          topic.Questions.splice(i, 1);
        }
      }
      await question.delete();
      await topic.save();
      return res.status(200).send({question});
    },
    update: async (req, res) => {
      const {QS, idNewTopic, idOldTopic} = req.body;
      const idQS = req.params.id;
      const question = await Question.findById({_id: idQS}).populate('Topic');
      if (idNewTopic) {
        const oldTopic = await Topic.findById({_id: idOldTopic}).populate(
          'Questions'
        );
        for (var i = 0; i < oldTopic.Questions.length; i++) {
          if (oldTopic.Questions[i].id === question.id) {
            oldTopic.Questions.splice(i, 1);
          }
        }
        await oldTopic.save();
        const newTopic = await Topic.findById({_id: idNewTopic});
        newTopic.Questions.push(question);
        await newTopic.save();
        question.Topic = newTopic;
      }
      question.content = QS.content;
      question.anwsers = QS.anwsers;
      question.level = QS.level;
      await question.save();
      res.json(question);
    },
  };
  module.exports = QuestionControler;
} catch (error) {
  res.sdt(400).send(error);
}
