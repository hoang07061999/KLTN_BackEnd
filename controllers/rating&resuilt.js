const RTRS= require('../module/rating&resuilt')

try {
    const RTRSControler = {       
        // getOne: async (req, res) => {
        //     const topic = await Topic.findById({ _id: req.params.id }).populate("levels")
        //     res.send(topic)
        // },           
        getAll: async (req, res) => {
            const rtrs = await RTRS.find()
            res.json(rtrs)
        },
        // create: async (req, res) => {
        //     const topic = new Topic(req.body)
        //     if(req.file)
        //     {   
        //         topic.image = req.file.path.split('\\').splice(1).join('\\');
        //     }
        //     await topic.save()
        //     res.status(201).send({ topic})
        // },
        delete: async (req,res) =>{
            const rtrs = await RTRS.findById({_id: req.params.id})
            await rtrs.delete()
            res.send({rtrs})
        },
    }
    module.exports = RTRSControler;
} catch (error) {
    res.sdt(400).send(error)
}