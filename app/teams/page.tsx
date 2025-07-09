"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Filter, Star, Clock, Lightbulb } from "lucide-react"
import Sidebar from "@/components/sidebar"

const teams = [
  {
    id: 1,
    name: "EcoTrack - Sustainability App",
    description:
      "Building a comprehensive mobile app to help individuals and communities track their carbon footprint, set sustainability goals, and connect with eco-friendly initiatives.",
    idea: "Create an AI-powered platform that gamifies environmental consciousness by tracking daily activities, suggesting improvements, and connecting users with local green initiatives.",
    leader: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      university: "MIT",
      major: "Environmental Engineering",
    },
    members: 2,
    maxMembers: 4,
    requiredSkills: ["React Native", "Node.js", "UI/UX Design", "Data Science"],
    currentSkills: ["Backend Development", "Environmental Science"],
    category: "Mobile App",
    stage: "MVP Development",
    commitment: "10-15 hours/week",
    duration: "3 months",
    featured: true,
    tags: ["Sustainability", "Mobile", "AI", "Social Impact"],
  },
  {
    id: 2,
    name: "StudyBuddy AI",
    description:
      "An intelligent study companion that uses machine learning to personalize learning experiences, create study schedules, and connect students with similar academic goals.",
    idea: "Develop an AI tutor that adapts to individual learning styles, provides personalized quizzes, and facilitates peer-to-peer learning through smart matching algorithms.",
    leader: {
      name: "Marcus Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      university: "Stanford",
      major: "Computer Science",
    },
    members: 3,
    maxMembers: 5,
    requiredSkills: ["Python", "Machine Learning", "React", "Database Design"],
    currentSkills: ["ML Engineering", "Backend", "Product Management"],
    category: "AI/ML",
    stage: "Research Phase",
    commitment: "15-20 hours/week",
    duration: "6 months",
    featured: false,
    tags: ["Education", "AI", "Machine Learning", "Web App"],
  },
  {
    id: 3,
    name: "CampusConnect",
    description:
      "A social platform designed specifically for university students to discover events, join clubs, find study groups, and build meaningful connections within their campus community.",
    idea: "Create a location-based social network that helps students overcome social barriers and build authentic relationships through shared interests and activities.",
    leader: {
      name: "Priya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      university: "UC Berkeley",
      major: "Information Systems",
    },
    members: 1,
    maxMembers: 4,
    requiredSkills: ["Full Stack Development", "Database Design", "Mobile Development", "UI/UX"],
    currentSkills: ["Product Design"],
    category: "Social Platform",
    stage: "Ideation",
    commitment: "8-12 hours/week",
    duration: "4 months",
    featured: false,
    tags: ["Social", "Mobile", "Community", "Networking"],
  },
  {
    id: 4,
    name: "HealthTracker Pro",
    description:
      "A comprehensive health monitoring system that integrates wearable devices, medical records, and AI analysis to provide personalized health insights and early warning systems.",
    idea: "Build a platform that democratizes health monitoring by making advanced health analytics accessible to everyone, not just healthcare professionals.",
    leader: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      university: "Johns Hopkins",
      major: "Biomedical Engineering",
    },
    members: 2,
    maxMembers: 6,
    requiredSkills: ["IoT Development", "Data Science", "Healthcare APIs", "Mobile Development", "Security"],
    currentSkills: ["Biomedical Engineering", "Data Analysis"],
    category: "HealthTech",
    stage: "Prototype",
    commitment: "20+ hours/week",
    duration: "8 months",
    featured: true,
    tags: ["Healthcare", "IoT", "Data Science", "Wearables"],
  },
  {
    id: 5,
    name: "CodeMentor Platform",
    description:
      "A peer-to-peer coding mentorship platform that matches experienced developers with beginners, featuring interactive coding sessions, project reviews, and skill assessments.",
    idea: "Create a structured mentorship ecosystem where coding knowledge is shared effectively through gamified learning paths and real-time collaboration tools.",
    leader: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      university: "Carnegie Mellon",
      major: "Software Engineering",
    },
    members: 4,
    maxMembers: 6,
    requiredSkills: ["Full Stack", "Real-time Systems", "Video Streaming", "Payment Integration"],
    currentSkills: ["Frontend", "Backend", "DevOps", "Product"],
    category: "EdTech",
    stage: "Beta Testing",
    commitment: "12-18 hours/week",
    duration: "5 months",
    featured: false,
    tags: ["Education", "Mentorship", "Coding", "Platform"],
  },
  {
    id: 6,
    name: "SmartCity Dashboard",
    description:
      "An IoT-powered city management system that collects real-time data from various urban sensors to optimize traffic flow, energy usage, and public services.",
    idea: "Develop a comprehensive urban analytics platform that helps city planners make data-driven decisions to improve quality of life for residents.",
    leader: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      university: "Georgia Tech",
      major: "Urban Planning",
    },
    members: 3,
    maxMembers: 7,
    requiredSkills: ["IoT", "Data Visualization", "Cloud Computing", "GIS", "Machine Learning"],
    currentSkills: ["Urban Planning", "Data Analysis", "Project Management"],
    category: "Smart City",
    stage: "Planning",
    commitment: "15-25 hours/week",
    duration: "12 months",
    featured: false,
    tags: ["IoT", "Smart City", "Data Viz", "Urban Tech"],
  },
]

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.requiredSkills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || team.category === selectedCategory
    const matchesStage = selectedStage === "all" || team.stage === selectedStage

    return matchesSearch && matchesCategory && matchesStage
  })

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === "featured") {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    } else if (sortBy === "members") {
      return b.maxMembers - b.members - (a.maxMembers - a.members)
    } else if (sortBy === "recent") {
      return b.id - a.id
    }
    return 0
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Team</h1>
            <p className="text-gray-600">Join exciting projects and startups looking for talented teammates</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search teams or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Social Platform">Social Platform</SelectItem>
                    <SelectItem value="HealthTech">HealthTech</SelectItem>
                    <SelectItem value="EdTech">EdTech</SelectItem>
                    <SelectItem value="Smart City">Smart City</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Project Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="Ideation">Ideation</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Research Phase">Research</SelectItem>
                    <SelectItem value="MVP Development">MVP Development</SelectItem>
                    <SelectItem value="Prototype">Prototype</SelectItem>
                    <SelectItem value="Beta Testing">Beta Testing</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured First</SelectItem>
                    <SelectItem value="members">Most Openings</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedTeams.map((team) => (
              <Card
                key={team.id}
                className={`hover:shadow-lg transition-shadow ${team.featured ? "ring-2 ring-blue-500" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        {team.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <Badge variant="outline">{team.category}</Badge>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {team.members}/{team.maxMembers} members
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <CardDescription className="text-sm">{team.description}</CardDescription>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-900">The Idea</span>
                      </div>
                      <p className="text-sm text-blue-800">{team.idea}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={team.leader.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {team.leader.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{team.leader.name}</p>
                        <p className="text-xs text-gray-500">
                          {team.leader.university} • {team.leader.major}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Stage:</span>
                        <p className="font-medium">{team.stage}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Commitment:</span>
                        <p className="font-medium">{team.commitment}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Looking for:</p>
                      <div className="flex flex-wrap gap-1">
                        {team.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Current team skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {team.currentSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {team.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs text-blue-600 border-blue-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {team.duration} project
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">Request to Join</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedTeams.length === 0 && (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
