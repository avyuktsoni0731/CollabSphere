# CollabSphere 

**Find your next team, project, or hackathon — smarter.**

CollabSphere is an AI-powered student collaboration platform that connects college tech communities, helping students discover hackathons, join project teams, and find the perfect collaborators using intelligent matching algorithms.

## Live Demo

[**Try CollabSphere**](https://collabsphere-omega.vercel.app)

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)


## Problem Statement

College students in tech communities face significant challenges:

- **🔍 Difficulty finding teammates** with complementary skills for projects and hackathons
- **📅 Limited visibility** into relevant events, competitions, and opportunities
- **🤝 Inefficient matching** based on skills, interests, and availability
- **💬 Fragmented communication** across different platforms and communities
- **🎯 Lack of personalized recommendations** for relevant opportunities


## Solution Overview

CollabSphere addresses these challenges through:

1. **AI-Powered Matching**: Gemini AI analyzes project descriptions and suggests optimal teammates
2. **Event Discovery**: Comprehensive database of hackathons, workshops, and tech events
3. **Team Formation**: Streamlined process for creating and joining project teams
4. **Personalized Dashboard**: Dynamic insights and recommendations based on user activity
5. **Real-time Collaboration**: Live updates and notifications for seamless communication


## Key Features

### AI-Powered Team Builder

- **Gemini AI Integration**: Intelligent analysis of project ideas and skill requirements
- **Smart Matching**: Compatibility scoring with detailed reasoning
- **Skill Extraction**: Automatic identification of required technologies and domains


### Event Discovery Platform

- **Comprehensive Database**: Hackathons, workshops, and tech competitions
- **Advanced Filtering**: By domain, difficulty, location, prizes, and dates
- **Real-time Updates**: Live participant counts and registration status


### Team Management System

- **Team Creation**: Detailed project descriptions with skill requirements
- **Member Profiles**: University, major, experience, and portfolio information
- **Project Tracking**: Stage management from ideation to deployment


### Dynamic Dashboard

- **Personal Analytics**: Teams joined, events participated, skill matches
- **Smart Recommendations**: AI-curated suggestions for events and teams
- **Activity Feed**: Recent joins, invitations, and updates


### Secure Authentication

- **Firebase Auth**: Google Sign-In integration with persistent sessions
- **Profile Management**: Comprehensive user profiles with skills and preferences
- **Privacy Controls**: Granular settings for profile visibility


### Responsive Design

- **Mobile-First**: Optimized for all device sizes
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: WCAG compliant with keyboard navigation support


## Technology Stack

