'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// WebSocket server URL
const SOCKET_URL = "ws://localhost:5000"; //  WebSocket server URL

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return timestamp;
  }


  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date).replace(',', '');
};

const TimestampComponent = ({ timestamp }) => {
  const formattedTimestamp = formatTimestamp(timestamp);

  return <span className="text-xs text-gray-600">{formattedTimestamp}</span>;
};

const Home = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    country: "Pakistan",
    profilePicture: "",
    username: "",
  });


  // Fetch contacts from the backend (for the logged-in user)
  useEffect(() => {
    const fetchContacts = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        return; // handle unauthenticated state if needed
      }

      console.log("userEmail",userEmail)
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userEmail}/contacts`);
        const data = await response.json();
        console.log("Contacts Data : ",data)
        setContacts(data.contacts); // Display contacts in the left column
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  // Establish WebSocket connection when the component mounts
  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);
    setSocket(ws);

    // Handle incoming messages
    ws.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      console.log("Received message:", incomingMessage);

      // Update the chat history for the selected contact
      if (selectedContact && selectedContact.email === incomingMessage.sender) {
        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   { sender: incomingMessage.sender, text: incomingMessage.text, time: new Date().toLocaleTimeString() },
        // ]);
         setMessages((prevMessages) => {
          const newMessages = [...prevMessages,{ sender: selectedContact.email, text: incomingMessage.text, time: new Date().toLocaleTimeString() }];
          console.log('Updated socket messages immediately: ', newMessages);  // Log to check if the state is updated instantly
          return [...newMessages];
        });
      }
     
    };

    // Cleanup WebSocket connection when component unmounts
    return () => {
      if (ws) ws.close();
    };
  }, [selectedContact]);

  // Fetch and set messages for the selected contact
  useEffect(() => {
    if (!selectedContact) return;

    const fetchMessages = async () => {
      const userEmail = localStorage.getItem('userEmail');
      const contactEmail = selectedContact.email;  // Get the selected contact's email
      try {
        const response = await fetch(`http://localhost:5000/api/chat/chats/${userEmail}/${contactEmail}`);
        const data = await response.json();
        console.log("chat history: ", data);
        setMessages(data.chat.messages); // Display the fetched messages
        console.log("THE MSG SET AFTER SELECTING CONTACT: ", messages)
      } catch (error) {
        console.error('Error fetching messages:', error);
      }

      const email = selectedContact?.email;
      
        try {
          const response = await fetch(`http://localhost:5000/api/users/profile/${email}`);
          if (!response.ok) throw new Error("Failed to fetch profile data");
          const data = await response.json();
        //  console.log("data", data);
          setProfile({
            firstName: data.firstname || "",
            lastName: data.lastname || "",
            email: data.email || "",
            dob: data.dob || "",
            country: data.country || "",
            profilePicture: data.profilePictureUrl || "https://via.placeholder.com/150",
            username: data.username || "",
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    fetchMessages();
  }, [selectedContact]);


   
   useEffect(() => {
     
      // const email = selectedContact?.email;
      // const fetchProfile = async () => {
      //   try {
      //     const response = await fetch(`http://localhost:5000/api/users/profile/${email}`);
      //     if (!response.ok) throw new Error("Failed to fetch profile data");
      //     const data = await response.json();
      //   //  console.log("data", data);
      //     setProfile({
      //       firstName: data.firstname || "",
      //       lastName: data.lastname || "",
      //       email: data.email || "",
      //       dob: data.dob || "",
      //       country: data.country || "",
      //       profilePicture: data.profilePictureUrl || "https://via.placeholder.com/150",
      //       username: data.username || "",
      //     });
      //   } catch (err) {
      //     setError(err instanceof Error ? err.message : "An unknown error occurred");
      //   } finally {
      //     setLoading(false);
      //   }
      // };
  
     // fetchProfile();
    }, []);
  

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = () => {
    console.log("inside handleSendMessage ")
    const userEmail = localStorage.getItem('userEmail');

    if (message.trim() && socket && selectedContact) {
        // Update local message history
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, { sender: 'You', text: message, time: new Date().toLocaleTimeString() }];
          console.log('Updated messages immediately: ', newMessages);  // Log to check if the state is updated instantly
          return [...newMessages];
        });
      
      const newMessage = { sender: userEmail, text: message, contactEmail: selectedContact.email };

     // console.log("newMessage in socket: ", newMessage)
      // Send message through WebSocket to the server
      socket.send(JSON.stringify(newMessage));

      
      //  save message to database here as well
     // console.log("send-message api: ", message)
      fetch('http://localhost:5000/api/chat/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail: userEmail, receiverEmail: selectedContact.email , messageText: message }),
      });

      // Clear input
      setMessage('');
    }
  };

  const handleDeleteMessage = async (messageId, index) => {
    const userEmail = localStorage.getItem('userEmail');
    const senderEmail = selectedContact.email;
    const receiverEmail = userEmail;
  
    try {
      if (messageId) {
        // Call the delete message API if messageId is provided
        const response = await fetch('http://localhost:5000/api/chat/delete-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderEmail,
            receiverEmail,
            messageId,
          }),
        });
  
        const data = await response.json();
        console.log('Message deleted:', data);
  
        if (response.ok) {
          // Update the messages array to immediately reflect the deletion in the frontend
          setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
        } else {
          alert('Error deleting message.');
        }
      } else if (index !== undefined) {
        // If messageId is undefined, delete the message by its index in the frontend
        console.log("deleting msg on index: ", index)
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages.splice(index, 1);  // Remove the message at the specified index
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('An error occurred while deleting the message.');
    }
  };

  const sendAttachmentToBackend = async (url, filename) => {
    const userEmail = localStorage.getItem('userEmail');
    const receiverEmail = selectedContact.email;
  
    try {
      const response = await fetch('http://localhost:5000/api/chat/send-attachment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail: userEmail,
          receiverEmail: receiverEmail,
          url: url,      // Firebase URL of the uploaded file
          filename: filename,  // The filename of the uploaded file
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Attachment uploaded and saved to backend:', data);
      } else {
        console.error('Failed to save attachment:', data);
      }
    } catch (error) {
      console.error('Error sending attachment to backend:', error);
    }
  };
  

  // Function to handle file input change (when user selects a file)
