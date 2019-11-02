const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    const { user } = req.headers;
    const { devId } = req.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return res.status(400).json({ error: 'Dev not exists' });
    }
    console.log("req.connectedUsers",req.connectedUsers)

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedSocket = req.connectedUsers[user]
      const targetSocket = req.connectedUsers[devId]

      if(loggedSocket) {
        console.log('loggedSocket',loggedSocket)
        req.io.to(loggedSocket).emit('match', targetDev)
      }

      if(targetSocket) {
        console.log('targetSocket',targetSocket)

        req.io.to(targetSocket).emit('match', loggedDev)
        
      }
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};