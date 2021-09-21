const Topic= require('../module/topic')

try {
    const TopicControler = {       
        getOne: async (req, res) => {
            const topic = await Topic.findById({ _id: req.params.id }).populate("levels")
            res.send(topic)
        },                
        getAll: async (req, res) => {
            const topic = await Topic.find().populate({
                path: 'ExamYear',
                populate: { path: 'tests' }
              }).populate("Questions").populate({path: "ExamTest", populate: {path: 'questions'}});
            res.json(topic)
        },
        create: async (req, res) => {
            const topic = new Topic(req.body)
            if(req.file)
            {   
                topic.image = req.file.path.split('\\').splice(1).join('\\');
            }
            await topic.save()
            res.status(201).send({ topic})
        },
        delete: async (req,res) =>{
            const topic = await Topic.findById({_id: req.params.id})
            if(topic.ExamYear.length > 0)
            {
                return res.status(400).send({msg: "Thao tác không thể thực hiện ( Chủ đề có chứa Bộ đề )"})
            }
            if(topic.ExamTest.length > 0)
            {
                return res.status(400).send({msg: "Thao tác không thể thực hiện ( Chủ đề có chứa đề )"})
            }
            if(topic.Questions.length > 0)
            {
                return res.status(400).send({msg: "Thao tác không thể thực hiện ( Chủ đề có chứa câu hỏi )"})
            }
            await topic.delete()
            res.send({topic})
        },
        update: async (req, res) => {
            const { name } = req.body;
            const topic = await Topic.findById({ _id: req.params.id })
            topic.name = name ? name : topic.name;
            topic.image = req.file ? req.file.path.split('\\').splice(1).join('\\') : topic.image;
            await topic.save();
            res.json(topic)
        }
    }
    module.exports = TopicControler;
} catch (error) {
    res.sdt(400).send(error)
}