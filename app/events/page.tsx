"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Clock, Search, Filter, Star } from "lucide-react"
import Sidebar from "@/components/sidebar"

const events = [
  {
    id: 1,
    name: "HackMIT 2024",
    description:
      "MIT's premier hackathon bringing together students from around the world to build innovative solutions.",
    date: "March 15-17, 2024",
    location: "MIT Campus, Cambridge",
    tags: ["AI", "Web Dev", "Mobile", "Hardware"],
    participants: 250,
    maxParticipants: 300,
    status: "upcoming",
    difficulty: "All Levels",
    prizes: "$50,000",
    organizer: "MIT Computer Science",
    featured: true,
  },
  {
    id: 2,
    name: "Stanford TreeHacks",
    description: "Stanford's annual hackathon focused on creating technology for social good and environmental impact.",
    date: "March 22-24, 2024",
    location: "Stanford University",
    tags: ["IoT", "Hardware", "AI", "Sustainability"],
    participants: 180,
    maxParticipants: 200,
    status: "upcoming",
    difficulty: "Intermediate",
    prizes: "$30,000",
    organizer: "Stanford CS Department",
  },
  {
    id: 3,
    name: "Berkeley AI Hackathon",
    description:
      "Dive deep into artificial intelligence and machine learning with industry mentors and cutting-edge tools.",
    date: "April 5-7, 2024",
    location: "UC Berkeley",
    tags: ["AI", "ML", "Data Science", "Python"],
    participants: 120,
    maxParticipants: 150,
    status: "registration",
    difficulty: "Advanced",
    prizes: "$25,000",
    organizer: "Berkeley AI Society",
  },
  {
    id: 4,
    name: "UCLA DevFest",
    description: "A celebration of development across all platforms - web, mobile, desktop, and emerging technologies.",
    date: "April 12-14, 2024",
    location: "UCLA Campus",
    tags: ["Web Dev", "Mobile", "Cloud", "DevOps"],
    participants: 95,
    maxParticipants: 180,
    status: "registration",
    difficulty: "All Levels",
    prizes: "$20,000",
    organizer: "UCLA Tech Society",
  },
  {
    id: 5,
    name: "Caltech Space Tech Challenge",
    description: "Build solutions for space exploration and satellite technology with NASA mentors.",
    date: "April 19-21, 2024",
    location: "Caltech",
    tags: ["Space Tech", "Hardware", "Embedded", "C++"],
    participants: 60,
    maxParticipants: 80,
    status: "upcoming",
    difficulty: "Advanced",
    prizes: "$40,000",
    organizer: "Caltech Space Program",
  },
  {
    id: 6,
    name: "UCSD Health Hack",
    description: "Healthcare-focused hackathon addressing real-world medical challenges with technology solutions.",
    date: "May 3-5, 2024",
    location: "UC San Diego",
    tags: ["Healthcare", "AI", "Mobile", "Data Science"],
    participants: 140,
    maxParticipants: 160,
    status: "registration",
    difficulty: "Intermediate",
    prizes: "$35,000",
    organizer: "UCSD Medical School",
  },
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDomain =
      selectedDomain === "all" || event.tags.some((tag) => tag.toLowerCase().includes(selectedDomain.toLowerCase()))
    const matchesDifficulty = selectedDifficulty === "all" || event.difficulty === selectedDifficulty

    return matchesSearch && matchesDomain && matchesDifficulty
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date.split("-")[0]).getTime() - new Date(b.date.split("-")[0]).getTime()
    } else if (sortBy === "popularity") {
      return b.participants - a.participants
    } else if (sortBy === "prizes") {
      return Number.parseInt(b.prizes.replace(/[^0-9]/g, "")) - Number.parseInt(a.prizes.replace(/[^0-9]/g, ""))
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
            <p className="text-gray-600">Find hackathons, workshops, and tech events near you</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tech Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    <SelectItem value="ai">AI & ML</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="iot">IoT</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="All Levels">Beginner Friendly</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="prizes">Prize Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedEvents.map((event) => (
              <Card
                key={event.id}
                className={`hover:shadow-lg transition-shadow ${event.featured ? "ring-2 ring-blue-500" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        {event.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                      <CardDescription className="text-sm">{event.description}</CardDescription>
                    </div>
                    <Badge variant={event.status === "upcoming" ? "default" : "secondary"} className="ml-2">
                      {event.status === "upcoming" ? "Upcoming" : "Open Registration"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {event.participants}/{event.maxParticipants} participants
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.difficulty} • {event.prizes} in prizes
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <span className="text-sm text-gray-500">by {event.organizer}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">{event.status === "upcoming" ? "Join Event" : "Register"}</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedEvents.length === 0 && (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
