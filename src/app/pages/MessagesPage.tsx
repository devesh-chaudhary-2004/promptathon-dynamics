import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react";

const mockConversations = [
  {
    id: 1,
    user: "Sarah Chen",
    avatar: "SC",
    lastMessage: "Thanks for the session! Looking forward to the next one.",
    time: "2h ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    user: "Alex Kumar",
    avatar: "AK",
    lastMessage: "Can we reschedule to Monday?",
    time: "5h ago",
    unread: 1,
    online: false,
  },
  {
    id: 3,
    user: "Michael Zhang",
    avatar: "MZ",
    lastMessage: "Great explanation on algorithms!",
    time: "1d ago",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    user: "Emily Rodriguez",
    avatar: "ER",
    lastMessage: "I've sent you the project files.",
    time: "2d ago",
    unread: 0,
    online: false,
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "Sarah Chen",
    content: "Hi! Thanks for accepting my swap request.",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Of course! I'm excited to learn React from you.",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Sarah Chen",
    content: "Great! When would be a good time for our first session?",
    time: "10:33 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    content: "How about this Thursday at 6 PM? I'm free after work.",
    time: "10:35 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "Sarah Chen",
    content: "Perfect! That works for me. I'll send you the meeting link before then.",
    time: "10:36 AM",
    isOwn: false,
  },
  {
    id: 6,
    sender: "Sarah Chen",
    content: "Also, do you have any specific topics you'd like to cover first?",
    time: "10:37 AM",
    isOwn: false,
  },
  {
    id: 7,
    sender: "You",
    content: "I'd love to start with React hooks and state management. I've been struggling with that.",
    time: "10:40 AM",
    isOwn: true,
  },
  {
    id: 8,
    sender: "Sarah Chen",
    content: "Excellent choice! We'll dive deep into hooks. I'll prepare some examples for Thursday.",
    time: "10:42 AM",
    isOwn: false,
  },
  {
    id: 9,
    sender: "Sarah Chen",
    content: "Thanks for the session! Looking forward to the next one.",
    time: "2:15 PM",
    isOwn: false,
  },
];

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message
      setMessageInput("");
    }
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-80px)] px-4 py-6">
      <div className="container mx-auto h-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="mb-2 text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400">Chat with your skill swap partners</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid h-[calc(100%-120px)] grid-cols-1 gap-4 md:grid-cols-3"
        >
          {/* Conversations List */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl md:col-span-1">
            <CardContent className="flex h-full flex-col p-4">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full rounded-lg p-3 text-left transition-all ${
                        selectedConversation.id === conversation.id
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                          : "border border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src="" alt={conversation.user} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              {conversation.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-500" />
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="mb-1 flex items-center justify-between">
                            <p className="font-semibold text-white">{conversation.user}</p>
                            <span className="text-xs text-gray-400">{conversation.time}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm text-gray-400">{conversation.lastMessage}</p>
                            {conversation.unread > 0 && (
                              <Badge className="h-5 min-w-5 bg-purple-500 px-1.5 text-xs">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl md:col-span-2">
            <CardContent className="flex h-full flex-col p-0">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src="" alt={selectedConversation.user} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {selectedConversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{selectedConversation.user}</p>
                    <p className="text-xs text-gray-400">
                      {selectedConversation.online ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex max-w-[70%] gap-2 ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
                        {!message.isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt={message.sender} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-xs text-white">
                              {selectedConversation.avatar}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              message.isOwn
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                : "border border-white/10 bg-white/10 text-white"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className={`mt-1 text-xs text-gray-400 ${message.isOwn ? "text-right" : "text-left"}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t border-white/10 p-4">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    className="border-white/10 bg-white/5 text-white placeholder:text-gray-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
