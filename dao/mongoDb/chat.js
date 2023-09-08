const { messageModel } = require('./model/messages')

class ChatManager {
  getAllMessages = async () => {
    try {
      const allMessages = await messageModel.find()
      return allMessages;
    } catch (error) {
      console.log(`Error getting all messages: ${error.message}`)
    }
  }
  addMessages = async (data) => {
    try {
      const message = await messageModel.create(data)
      return message
    } catch (error) {
      console.log(`Error adding message: ${error.message}`)
    }
  }
}
module.exports = new ChatManager