import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import User from './models/User.js';
import Skill from './models/Skill.js';
import Course from './models/Course.js';
import Workshop from './models/Workshop.js';
import Review from './models/Review.js';
import SwapRequest from './models/SwapRequest.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Skill.deleteMany({}),
      Course.deleteMany({}),
      Workshop.deleteMany({}),
      Review.deleteMany({}),
      SwapRequest.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Alex Chen',
        email: 'alex@skillx.com',
        password: 'password123',
        city: 'Boston',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        college: 'MIT',
        year: '4',
        bio: 'Full-stack developer passionate about teaching others. Love building web apps and sharing knowledge.',
        rating: { average: 4.9, count: 23 },
        credits: 250,
        isVerified: true,
        stats: { totalSwaps: 28, totalTeaching: 20, totalLearning: 8, totalHours: 56 },
        socialLinks: { github: 'https://github.com/alexchen', linkedin: 'https://linkedin.com/in/alexchen' },
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@skillx.com',
        password: 'password123',
        city: 'San Francisco',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        college: 'Stanford University',
        year: '3',
        bio: 'UI/UX designer with a passion for creating beautiful and intuitive user experiences.',
        rating: { average: 4.8, count: 19 },
        credits: 180,
        isVerified: true,
        stats: { totalSwaps: 22, totalTeaching: 15, totalLearning: 7, totalHours: 44 },
        socialLinks: { portfolio: 'https://sarahdesigns.com', linkedin: 'https://linkedin.com/in/sarahjohnson' },
      },
      {
        name: 'Michael Park',
        email: 'michael@skillx.com',
        password: 'password123',
        city: 'Pittsburgh',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        college: 'Carnegie Mellon',
        year: '4',
        bio: 'Data scientist specializing in machine learning and statistical analysis.',
        rating: { average: 4.7, count: 15 },
        credits: 200,
        isVerified: true,
        stats: { totalSwaps: 18, totalTeaching: 12, totalLearning: 6, totalHours: 36 },
      },
      {
        name: 'Emily Davis',
        email: 'emily@skillx.com',
        password: 'password123',
        city: 'Berkeley',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        college: 'UC Berkeley',
        year: '3',
        bio: 'Digital marketing expert with experience in social media and content strategy.',
        rating: { average: 4.6, count: 12 },
        credits: 150,
        isVerified: true,
        stats: { totalSwaps: 15, totalTeaching: 8, totalLearning: 7, totalHours: 30 },
      },
      {
        name: 'James Wilson',
        email: 'james@skillx.com',
        password: 'password123',
        city: 'Cambridge',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        college: 'Harvard',
        year: '2',
        bio: 'Musician and composer. Teaching piano and music theory for 5 years.',
        rating: { average: 4.9, count: 31 },
        credits: 300,
        isVerified: true,
        stats: { totalSwaps: 45, totalTeaching: 40, totalLearning: 5, totalHours: 90 },
      },
      {
        name: 'Lisa Wang',
        email: 'lisa@skillx.com',
        password: 'password123',
        city: 'Los Angeles',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        college: 'UCLA',
        year: '4',
        bio: 'Multilingual language tutor. Native Mandarin speaker, fluent in Spanish and French.',
        rating: { average: 4.8, count: 27 },
        credits: 220,
        isVerified: true,
        stats: { totalSwaps: 35, totalTeaching: 25, totalLearning: 10, totalHours: 70 },
      },
    ]);
    console.log('Created users');

    // Create skills with correct schema
    const skills = await Skill.create([
      {
        title: 'Full Stack Web Development with React & Node.js',
        description: 'Learn modern web development from front to back. I will teach you React.js for frontend, Node.js/Express for backend, and MongoDB for database. We will build real projects together including a full-stack e-commerce application.',
        category: 'development',
        tags: ['react', 'nodejs', 'javascript', 'mongodb', 'express'],
        user: users[0]._id,
        expertise: 'expert',
        teachingMode: 'online',
        sessionDuration: 90,
        maxStudents: 3,
        language: 'english',
        isPremium: false,
        price: 0,
        prerequisites: ['Basic JavaScript knowledge', 'HTML/CSS fundamentals'],
        learningOutcomes: ['Build complete React applications', 'Create REST APIs with Node.js', 'Work with MongoDB databases', 'Deploy to production'],
        availability: ['weekday-evening', 'weekend-morning', 'weekend-afternoon'],
        rating: { average: 4.9, count: 23 },
        stats: { views: 1250, students: 28, sessions: 56, totalHours: 84 },
        isActive: true,
        isFeatured: true,
      },
      {
        title: 'UI/UX Design Fundamentals with Figma',
        description: 'Master the art of user interface and user experience design. Learn design principles, wireframing, prototyping, and using Figma professionally. Perfect for beginners wanting to start a career in design.',
        category: 'design',
        tags: ['figma', 'ui-design', 'ux-design', 'prototyping', 'wireframing'],
        user: users[1]._id,
        expertise: 'advanced',
        teachingMode: 'online',
        sessionDuration: 60,
        maxStudents: 2,
        language: 'english',
        isPremium: false,
        price: 0,
        prerequisites: ['No prior experience needed', 'Creativity and enthusiasm'],
        learningOutcomes: ['Design beautiful user interfaces', 'Create interactive prototypes', 'Understand UX principles', 'Build a design portfolio'],
        availability: ['weekday-afternoon', 'weekday-evening', 'weekend-afternoon'],
        rating: { average: 4.8, count: 19 },
        stats: { views: 980, students: 22, sessions: 44, totalHours: 44 },
        isActive: true,
        isFeatured: true,
      },
      {
        title: 'Machine Learning with Python & TensorFlow',
        description: 'Dive into the world of artificial intelligence and machine learning. Learn Python, NumPy, Pandas, and TensorFlow to build intelligent systems. We will cover supervised learning, neural networks, and real-world ML projects.',
        category: 'ai-ml',
        tags: ['python', 'tensorflow', 'machine-learning', 'deep-learning', 'data-science'],
        user: users[2]._id,
        expertise: 'advanced',
        teachingMode: 'online',
        sessionDuration: 90,
        maxStudents: 2,
        language: 'english',
        isPremium: true,
        price: 20,
        prerequisites: ['Python basics', 'Basic math (linear algebra, statistics)'],
        learningOutcomes: ['Build ML models from scratch', 'Use TensorFlow for deep learning', 'Work on real datasets', 'Deploy ML models'],
        availability: ['weekday-evening', 'weekend-morning'],
        rating: { average: 4.7, count: 15 },
        stats: { views: 850, students: 18, sessions: 36, totalHours: 54 },
        isActive: true,
        isFeatured: true,
      },
      {
        title: 'Digital Marketing & Social Media Strategy',
        description: 'Learn to create effective digital marketing campaigns. Master social media marketing, content strategy, SEO basics, and analytics. Perfect for entrepreneurs and marketing enthusiasts.',
        category: 'marketing',
        tags: ['social-media', 'seo', 'content-marketing', 'analytics', 'digital-marketing'],
        user: users[3]._id,
        expertise: 'intermediate',
        teachingMode: 'hybrid',
        sessionDuration: 60,
        maxStudents: 4,
        language: 'english',
        isPremium: false,
        price: 0,
        prerequisites: ['Basic understanding of social media platforms'],
        learningOutcomes: ['Create marketing strategies', 'Optimize for search engines', 'Analyze campaign performance', 'Build brand presence'],
        availability: ['weekday-morning', 'weekday-afternoon', 'weekend-evening'],
        rating: { average: 4.6, count: 12 },
        stats: { views: 620, students: 15, sessions: 30, totalHours: 30 },
        isActive: true,
        isFeatured: false,
      },
      {
        title: 'Piano Lessons for All Levels',
        description: 'Learn piano from a passionate musician with 5+ years of teaching experience. From complete beginners to intermediate players, I tailor lessons to your goals. Learn classical, jazz, or contemporary styles.',
        category: 'music',
        tags: ['piano', 'music-theory', 'classical', 'jazz', 'composition'],
        user: users[4]._id,
        expertise: 'expert',
        teachingMode: 'hybrid',
        sessionDuration: 60,
        maxStudents: 1,
        language: 'english',
        isPremium: true,
        price: 15,
        prerequisites: ['No experience needed', 'Access to a piano or keyboard'],
        learningOutcomes: ['Read sheet music', 'Play your favorite songs', 'Understand music theory', 'Develop proper technique'],
        availability: ['weekday-afternoon', 'weekday-evening', 'weekend-morning', 'weekend-afternoon'],
        rating: { average: 4.9, count: 31 },
        stats: { views: 1100, students: 45, sessions: 90, totalHours: 90 },
        isActive: true,
        isFeatured: true,
      },
      {
        title: 'Mandarin Chinese for Beginners',
        description: 'Start your Mandarin journey with a native speaker! Learn practical conversational Chinese, basic characters, and cultural insights. Fun and engaging lessons tailored to your pace.',
        category: 'languages',
        tags: ['mandarin', 'chinese', 'language-learning', 'conversation', 'culture'],
        user: users[5]._id,
        expertise: 'expert',
        teachingMode: 'online',
        sessionDuration: 45,
        maxStudents: 2,
        language: 'english',
        isPremium: false,
        price: 0,
        prerequisites: ['No prior knowledge needed', 'Enthusiasm to learn'],
        learningOutcomes: ['Basic conversational skills', 'Read and write 200+ characters', 'Understand Chinese culture', 'Pass HSK1 exam'],
        availability: ['weekday-morning', 'weekday-evening', 'weekend-afternoon'],
        rating: { average: 4.8, count: 27 },
        stats: { views: 780, students: 35, sessions: 70, totalHours: 52 },
        isActive: true,
        isFeatured: true,
      },
      {
        title: 'Data Structures & Algorithms in JavaScript',
        description: 'Crack coding interviews with confidence! Learn essential DSA concepts including arrays, linked lists, trees, graphs, sorting, and searching algorithms. Practice with LeetCode-style problems.',
        category: 'dsa',
        tags: ['algorithms', 'data-structures', 'javascript', 'coding-interviews', 'leetcode'],
        user: users[0]._id,
        expertise: 'advanced',
        teachingMode: 'online',
        sessionDuration: 75,
        maxStudents: 2,
        language: 'english',
        isPremium: true,
        price: 10,
        prerequisites: ['JavaScript fundamentals', 'Basic programming concepts'],
        learningOutcomes: ['Master common data structures', 'Implement sorting algorithms', 'Solve coding problems efficiently', 'Ace technical interviews'],
        availability: ['weekday-evening', 'weekend-morning'],
        rating: { average: 4.8, count: 18 },
        stats: { views: 920, students: 20, sessions: 40, totalHours: 50 },
        isActive: true,
        isFeatured: false,
      },
      {
        title: 'AWS Cloud & DevOps Fundamentals',
        description: 'Get started with cloud computing and DevOps practices. Learn AWS services (EC2, S3, Lambda, RDS), Docker, CI/CD pipelines, and infrastructure as code with Terraform.',
        category: 'cloud',
        tags: ['aws', 'devops', 'docker', 'terraform', 'ci-cd'],
        user: users[2]._id,
        expertise: 'intermediate',
        teachingMode: 'online',
        sessionDuration: 90,
        maxStudents: 3,
        language: 'english',
        isPremium: true,
        price: 25,
        prerequisites: ['Basic Linux knowledge', 'Programming experience'],
        learningOutcomes: ['Deploy apps on AWS', 'Containerize with Docker', 'Set up CI/CD pipelines', 'Manage infrastructure as code'],
        availability: ['weekday-evening', 'weekend-afternoon', 'weekend-evening'],
        rating: { average: 4.6, count: 10 },
        stats: { views: 540, students: 12, sessions: 24, totalHours: 36 },
        isActive: true,
        isFeatured: false,
      },
    ]);
    console.log('Created skills');

    // Create courses
    const courses = await Course.create([
      {
        title: 'Complete React Developer Course 2024',
        description: 'Go from zero to hero in React development. This comprehensive course covers everything from React basics to advanced patterns, Redux, hooks, and building production-ready applications.',
        instructor: users[0]._id,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        category: 'development',
        level: 'intermediate',
        language: 'english',
        modules: [
          {
            title: 'Getting Started with React',
            description: 'Introduction to React and setting up your development environment',
            lessons: [
              { title: 'What is React?', type: 'video', duration: 15, content: 'Introduction to React and its ecosystem' },
              { title: 'Setting up your environment', type: 'video', duration: 20, content: 'Installing Node.js, npm, and create-react-app' },
              { title: 'Your first React component', type: 'video', duration: 25, content: 'Creating and understanding React components' },
            ],
          },
          {
            title: 'React Fundamentals',
            description: 'Core concepts of React development',
            lessons: [
              { title: 'JSX Deep Dive', type: 'video', duration: 30, content: 'Understanding JSX syntax and expressions' },
              { title: 'Props and State', type: 'video', duration: 35, content: 'Managing data in React components' },
              { title: 'Event Handling', type: 'video', duration: 20, content: 'Handling user interactions' },
            ],
          },
          {
            title: 'React Hooks',
            description: 'Modern React with hooks',
            lessons: [
              { title: 'useState & useEffect', type: 'video', duration: 40, content: 'Essential hooks for state and side effects' },
              { title: 'Custom Hooks', type: 'video', duration: 35, content: 'Building reusable logic with custom hooks' },
              { title: 'useContext & useReducer', type: 'video', duration: 45, content: 'Advanced state management' },
            ],
          },
        ],
        price: 0,
        rating: { average: 4.9, count: 156 },
        totalStudents: 524,
        isPublished: true,
        isFeatured: true,
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn professional UI/UX design from scratch. Master Figma, design principles, user research, and create stunning interfaces that users love.',
        instructor: users[1]._id,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        category: 'design',
        level: 'beginner',
        language: 'english',
        modules: [
          {
            title: 'Design Fundamentals',
            description: 'Core principles of good design',
            lessons: [
              { title: 'Color Theory', type: 'video', duration: 25, content: 'Understanding color psychology and palettes' },
              { title: 'Typography Basics', type: 'video', duration: 20, content: 'Choosing and pairing fonts effectively' },
              { title: 'Layout & Composition', type: 'video', duration: 30, content: 'Creating balanced and appealing layouts' },
            ],
          },
          {
            title: 'Figma Essentials',
            description: 'Master the industry-standard design tool',
            lessons: [
              { title: 'Figma Interface', type: 'video', duration: 20, content: 'Navigating Figma workspace' },
              { title: 'Components & Variants', type: 'video', duration: 35, content: 'Building reusable design systems' },
              { title: 'Prototyping', type: 'video', duration: 40, content: 'Creating interactive prototypes' },
            ],
          },
        ],
        price: 0,
        rating: { average: 4.8, count: 98 },
        totalStudents: 312,
        isPublished: true,
        isFeatured: true,
      },
      {
        title: 'Python for Data Science',
        description: 'Start your data science journey with Python. Learn NumPy, Pandas, Matplotlib, and build real data analysis projects.',
        instructor: users[2]._id,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
        category: 'data-science',
        level: 'intermediate',
        language: 'english',
        modules: [
          {
            title: 'Python Refresher',
            description: 'Quick review of Python essentials',
            lessons: [
              { title: 'Python Basics', type: 'video', duration: 30, content: 'Variables, data types, and control flow' },
              { title: 'Functions & OOP', type: 'video', duration: 35, content: 'Functions, classes, and object-oriented programming' },
            ],
          },
          {
            title: 'Data Analysis with Pandas',
            description: 'Master data manipulation',
            lessons: [
              { title: 'DataFrames', type: 'video', duration: 40, content: 'Creating and manipulating DataFrames' },
              { title: 'Data Cleaning', type: 'video', duration: 45, content: 'Handling missing data and outliers' },
              { title: 'Data Visualization', type: 'video', duration: 35, content: 'Creating charts with Matplotlib and Seaborn' },
            ],
          },
        ],
        price: 15,
        rating: { average: 4.7, count: 72 },
        totalStudents: 198,
        isPublished: true,
        isFeatured: false,
      },
    ]);
    console.log('Created courses');

    // Create workshops
    const now = new Date();
    const workshops = await Workshop.create([
      {
        title: 'Building a Real-time Chat App with Socket.IO',
        description: 'Join this hands-on workshop where we build a complete real-time chat application from scratch using React and Socket.IO. Learn WebSocket fundamentals and implement features like typing indicators, online status, and message history.',
        host: users[0]._id,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        category: 'development',
        type: 'live',
        scheduledDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        startTime: '14:00',
        duration: 180,
        maxParticipants: 50,
        participants: [users[1]._id, users[2]._id, users[3]._id],
        price: 0,
        status: 'published',
        tags: ['react', 'socket.io', 'real-time', 'nodejs'],
        requirements: ['Basic React knowledge', 'Node.js installed', 'Code editor'],
      },
      {
        title: 'Design Systems Workshop: From Concept to Implementation',
        description: 'Learn how to create scalable design systems that bridge the gap between design and development. We will build a complete design system in Figma with components, tokens, and documentation.',
        host: users[1]._id,
        thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
        category: 'design',
        type: 'live',
        scheduledDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        startTime: '10:00',
        duration: 180,
        maxParticipants: 30,
        participants: [users[0]._id, users[4]._id],
        price: 10,
        status: 'published',
        tags: ['figma', 'design-systems', 'ui-design', 'components'],
        requirements: ['Figma account', 'Basic design knowledge'],
      },
      {
        title: 'Intro to Neural Networks with TensorFlow',
        description: 'Demystify neural networks in this beginner-friendly workshop. We will cover the basics of deep learning, build a neural network from scratch, and train it to recognize handwritten digits.',
        host: users[2]._id,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        category: 'ai-ml',
        type: 'live',
        scheduledDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        startTime: '15:00',
        duration: 180,
        maxParticipants: 40,
        participants: [users[0]._id, users[1]._id, users[5]._id],
        price: 15,
        status: 'published',
        tags: ['tensorflow', 'neural-networks', 'deep-learning', 'python'],
        requirements: ['Python basics', 'Jupyter Notebook installed'],
      },
    ]);
    console.log('Created workshops');

    // Create reviews
    await Review.create([
      {
        reviewer: users[1]._id,
        reviewee: users[0]._id,
        skill: skills[0]._id,
        rating: 5,
        comment: 'Alex is an amazing teacher! His React course was incredibly thorough and he explained complex concepts in a way that was easy to understand. I went from knowing nothing about React to building my own projects in just a few weeks.',
        detailedRatings: { communication: 5, knowledge: 5, punctuality: 5, teaching: 5, value: 5 },
      },
      {
        reviewer: users[2]._id,
        reviewee: users[0]._id,
        skill: skills[0]._id,
        rating: 5,
        comment: 'Excellent instructor! Patient and knowledgeable. The hands-on projects really helped cement the concepts.',
        detailedRatings: { communication: 5, knowledge: 5, punctuality: 4, teaching: 5, value: 5 },
      },
      {
        reviewer: users[0]._id,
        reviewee: users[1]._id,
        skill: skills[1]._id,
        rating: 5,
        comment: 'Sarah has a great eye for design and explains the reasoning behind her decisions. My Figma skills improved dramatically after our sessions.',
        detailedRatings: { communication: 5, knowledge: 5, punctuality: 5, teaching: 5, value: 5 },
      },
      {
        reviewer: users[3]._id,
        reviewee: users[4]._id,
        skill: skills[4]._id,
        rating: 5,
        comment: 'James is a fantastic piano teacher! He adapts his teaching style to your level and makes learning fun. I can now play my favorite songs!',
        detailedRatings: { communication: 5, knowledge: 5, punctuality: 5, teaching: 5, value: 5 },
      },
      {
        reviewer: users[0]._id,
        reviewee: users[5]._id,
        skill: skills[5]._id,
        rating: 4,
        comment: 'Lisa is a patient teacher and native speaker. My Mandarin pronunciation has improved significantly. Would recommend to anyone starting their Chinese learning journey.',
        detailedRatings: { communication: 4, knowledge: 5, punctuality: 4, teaching: 5, value: 4 },
      },
    ]);
    console.log('Created reviews');

    // Create swap requests
    await SwapRequest.create([
      {
        requester: users[3]._id,
        recipient: users[0]._id,
        skillOffered: skills[3]._id,
        skillWanted: skills[0]._id,
        message: 'Hi Alex! I would love to learn React from you. In exchange, I can teach you digital marketing strategies. Let me know if you are interested!',
        status: 'pending',
        proposedSchedule: {
          startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
          sessionsPerWeek: 2,
          sessionDuration: 60,
        },
      },
      {
        requester: users[5]._id,
        recipient: users[1]._id,
        skillOffered: skills[5]._id,
        skillWanted: skills[1]._id,
        message: 'Hi Sarah! I am interested in learning UI/UX design and can teach you Mandarin Chinese in return. I think it would be a great exchange!',
        status: 'accepted',
        proposedSchedule: {
          startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
          sessionsPerWeek: 1,
          sessionDuration: 60,
        },
      },
      {
        requester: users[0]._id,
        recipient: users[4]._id,
        skillOffered: skills[0]._id,
        skillWanted: skills[4]._id,
        message: 'Hey James! I have always wanted to learn piano. Would you be interested in exchanging coding lessons for piano lessons?',
        status: 'in_progress',
        proposedSchedule: {
          startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          sessionsPerWeek: 1,
          sessionDuration: 60,
        },
      },
    ]);
    console.log('Created swap requests');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Test accounts:');
    console.log('   Email: alex@skillx.com | Password: password123');
    console.log('   Email: sarah@skillx.com | Password: password123');
    console.log('   Email: michael@skillx.com | Password: password123');
    console.log('   Email: emily@skillx.com | Password: password123');
    console.log('   Email: james@skillx.com | Password: password123');
    console.log('   Email: lisa@skillx.com | Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
