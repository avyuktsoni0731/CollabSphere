"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, Filter, Star, Clock, Lightbulb } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { getTeams, joinTeam, hasUserJoinedTeam } from "@/lib/firestore";
import type { Team } from "@/lib/types";
import { AuthWrapper } from "@/components/auth-wrapper";
import { CreateTeamModal } from "@/components/create-team-modal";
import { useAuthUser } from "@/lib/useAuthUser";
import { toast } from "sonner";

export default function TeamsPage() {
  const { user } = useAuthUser();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [joinedTeams, setJoinedTeams] = useState<Set<string>>(new Set());

  const fetchTeams = async () => {
    try {
      const teamsData = await getTeams();
      setTeams(teamsData);

      // Check which teams the user has joined
      if (user) {
        const joinedTeamIds = new Set<string>();
        for (const team of teamsData) {
          const hasJoined = await hasUserJoinedTeam(team.id, user.uid);
          if (hasJoined) {
            joinedTeamIds.add(team.id);
          }
        }
        setJoinedTeams(joinedTeamIds);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      toast.error("Please log in to join teams");
      return;
    }

    try {
      const userName = user.displayName || user.email?.split("@")[0] || "User";
      await joinTeam(teamId, user.uid, userName);
      toast.success("Successfully requested to join team!");
      fetchTeams(); // Refresh data
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error("Failed to join team. It might be full.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.requiredSkills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || team.category === selectedCategory;
    const matchesStage =
      selectedStage === "all" || team.stage === selectedStage;

    return matchesSearch && matchesCategory && matchesStage;
  });

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === "featured") {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    } else if (sortBy === "members") {
      return b.maxMembers - b.members - (a.maxMembers - a.members);
    } else if (sortBy === "recent") {
      return b.id.localeCompare(a.id);
    }
    return 0;
  });

  return (
    <AuthWrapper>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Find Your Team
                </h1>
                <p className="text-gray-600">
                  Join exciting projects and startups looking for talented
                  teammates
                </p>
              </div>
              <CreateTeamModal onTeamCreated={fetchTeams} />
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
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Mobile App">Mobile App</SelectItem>
                      <SelectItem value="AI/ML">AI/ML</SelectItem>
                      <SelectItem value="Social Platform">
                        Social Platform
                      </SelectItem>
                      <SelectItem value="HealthTech">HealthTech</SelectItem>
                      <SelectItem value="EdTech">EdTech</SelectItem>
                      <SelectItem value="Smart City">Smart City</SelectItem>
                      <SelectItem value="Fintech">Fintech</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedStage}
                    onValueChange={setSelectedStage}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Project Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      <SelectItem value="Ideation">Ideation</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Research Phase">
                        Research Phase
                      </SelectItem>
                      <SelectItem value="MVP Development">
                        MVP Development
                      </SelectItem>
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
                  className={`hover:shadow-lg transition-shadow ${
                    team.featured ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          {team.featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
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
                      <CardDescription className="text-sm">
                        {team.description}
                      </CardDescription>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Lightbulb className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-900">
                            The Idea
                          </span>
                        </div>
                        <p className="text-sm text-blue-800">{team.idea}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={team.leader.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {team.leader.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {team.leader.name}
                          </p>
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
                        <p className="text-sm text-gray-500 mb-2">
                          Looking for:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {team.requiredSkills.map((skill) => (
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

                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          Current team skills:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {team.currentSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {team.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs text-blue-600 border-blue-200"
                          >
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
                          {joinedTeams.has(team.id) ? (
                            <Button size="sm" disabled className="bg-green-600">
                              ✓ Joined
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleJoinTeam(team.id)}
                            >
                              Request to Join
                            </Button>
                          )}
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No teams found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