const handleFileChange = async (event) => {
  const file = event.target.files[0];  // Get the selected file
  if (!file) return; // No file selected, exit the function

  const uniqueId = uuidv4(); // Create a unique ID for the file
  const storageRef = ref(storage, `chatAttachments/attachment_${uniqueId}`);  // Firebase storage path

  try {
    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, file);
    
    // Get the download URL for the uploaded file
    const downloadURL = await getDownloadURL(storageRef);

    // Get the filename
    const filename = file.name;
    console.log("downloadURL: ",downloadURL)
    // Now send the file details (URL, filename) to the backend
    await sendAttachmentToBackend(downloadURL, filename);

    // Optionally update the UI with the uploaded file
    setMessages((prevMessages) => [
      ...prevMessages,
      { 
        sender: 'You', 
        text: 'attachment',
        fileUrl: downloadURL,
        fileName: filename,
      
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Failed to upload the file. Please try again.");
  }
};
  

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 bg-white shadow-md">
        {/* Left Sidebar */}
        <div className="w-full sm:w-1/4 bg-[#E7E4D8] text-[#822538] pl-0 pr-0 pt-4 pb-4 h-full overflow-y-auto">
          <div className="pt-0 pl-5 pr-5 pb-2">
            <Link href="/" passHref>
              <div className="text-xl font-semibold mb-6 cursor-pointer">Fabricae</div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="p-3">
              <div className="flex items-center border rounded-2xl bg-white">
                <input
                  type="text"
                  // value={search}
                  // onChange={(e) => setMessage(e.target.value)}
                  placeholder="Search brands or designers..."
                  className="w-full p-2 pl-4 pr-2 rounded-full border-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500 text-lg px-4">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
          </div>

          {/* Contact List */}
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex flex-col p-2 cursor-pointer ${selectedContact?.id === contact.id ? 'bg-white' : 'hover:bg-white'}`}
                onClick={() => handleContactClick(contact)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-800 truncate max-w-xs">{contact.name}</span>
                  <div className="flex justify-end gap-2">
                  <TimestampComponent timestamp={contact.lastMessageTime} />
                    {/* <span className="text-xs text-gray-500">{contact.lastMessageTime}</span> */}
                    {/* {contact.newMessages > 0 && (
                      <span className="text-xs bg-[#b86475] text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {contact.newMessages}
                      </span>
                    )} */}
                  </div>
                </div>
                <span className="text-sm text-gray-400 truncate max-w-xs">{contact.lastMessage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Section */}
        <div className="w-full sm:w-3/4 bg-white p-4 flex flex-col h-full pl-0 pr-0 pt-0">
          <div className="flex justify-between items-center mb-4 border-b-4 pb-3 pl-2 pt-2 shadow-[0px_2px_6px_rgba(0,0,0,0.1)]">
            <div className="text-xl font-semibold">{selectedContact?.name}</div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 bg-white p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${(msg.senderId === selectedContact?.id || msg.sender === selectedContact?.email) ? 'justify-start' : 'justify-end'}`}
              >
                <div className="flex items-center relative group">  {/* Wrap in 'group' for hover */}
                  {/* Display profile picture for the sender */}
                  {(msg.senderId === selectedContact?.id || msg.sender === selectedContact?.email) && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2">
                    <img className="w-8 h-8 rounded-full bg-gray-300 mr-2"  src={profile.profilePicture}  />
                    </div>
                  )}

                  {/* Delete icon: only visible on hover */}
                  {(msg.senderId !== selectedContact?.id && msg.sender !== selectedContact?.email) && (
                    <button
                      className="p-2 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteMessage(msg._id, index)} // Trigger delete when clicked
                    >
                      <i className="fas fa-trash"></i> {/* Delete icon */}
                    </button>
                  )}

                  {/* Message bubble */}
                  <div className={`p-3 rounded-xl max-w-lg ${msg.senderId === selectedContact?.id || msg.sender === selectedContact?.email ? 'bg-gray-100 text-gray-600' : 'bg-[#c97787] text-white'}`}>
                    <p>{msg.text || msg.messageText}</p>
                    
                    <div className="mt-2">
                      {/* Display based on the file type */}
                      {msg.fileUrl && (
                        <div>
                          {/* Check for image file types */}
                          {['jpeg', 'png', 'gif','PNG','jpg'].some((type) => msg.fileName.toLowerCase().endsWith(type)) ? (
                            <div>
                              <img
                                src={msg.fileUrl}
                                alt={msg.fileName}
                                style={{ width: '200px', height: '250px', cursor: 'pointer' }}
                                onClick={() => window.open(msg.fileUrl, '_blank')} // Open in a new tab when clicked
                              />
                              {/* <p
                               style={{ maxWidth: '200px', maxHeight: '200px', cursor: 'pointer' }}
                               onClick={() => window.open(msg.fileUrl, '_blank')} // Open in a new tab when clicked
                              >{msg.fileName}</p> */}
                            </div>
                          ) : msg.fileName.toLowerCase().endsWith('pdf') ? (
                            // If it's a PDF file, show a preview using an iframe
                            <div>
                              <iframe
                                src={msg.fileUrl}
                                width="100%"
                                height="200px"
                                title="PDF Preview"
                                onClick={() => window.open(msg.fileUrl, '_blank')} // Open in a new tab for download
                              ></iframe>
                              <p
                               style={{ maxWidth: '200px', maxHeight: '200px', cursor: 'pointer' }}
                               onClick={() => window.open(msg.fileUrl, '_blank')} // Open in a new tab when clicked
                              >{msg.fileName}</p>
                            </div>
                          ) : (
                            // For other file types (like Word, Excel), show a download link
                            <div>
                              <a
                              
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ cursor: 'pointer' }}
                                onClick={() => window.open(msg.fileUrl, '_blank')} // Open in new tab for download
                              >
                                {msg.fileName} {/* Display the filename */}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                   
                    <TimestampComponent timestamp={msg.timestamp} />
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Message Input */}
          <div className="mt-4 flex items-center space-x-2 bg-white p-2 rounded-full border">
            <label htmlFor="file-input" className="cursor-pointer p-2 bg-gray-300 rounded-full"
            onClick={() => document.getElementById('file-input').click()}
            >
              <i className="fas fa-paperclip text-gray-600"></i>
            </label>
            <input type="file" className="hidden" id="file-input" onChange={handleFileChange}/>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border-none bg-gray-100 rounded-full"
            />
            <button onClick={handleSendMessage} className="p-2 bg-[#c97787] text-white rounded-full">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

        {/* Right Sidebar (Profile Section) */}
        <div className="w-full sm:w-1/4 bg-[#E7E4D8] p-4 border-l h-full">
          <div className="text-xl font-semibold mb-4">{selectedContact?.name}</div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300">
            <img className="w-9 h-9 rounded-full bg-gray-300 mr-2"  src={profile?.profilePicture}  />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">{selectedContact?.name}</div>
              <div className="text-xs text-gray-500">Sustainable luxury fashion brand</div>
            </div>
          </div>

          <div className="mt-6">
            {/* <div className="text-xs font-semibold text-gray-600">About</div>
            <p className="text-sm text-gray-500 mt-2">{selectedContact?.about}</p> */}
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-gray-600">Contact Information</div>
            <div className="text-sm text-gray-500 mt-2">
              <p><i className="fas fa-envelope text-gray-600"></i> Email: <a href={`mailto:${selectedContact?.email}`} className="text-blue-600 hover:underline">{selectedContact?.contact}</a></p>
              {/* <p><i className="fas fa-phone text-gray-600"></i> Phone: <a href={`tel:${selectedContact?.phone}`} className="text-blue-600 hover:underline">{selectedContact?.phone}</a></p> */}
              <p><i className="fas fa-map-marker-alt text-gray-600"></i> Location: {profile?.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
