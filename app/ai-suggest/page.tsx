"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, Send, Users, Star, MessageCircle, Code, Lightbulb, Zap } from "lucide-react"
import Sidebar from "@/components/sidebar"

const suggestedTeammates = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=60&width=60",
    university: "Stanford University",
    major: "Computer Science",
    year: "Junior",
    skills: ["React", "Node.js", "Python", "UI/UX Design"],
    experience: "2 years",
    projects: 8,
    rating: 4.9,
    bio: "Passionate full-stack developer with experience in building scalable web applications. Love working on projects that make a positive impact.",
    availability: "15-20 hours/week",
    matchScore: 95,
    commonInterests: ["Web Development", "AI", "Sustainability"],
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg?height=60&width=60",
    university: "MIT",
    major: "Environmental Engineering",
    year: "Senior",
    skills: ["Data Science", "Python", "Research", "Sustainability"],
    experience: "3 years",
    projects: 12,
    rating: 4.8,
    bio: "Environmental engineer passionate about using technology to solve climate challenges. Strong background in data analysis and research.",
    availability: "10-15 hours/week",
    matchScore: 92,
    commonInterests: ["Sustainability", "Data Science", "Environmental Tech"],
  },
  {
    id: 3,
    name: "David Kim",
    avatar: "/placeholder.svg?height=60&width=60",
    university: "UC Berkeley",
    major: "Business Administration",
    year: "Senior",
    skills: ["Product Management", "Marketing", "Business Strategy", "Analytics"],
    experience: "2 years",
    projects: 6,
    rating: 4.7,
    bio: "Business-minded student with a passion for product development and go-to-market strategies. Experience with startup environments.",
    availability: "12-18 hours/week",
    matchScore: 88,
    commonInterests: ["Product Development", "Startups", "Marketing"],
  },
  {
    id: 4,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=60&width=60",
    university: "Carnegie Mellon",
    major: "Human-Computer Interaction",
    year: "Graduate Student",
    skills: ["UI/UX Design", "User Research", "Figma", "Prototyping"],
    experience: "4 years",
    projects: 15,
    rating: 4.9,
    bio: "UX designer focused on creating intuitive and accessible digital experiences. Strong background in user research and design thinking.",
    availability: "20+ hours/week",
    matchScore: 90,
    commonInterests: ["Design", "User Experience", "Accessibility"],
  },
]

export default function AISuggestPage() {
  const [ideaDescription, setIdeaDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ideaDescription.trim()) return

    setIsGenerating(true)
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false)
      setShowSuggestions(true)
    }, 3000)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Team Builder</h1>
                <p className="text-gray-600">Describe your idea and let AI find your perfect teammates</p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Describe Your Idea</h3>
                  <p className="text-sm text-gray-600">
                    Tell us about your project vision and what kind of help you need
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">2. AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Our AI analyzes your needs and matches you with compatible teammates
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Connect & Build</h3>
                  <p className="text-sm text-gray-600">Connect with suggested teammates and start building together</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Describe Your Project Idea
              </CardTitle>
              <CardDescription>
                Be specific about your vision, required skills, and what kind of teammates you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="I want to build a mobile app that helps college students track their carbon footprint and connect with sustainability initiatives on campus. I'm looking for teammates with experience in React Native, UI/UX design, and environmental science. The app should gamify eco-friendly behaviors and provide personalized recommendations..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isGenerating}
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{ideaDescription.length}/500 characters</p>
                  <Button
                    type="submit"
                    disabled={!ideaDescription.trim() || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Find My Team
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isGenerating && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI is analyzing your idea...</h3>
                  <p className="text-gray-600 mb-4">Finding the perfect teammates based on your requirements</p>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Suggestions */}
          {showSuggestions && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Suggested Teammates</h2>
                  <p className="text-gray-600">Based on your project description, here are the best matches</p>
                </div>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {suggestedTeammates.map((teammate) => (
                  <Card key={teammate.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={teammate.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {teammate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{teammate.name}</CardTitle>
                            <p className="text-sm text-gray-600">{teammate.university}</p>
                            <p className="text-sm text-gray-500">
                              {teammate.major} • {teammate.year}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800 mb-2">{teammate.matchScore}% Match</Badge>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            {teammate.rating}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">{teammate.bio}</p>

                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {teammate.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Common Interests</p>
                          <div className="flex flex-wrap gap-1">
                            {teammate.commonInterests.map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs text-blue-600 border-blue-200">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Experience:</span>
                            <p className="font-medium">{teammate.experience}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Projects:</span>
                            <p className="font-medium">{teammate.projects} completed</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Availability:</span>
                            <p className="font-medium">{teammate.availability}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Rating:</span>
                            <p className="font-medium">{teammate.rating}/5.0</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button size="sm" className="flex-1">
                            Connect
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" className="mr-4 bg-transparent">
                  Refine Search
                </Button>
                <Button>Get More Suggestions</Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!showSuggestions && !isGenerating && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to find your dream team?</h3>
                <p className="text-gray-500 mb-6">
                  Describe your project idea above and let our AI find the perfect teammates for you.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span>✨ AI-powered matching</span>
                  <span>🎯 Skill-based recommendations</span>
                  <span>⚡ Instant results</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