### Frontend

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern component library
- **[Lucide React](https://lucide.dev/)** - Beautiful icons


### Backend & Database

- **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service

- **Authentication** - Google OAuth integration
- **Firestore** - NoSQL real-time database
- **Hosting** - Static site hosting



- **[Vercel](https://vercel.com/)** - Deployment and hosting platform


### AI & Machine Learning

- **[Gemini AI](https://ai.google.dev/)** - Google's advanced AI model

- Project analysis and skill extraction
- Intelligent teammate matching
- Compatibility scoring with reasoning





### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications


## Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- **Firebase** project with Firestore enabled
- **Google Cloud** project with Gemini AI API access


### Environment Setup

1. **Clone the repository**


```shellscript
git clone https://github.com/yourusername/collabsphere.git
cd collabsphere
```

2. **Install dependencies**


```shellscript
npm install
# or
yarn install
```

3. **Environment Variables**


Create a `.env.local` file in the root directory:

```plaintext
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Firebase Setup

1. **Create a Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Google provider
4. Create a Firestore database



2. **Configure Authentication**

```shellscript
# In Firebase Console:
# 1. Go to Authentication > Sign-in method
# 2. Enable Google sign-in
# 3. Add your domain to authorized domains
```


3. **Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events are readable by all authenticated users
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Teams are readable by all authenticated users
    match /teams/{teamId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```




### Gemini AI Setup

1. **Get API Key**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file



2. **Enable APIs**

```shellscript
# In Google Cloud Console:
# 1. Enable Generative Language API
# 2. Set up billing (required for API usage)
```




## Installation

### Development Setup

```shellscript
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

### Database Seeding

```shellscript
# Seed Firestore with sample data
node scripts/seed-firestore-comprehensive.js
```

### Build for Production

```shellscript
# Build the application
npm run build

# Start production server
npm start
```

## Database Setup

### Firestore Collections

#### Users Collection

```typescript
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  university: string
  major: string
  year: string
  skills: string[]
  experience: string
  projects: number
  rating: number
  bio: string
  availability: string
  createdAt: Date
}
```

#### Events Collection

```typescript
interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  tags: string[]
  participants: number
  maxParticipants: number
  status: "upcoming" | "registration"
  difficulty: string
  prizes: string
  organizer: string
  featured?: boolean
  participantIds?: string[]
  createdAt: Date
}
```

#### Teams Collection

```typescript
interface Team {
  id: string
  name: string
  description: string
  idea: string
  leader: {
    name: string
    avatar?: string
    university: string
    major: string
  }
  members: number
  maxMembers: number
  requiredSkills: string[]
  currentSkills: string[]
  category: string
  stage: string
  commitment: string
  duration: string
  featured?: boolean
  tags: string[]
  memberIds?: string[]
  createdAt: Date
}
```

### Sample Data

Run the seeding script to populate your database:

```shellscript
node scripts/-comprehensive.js
```

This will create:

- **8 sample events** (hackathons, workshops, competitions)
- **8 sample teams** (various project categories and stages)
- **12 sample users** (diverse skills and backgrounds)


## Usage Guide

### For Students

1. **Sign Up/Login**

1. Use Google account for quick authentication
2. Complete your profile with skills and interests



2. **Discover Events**

1. Browse hackathons and tech events
2. Filter by domain, difficulty, and location
3. Join events that match your interests



3. **Find Teams**

1. Search for teams by skills or project type
2. View detailed project descriptions and requirements
3. Request to join teams that align with your goals



4. **Create Teams**

1. Describe your project idea and vision
2. Specify required skills and team size
3. Manage applications and build your team



5. **AI Suggestions**

1. Use the AI Team Builder for intelligent recommendations
2. Get matched with compatible teammates
3. Receive personalized event suggestions





### For Event Organizers

1. **Create Events**

1. Add comprehensive event details
2. Set participant limits and requirements
3. Manage registrations and updates



2. **Promote Events**

1. Use tags and categories for discoverability
2. Feature important events for visibility
3. Track participant engagement





## API Documentation

### Authentication

All API calls require Firebase Authentication:

```typescript
import { auth } from '@/lib/firebase'
import { useAuthUser } from '@/lib/useAuthUser'

const { user, loading } = useAuthUser()
```

### Core Functions

#### Events

```typescript
// Get all events
const events = await getEvents()

// Join an event
await joinEvent(eventId, userId)

// Check if user joined event
const hasJoined = await hasUserJoinedEvent(eventId, userId)

// Create new event
await addEvent(eventData)
```

#### Teams

```typescript
// Get all teams
const teams = await getTeams()

// Join a team
await joinTeam(teamId, userId, userName)

// Check if user joined team
const hasJoined = await hasUserJoinedTeam(teamId, userId)

// Create new team
await addTeam(teamData)
```

#### AI Integration

```typescript
// Analyze project idea with Gemini AI
const analysis = await analyzeProjectIdea(
  ideaDescription,
  availableTeams,
  availableUsers
)

// Extract skills from description
const skills = await extractSkillsFromDescription(description)
```

#### User Management

```typescript
// Get user by email
const user = await getUserByEmail(email)

// Update user profile
await updateUser(userId, userData)

// Get user statistics
const stats = await getUserStats(userId)
```

## Project Structure

```plaintext
collabsphere/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Dashboard page
│   ├── events/                  # Events pages
│   ├── teams/                   # Teams pages
│   ├── ai-suggest/              # AI suggestions page
│   └── notifications/           # Notifications page
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── auth-wrapper.tsx         # Authentication wrapper
│   ├── sidebar.tsx              # Navigation sidebar
│   ├── create-team-modal.tsx    # Team creation modal
│   ├── create-event-modal.tsx   # Event creation modal
│   └── profile-modal.tsx        # Profile editing modal
├── lib/                         # Utility libraries
│   ├── firebase.ts              # Firebase configuration
│   ├── firestore.ts             # Firestore operations
│   ├── gemini.ts                # Gemini AI integration
│   ├── types.ts                 # TypeScript types
│   ├── utils.ts                 # Utility functions
│   └── useAuthUser.ts           # Authentication hook
├── scripts/                     # Database scripts
│   └── seed-firestore-comprehensive.js
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Contributing

We welcome contributions! Please follow these steps:

### Development Workflow

1. **Fork the repository**


```shellscript
git clone https://github.com/avyuktsoni0731/CollabSphere.git
cd CollabSphere
```

2. **Create a feature branch**


```shellscript
git checkout -b feature/amazing-feature
```

3. **Make your changes**


```shellscript
# Follow the coding standards
npm run lint
npm run format
```

4. **Test your changes**


```shellscript
npm run build
npm run test
```

5. **Commit your changes**


```shellscript
git commit -m "Add amazing feature"
```

6. **Push to your branch**


```shellscript
git push origin feature/amazing-feature
```

7. **Open a Pull Request**


### Coding Standards

- **TypeScript**: Use strict typing
- **ESLint**: Follow the configured rules
- **Prettier**: Format code consistently
- **Commits**: Use conventional commit messages


### Areas for Contribution

- 🐛 **Bug fixes** and performance improvements
- ✨ **New features** and enhancements
- 📚 **Documentation** improvements
- 🎨 **UI/UX** enhancements
- 🧪 **Testing** and quality assurance
- 🌐 **Internationalization** support


## Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**


```shellscript
npm install -g vercel
vercel login
vercel
```

2. **Environment Variables**

1. Add all environment variables in Vercel dashboard
2. Ensure Firebase and Gemini AI keys are configured



3. **Deploy**


```shellscript
vercel --prod
```

### Firebase Hosting

1. **Install Firebase CLI**


```shellscript
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase**


```shellscript
firebase init hosting
```

3. **Build and Deploy**


```shellscript
npm run build
firebase deploy
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

#### Firebase Authentication Issues

```shellscript
# Error: Firebase Auth domain not authorized
# Solution: Add your domain to Firebase Console > Authentication > Settings > Authorized domains
```

#### Gemini AI API Issues

```shellscript
# Error: API key not valid
# Solution: Verify your API key in Google AI Studio and check billing setup
```

#### Build Errors

```shellscript
# Error: Module not found
# Solution: Clear cache and reinstall dependencies
rm -rf .next node_modules
npm install
npm run dev
```

#### Environment Variables

```shellscript
# Error: Environment variables not loaded
# Solution: Ensure .env.local is in root directory and variables are prefixed correctly
```

### Performance Optimization

1. **Image Optimization**

1. Use Next.js Image component
2. Implement lazy loading for large lists



2. **Database Queries**

1. Implement pagination for large datasets
2. Use Firestore query optimization



3. **Bundle Size**

1. Analyze bundle with `npm run analyze`
2. Implement code splitting for large components





### Debugging

```shellscript
# Enable debug mode
DEBUG=* npm run dev

# Check Firebase connection
firebase projects:list

# Test Gemini AI integration
node -e "console.log(process.env.NEXT_PUBLIC_GEMINI_API_KEY)"
```

## Roadmap

### Phase 1 (Current)

- ✅ Core platform functionality
- ✅ AI-powered team matching
- ✅ Event discovery and management
- ✅ User authentication and profiles


### Phase 2 (Next)

- 🔄 Real-time messaging system
- 🔄 Advanced notification system
- 🔄 Mobile app development
- 🔄 Enhanced AI recommendations


### Phase 3 (Future)

- 📋 Project management tools
- 📊 Analytics dashboard for organizers
- 🌐 Multi-university support
- 🎯 Skill assessment integration


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Google** for Gemini AI and Firebase services
- **Vercel** for hosting and deployment platform
- **shadcn** for the beautiful UI component library
- **Next.js** team for the amazing React framework
- **Open source community** for the incredible tools and libraries


## Support

- 📧 **Email**: [soniavyukt@gmail.com](mailto:support@collabsphere.dev)
- 🐛 **Issues**: [GitHub Issues](https://github.com/avyuktsoni0731/CollabSphere/issues)


---

**Built with ❤️**
