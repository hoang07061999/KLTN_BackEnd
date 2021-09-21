const Member = require('../module/member');
const RTRS = require('../module/rating&resuilt');
var findID = (data, id) => {
    var resuilt = -1;
    data.forEach((data, index) => {
        if (data._idTest === id) {
            resuilt = index;
        }
    });
    return resuilt;
};
module.exports = (io) => {
    console.log('hello');
    io.on('connection', function (socket) {
        console.log('co nguoi vua ket noi ' + socket.id);
        socket.on('getMembers', () => {
            console.log('getuser');
            Member.find({}, (err, members) => {
                io.emit('getAllMembers', members);
            });

            socket.on('addResuilt', ({id}, resuilt) =>{
                console.log("success",id)
                console.log(resuilt)
                Member.findById({_id: id}, (err,member) =>{
                    if (member.resuilt.length > 0) {
                        var index = -1;
                        index = findID(member.resuilt, resuilt._idTest);
                        if (index !== -1) {
                            member.resuilt.splice(index, 1);
                            RTRS.findOne({_idTest: resuilt._idTest,maker: member.email}, (err,rtrsOld) =>{
                                if (! rtrsOld) {
                                    const rtrs = new RTRS({
                                        _idTest: resuilt._idTest,
                                        maker: member.email,
                                        isComplete: resuilt.isComplete,
                                        isCorrect: resuilt.isCorrect,
                                        point: resuilt.point,
                                        nameTest: resuilt.nameTest,
                                        star: resuilt.star,
                                        time: resuilt.time,
                                        percentComplete: resuilt.percentComplete
                                    });
                                    rtrs.maker = member.email;
                                    rtrs.save(() => console.log("Save success 1"));
                                } else {
                                    (rtrsOld._idTest = resuilt._idTest),
                                    (rtrsOld.maker = member.email),
                                    (rtrsOld.isComplete = resuilt.isComplete),
                                    (rtrsOld.isCorrect = resuilt.isCorrect),
                                    (rtrsOld.point = resuilt.point),
                                    (rtrsOld.nameTest = resuilt.nameTest),
                                    (rtrsOld.star = resuilt.star),
                                    (rtrsOld.time = resuilt.time),
                                    (rtrsOld.percentComplete = resuilt.percentComplete),
                                    (rtrsOld.createAt = Date.now());
                                    rtrsOld.save(() => console.log("save Success 2"));
                                    member.resuilt.push(rtrsOld);
                                    member.save(() =>{
                                        socket.broadcast.emit("dispatchResuilt", {member})
                                    });
                                }
                            });
                        } else {
                            const rtrs = new RTRS({
                                _idTest: resuilt._idTest,
                                isComplete: resuilt.isComplete,
                                isCorrect: resuilt.isCorrect,
                                point: resuilt.point,
                                nameTest: resuilt.nameTest,
                                star: resuilt.star,
                                time: resuilt.time,
                                percentComplete: resuilt.percentComplete
                            });
                            rtrs.maker = member.email;
                            rtrs.save(() =>{
                                console.log('Save success 4')
                            });
                            member.resuilt.push(rtrs);
                            member.save(() =>{
                                                    socket.broadcast.emit("dispatchResuilt", {member})
                            });
                        }
                    } else {
                        const rtrs = new RTRS({
                            _idTest: resuilt._idTest,
                            isComplete: resuilt.isComplete,
                            isCorrect: resuilt.isCorrect,
                            point: resuilt.point,
                            nameTest: resuilt.nameTest,
                            star: resuilt.star,
                            time: resuilt.time,
                            percentComplete: resuilt.percentComplete
                        });
                        rtrs.maker = member.email;
                        rtrs.save(() =>{
                            console.log('Save success 6')
                        });
                        member.resuilt.push(rtrs);
                        member.save(() =>{
                                                socket.broadcast.emit("dispatchResuilt", {member})
                        });
                    }
                });
            } )
        });
    });
};


