"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users, TrendingUp, Plus, Clock, MapPin } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";

import { useAuthUser } from "@/lib/useAuthUser";

const recentEvents = [
  {
    id: 1,
    name: "HackMIT 2024",
    date: "March 15-17, 2024",
    location: "MIT Campus",
    tags: ["AI", "Web Dev", "Mobile"],
    participants: 250,
    status: "upcoming",
  },
  {
    id: 2,
    name: "Stanford TreeHacks",
    date: "March 22-24, 2024",
    location: "Stanford University",
    tags: ["IoT", "Hardware", "AI"],
    participants: 180,
    status: "upcoming",
  },
  {
    id: 3,
    name: "Berkeley AI Hackathon",
    date: "April 5-7, 2024",
    location: "UC Berkeley",
    tags: ["AI", "ML", "Data Science"],
    participants: 120,
    status: "registration",
  },
];

const recentTeams = [
  {
    id: 1,
    name: "EcoTrack - Sustainability App",
    description: "Building a mobile app to track personal carbon footprint",
    skills: ["React Native", "Node.js", "UI/UX"],
    members: 2,
    maxMembers: 4,
    leader: "Sarah Chen",
  },
  {
    id: 2,
    name: "StudyBuddy AI",
    description: "AI-powered study companion for college students",
    skills: ["Python", "Machine Learning", "Frontend"],
    members: 3,
    maxMembers: 5,
    leader: "Marcus Johnson",
  },
  {
    id: 3,
    name: "CampusConnect",
    description: "Social platform for university event discovery",
    skills: ["Full Stack", "Database", "Mobile"],
    members: 1,
    maxMembers: 4,
    leader: "Priya Patel",
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuthUser();

  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          {/* Welcome Banner */}
          <div className="bg-accent-foreground rounded-xl p-6 text-white mb-8">
            {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8"> */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {user?.displayName}! 👋
                </h1>
                <p className="text-blue-100">
                  You have 3 new team invitations and 2 upcoming events this
                  week.
                </p>
              </div>
              <div className="hidden md:block">
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Events Joined
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">+2 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Connections
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+5 this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Events
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push("/events");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    View All
                  </Button>
                </CardTitle>
                <CardDescription>
                  Discover upcoming hackathons and tech events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {event.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Teams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Open Teams
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push("/teams");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    View All
                  </Button>
                </CardTitle>
                <CardDescription>
                  Join exciting projects looking for teammates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTeams.map((team) => (
                  <div
                    key={team.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {team.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {team.members}/{team.maxMembers} members
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {team.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {team.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {team.leader
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">
                          {team.leader}
                        </span>
                      </div>
                      <Button size="sm">Request to Join</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
