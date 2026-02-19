import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Skeleton } from "@/app/components/ui/skeleton";
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  AlertCircle,
  MessageSquare,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { messagesAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";

interface Conversation {
  _id: string;
  participant: {
    _id: string;
    name: string;
    avatar?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
  updatedAt: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  read: boolean;
}

export function MessagesPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem("token");
    socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
    });

    socketRef.current.on("online_users", (users: string[]) => {
      setOnlineUsers(new Set(users));
    });

    socketRef.current.on("user_online", (userId: string) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    socketRef.current.on("user_offline", (userId: string) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    socketRef.current.on("new_message", (message: Message) => {
      // Add message to current conversation if it matches
      if (selectedConversation && 
          (message.sender._id === selectedConversation.participant._id ||
           message.sender._id === user._id)) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
      
      // Update conversation list
      fetchConversations();
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isAuthenticated, user]);

  // Fetch conversations on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  // Handle URL param for opening specific conversation
  useEffect(() => {
    const targetUserId = searchParams.get("user");
    if (targetUserId && conversations.length > 0) {
      const existingConv = conversations.find(
        (c) => c.participant._id === targetUserId
      );
      if (existingConv) {
        setSelectedConversation(existingConv);
      } else {
        // Start new conversation
        startNewConversation(targetUserId);
      }
    }
  }, [searchParams, conversations]);

  // Fetch messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      // Join the conversation room
      socketRef.current?.emit("join_conversation", selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      setError(null);
      const response = await messagesAPI.getConversations();
      setConversations(response.data.conversations || response.data || []);
      
      // Select first conversation if none selected
      if (!selectedConversation && response.data.conversations?.length > 0) {
        setSelectedConversation(response.data.conversations[0]);
      }
    } catch (err: any) {
      console.error("Error fetching conversations:", err);
      setError(err.response?.data?.message || "Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const response = await messagesAPI.getMessages(conversationId);
      setMessages(response.data.messages || response.data || []);
      scrollToBottom();
      
      // Mark messages as read
      await messagesAPI.markAsRead(conversationId);
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const startNewConversation = async (userId: string) => {
    try {
      const response = await messagesAPI.startConversation(userId);
      const newConversation = response.data.conversation || response.data;
      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    } catch (err: any) {
      console.error("Error starting conversation:", err);
      toast.error("Failed to start conversation");
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      const response = await messagesAPI.sendMessage(
        selectedConversation._id,
        messageInput.trim()
      );
      
      const newMessage = response.data.message || response.data;
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
      scrollToBottom();
      
      // Emit via socket for real-time delivery
      socketRef.current?.emit("send_message", {
        conversationId: selectedConversation._id,
        message: newMessage,
      });
      
      // Update conversation list
      fetchConversations();
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit",
        hour12: true 
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auth check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl max-w-md">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-teal-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Sign in to view messages</h2>
            <p className="text-gray-400 mb-4">
              You need to be logged in to access your messages.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-teal-500 text-white hover:bg-teal-600"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] px-4 py-6">
      <div className="container mx-auto h-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="mb-2 text-3xl font-bold text-white font-heading">Messages</h1>
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
                {loadingConversations ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-3 rounded-lg border border-white/10 bg-white/5">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24 bg-white/10" />
                            <Skeleton className="h-3 w-full bg-white/10" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
                    <p className="text-sm text-gray-400">{error}</p>
                    <Button
                      onClick={fetchConversations}
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-teal-400"
                    >
                      Try again
                    </Button>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageSquare className="h-8 w-8 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">
                      {searchQuery ? "No conversations found" : "No conversations yet"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Start a conversation from a skill page
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation._id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full rounded-lg p-3 text-left transition-all ${
                          selectedConversation?._id === conversation._id
                            ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30"
                            : "border border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                                {getInitials(conversation.participant.name)}
                              </AvatarFallback>
                            </Avatar>
                            {onlineUsers.has(conversation.participant._id) && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#050505] bg-green-500" />
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="mb-1 flex items-center justify-between">
                              <p className="font-semibold text-white">
                                {conversation.participant.name}
                              </p>
                              <span className="text-xs text-gray-400">
                                {conversation.lastMessage
                                  ? formatTime(conversation.lastMessage.createdAt)
                                  : formatTime(conversation.updatedAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm text-gray-400">
                                {conversation.lastMessage?.content || "No messages yet"}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <Badge className="h-5 min-w-5 bg-teal-500 px-1.5 text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl md:col-span-2">
            <CardContent className="flex h-full flex-col p-0">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage 
                            src={selectedConversation.participant.avatar} 
                            alt={selectedConversation.participant.name} 
                          />
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                            {getInitials(selectedConversation.participant.name)}
                          </AvatarFallback>
                        </Avatar>
                        {onlineUsers.has(selectedConversation.participant._id) && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#050505] bg-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {selectedConversation.participant.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {onlineUsers.has(selectedConversation.participant._id) 
                            ? "Active now" 
                            : "Offline"}
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
                    {loadingMessages ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                          >
                            <div className={`flex max-w-[70%] gap-2 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
                              {i % 2 === 0 && (
                                <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                              )}
                              <div>
                                <Skeleton className="h-12 w-48 rounded-2xl bg-white/10" />
                                <Skeleton className="h-3 w-16 mt-1 bg-white/10" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageSquare className="h-12 w-12 text-gray-500 mb-3" />
                        <p className="text-gray-400">No messages yet</p>
                        <p className="text-sm text-gray-500">
                          Start the conversation!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => {
                          const isOwn = message.sender._id === user?._id;
                          return (
                            <motion.div
                              key={message._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.02 }}
                              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`flex max-w-[70%] gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                                {!isOwn && (
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage 
                                      src={message.sender.avatar} 
                                      alt={message.sender.name} 
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-xs text-white">
                                      {getInitials(message.sender.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div>
                                  <div
                                    className={`rounded-2xl px-4 py-2 ${
                                      isOwn
                                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                                        : "border border-white/10 bg-white/10 text-white"
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                  <p className={`mt-1 text-xs text-gray-400 ${isOwn ? "text-right" : "text-left"}`}>
                                    {formatTime(message.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
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
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={sendingMessage}
                        className="border-white/10 bg-white/5 text-white placeholder:text-gray-400"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={sendingMessage || !messageInput.trim()}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                      >
                        {sendingMessage ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="rounded-full bg-white/5 p-6 mb-4">
                    <MessageSquare className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-400 text-sm max-w-sm">
                    Choose a conversation from the list to start messaging, or visit a skill page to message someone new.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
