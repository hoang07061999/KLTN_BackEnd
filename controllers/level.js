const Topic = require('../module/topic')
const Level = require('../module/level')

try {
    const LevelControler = {    
        getOne: async (req, res) => {
            const level = await Level.findById({ _id: req.params.id }).populate("Tests").populate("topics").populate("Questions")
            res.send(level)
        },                      
        getAll: async (req, res) => {
            const level = await Level.find()
            res.json(level)
        },
        create: async (req, res) => {
            try{
                            // const idTopic = req.params.idTopic;
            // const topic = await Topic.findById({_id:idTopic})
            const level = new Level(req.body)
            // level.topics = topic;        //cho biet level nay thuoc topic nao
            await level.save();
            // topic.levels.push(level);
            // await topic.save();
            res.status(201).send({ level })
            } catch {
                res.status(400).send({ msg: " Đã xảy ra lỗi trong quá trình tạo mới " })
            }
        },
        delete: async (req,res) =>{
            const level = await Level.findByIdAndDelete({_id: req.params.id})
            res.send({level})
        },
        update: async (req, res) => {
            const { name,easily,normal,hard,creater } = req.body;
            const level = await Level.findById({ _id: req.params.id })
            level.name = name;
            level.easily = easily ? easily : level.easily
            level.normal = normal ? normal : level.normal
            level.hard = hard ? hard : level.hard
            level.creater = creater ? creater : level.creater
            await level.save();
            res.json(level)
        }
    }
    module.exports = LevelControler;
} catch (error) {
    res.sdt(400).send(error)
}