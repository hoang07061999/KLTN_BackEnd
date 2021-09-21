const { findById } = require('../module/examYear')
const ExamYear = require('../module/examYear')
const Topic = require('../module/topic')
try {
    const ExamControler = {    
        getOne: async (req, res) => {
            const examYear = await ExamYear.findById({ _id: req.params.id }).populate("Tests").populate("topics").populate("Questions")
            res.send(examYear)
        },                      
        getAll: async (req, res) => {
            const examYear = await ExamYear.find().populate('Topic')
            res.json(examYear)
        },
        create: async (req, res) => {
                console.log('right')
                var examYear = new ExamYear(req.body)
                const topic = await Topic.findById({_id: req.params.id})
                topic.ExamYear.push(examYear)
                await topic.save()
                examYear.Topic = topic
                await examYear.save();
                res.send({ examYear })
        },
        delete: async (req,res) =>{
            const examYear = await ExamYear.findById({_id: req.params.id})
            const topic = await Topic.findById({_id: examYear.Topic}).populate("ExamYear")
            for(var i = 0; i< topic.ExamYear.length; i ++)
            {
                if(topic.ExamYear[i].id === examYear.id)
                {
                    topic.ExamYear.splice(i,1)
                }
            }
            await topic.save()
            await examYear.delete()
            res.send({examYear})
        },
        update: async (req, res) => {
            const { name,reTopic,replaceTopic } = req.body;
            const examYear = await ExamYear.findById({ _id: req.params.id }).populate("Topic")
            examYear.name = name ? name : examYear.name;
            if(replaceTopic)
            {
                const reTopicData = await Topic.findById({ _id: reTopic }).populate("ExamYear")
                const replaceTopicData = await Topic.findById({ _id: replaceTopic })
                for(var i = 0; i < reTopicData.ExamYear.length; i++)
                {
                    if(reTopicData.ExamYear[i].id === req.params.id)
                    {
                        reTopicData.ExamYear.splice(i,1)
                    }
                }
                replaceTopicData.ExamYear.push(examYear)
                examYear.Topic = replaceTopicData
                await reTopicData.save()
                await replaceTopicData.save()
            }
            await examYear.save();
            res.json(examYear)
        }
    }
    module.exports = ExamControler;
} catch (error) {
    res.sdt(400).send(error)
}