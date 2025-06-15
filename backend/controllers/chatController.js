const Chat = require('../Data/Models/Chat');

const User = require("../Data/Models/User.js");

// Create a new chat
exports.createChat = async (req, res) => {
  const { senderEmail, receiverEmail, messageText } = req.body;

  try {
    // Get user details from the database
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User(s) not found' });
    }

    // Check if a chat already exists between these users (regardless of sender/receiver order)
    const existingChat = await Chat.findOne({
      'participants.userId': { $all: [sender._id, receiver._id] }
    });

    if (existingChat) {
      return res.status(200).json({
        message: 'A chat already exists between these users. Please open the existing chat.',
        chat: existingChat
      });
    }
    
    // Create a unique chatId (you can customize the method of generating chatId)
    const chatId = `chat-${sender._id}-${receiver._id}`;

    // Create a new chat document
    const chat = new Chat({
      chatId,
      participants: [
        { userId: sender._id, role: 'sender' },
        { userId: receiver._id, role: 'receiver' },
      ],
      messages: [
        {
          senderId: sender._id,
          messageText,
          timestamp: new Date(),
        },
      ],
    });

    await chat.save();

    res.status(201).json({ message: 'Chat created successfully', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating chat' });
  }
};
// Fetch chat history based on the logged-in user's email and selected contact's email
exports.getChatHistory = async (req, res) => {
    const { userEmail, contactEmail } = req.params;  // Getting userEmail and contactEmail from the request parameters
    //console.log("userEmail: ",userEmail, "contactEmail",contactEmail)
    try {
      // Get user details from the database
      const user = await User.findOne({ email: userEmail });
      const contact = await User.findOne({ email: contactEmail });

     // console.log("user: ",user, "contact",contact)

      if (!user || !contact) {
        return res.status(404).json({ message: 'User(s) not found' });
      }

      // Find the chat between the users
      const chat = await Chat.findOne({
        'participants.userId': { $all: [user._id, contact._id] },
      }).populate('participants.userId', 'firstname lastname email'); // Populate participant info

      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      res.status(200).json({ chat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching chat history' });
    }
  };


// Send a message in an existing chat
exports.sendMessage = async (req, res) => {
  const { senderEmail, receiverEmail, messageText } = req.body;
    // console.log("senderEmail: ",senderEmail, "receiverEmail",receiverEmail)
  try {
    // Get user details from the database
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User(s) not found' });
    }

    // Find the chat between the users
    const chat = await Chat.findOne({
      'participants.userId': { $all: [sender._id, receiver._id] },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Add the new message to the chat
    chat.messages.push({
      senderId: sender._id,
      messageText,
      fileName: "",
      fieUrl: "",
      timestamp: new Date(),
    });

    await chat.save();

    res.status(200).json({ message: 'Message sent successfully', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Delete a message from the chat
exports.deleteChat = async (req, res) => {
  const { senderEmail, receiverEmail, messageId } = req.body;

  console.log("senderEmail, receiverEmail, messageId: ",senderEmail, receiverEmail, messageId)
  try {
    // Step 1: Find sender and receiver using their emails
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User(s) not found' });
    }

    // Step 2: Find the chat between the sender and receiver
    const chat = await Chat.findOne({
      'participants.userId': { $all: [sender._id, receiver._id] },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Step 3: Find the message in the chat's messages array using the messageId
    const messageIndex = chat.messages.findIndex(
      (message) => message._id.toString() === messageId
    );

    if (messageIndex === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Step 4: Remove the message from the chat
    chat.messages.splice(messageIndex, 1);  // Removes the message from the array

    // Step 5: Save the chat after removing the message
    await chat.save();

    res.status(200).json({ message: 'Message deleted successfully', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting message' });
  }
};


// Send a message in an existing chat
exports.sendAttachment = async (req, res) => {
  const { senderEmail, receiverEmail, url, filename } = req.body;
    // console.log("senderEmail: ",senderEmail, "receiverEmail",receiverEmail)
  try {
    // Get user details from the database
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User(s) not found' });
    }

    // Find the chat between the users
    const chat = await Chat.findOne({
      'participants.userId': { $all: [sender._id, receiver._id] },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Add the new message to the chat
    chat.messages.push({
      senderId: sender._id,
      messageText: "attachment",
      fileName: filename,
      fileUrl: url,
      timestamp: new Date(),
    });

    await chat.save();

    res.status(200).json({ message: 'Message sent successfully', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
};
