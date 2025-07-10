"use client";

import type React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sparkles,
  Send,
  Users,
  Star,
  MessageCircle,
  Code,
  Lightbulb,
  Zap,
  Target,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { getTeams, getUsers } from "@/lib/firestore";
import { analyzeProjectIdea, extractSkillsFromDescription } from "@/lib/gemini";
import type { Team, User, AITeammateMatch } from "@/lib/types";

interface RecommendedTeam {
  team: Team;
  score: number;
  reasoning: string;
}

export default function AISuggestPage() {
  const [ideaDescription, setIdeaDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [projectAnalysis, setProjectAnalysis] = useState("");
  const [recommendedTeams, setRecommendedTeams] = useState<RecommendedTeam[]>(
    []
  );
  const [suggestedTeammates, setSuggestedTeammates] = useState<
    AITeammateMatch[]
  >([]);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teams, users] = await Promise.all([getTeams(), getUsers()]);
        setAvailableTeams(teams);
        setAvailableUsers(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaDescription.trim()) return;

    setIsGenerating(true);
    setShowSuggestions(false);

    try {
      // Extract skills from the description first
      const extractedSkills = await extractSkillsFromDescription(
        ideaDescription
      );
      console.log("Extracted skills:", extractedSkills);

      // Get AI analysis and recommendations
      const aiResponse = await analyzeProjectIdea(
        ideaDescription,
        availableTeams,
        availableUsers
      );

      setProjectAnalysis(aiResponse.projectAnalysis);
      setRecommendedTeams(aiResponse.recommendedTeams);
      setSuggestedTeammates(aiResponse.suggestedTeammates);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      // Show fallback suggestions
      setProjectAnalysis(
        "Unable to analyze your project idea at this time. Please try again later."
      );
      setRecommendedTeams([]);
      setSuggestedTeammates([]);
      setShowSuggestions(true);
    } finally {
      setIsGenerating(false);
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
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
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
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Team Builder
                </h1>
                <p className="text-gray-600">
                  Describe your idea and let AI find your perfect teammates
                </p>
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
                    Tell us about your project vision and what kind of help you
                    need
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">2. AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Gemini AI analyzes your needs and matches you with
                    compatible teammates and teams
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Connect & Build</h3>
                  <p className="text-sm text-gray-600">
                    Connect with suggested teammates and teams to start building
                  </p>
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
                Be specific about your vision, required skills, and what kind of
                teammates you're looking for
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
                  <p className="text-sm text-gray-500">
                    {ideaDescription.length}/1000 characters
                  </p>
                  <Button
                    type="submit"
                    disabled={!ideaDescription.trim() || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing with Gemini AI...
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
                  <h3 className="text-lg font-semibold mb-2">
                    Gemini AI is analyzing your idea...
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Finding the perfect teammates and teams based on your
                    requirements
                  </p>
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

          {/* AI Analysis Results */}
          {showSuggestions && (
            <div className="space-y-8">
              {/* Project Analysis */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Target className="h-5 w-5" />
                    Project Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-800">{projectAnalysis}</p>
                </CardContent>
              </Card>

              {/* Recommended Teams */}
              {recommendedTeams.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Recommended Teams to Join
                      </h2>
                      <p className="text-gray-600">
                        Existing teams that align with your project idea
                      </p>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                      <Users className="h-3 w-3 mr-1" />
                      {recommendedTeams.length} Teams Found
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {recommendedTeams.map(({ team, score, reasoning }) => (
                      <Card
                        key={team.id}
                        className="hover:shadow-lg transition-shadow border-green-200"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {team.name}
                              </CardTitle>
                              <p className="text-sm text-gray-600 mt-1">
                                {team.category} • {team.stage}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {score}% Match
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                              {team.description}
                            </p>

                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-green-900 mb-1">
                                Why this team matches:
                              </p>
                              <p className="text-sm text-green-800">
                                {reasoning}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">
                                {team.members}/{team.maxMembers} members
                              </span>
                              <span className="text-gray-500">
                                {team.commitment}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {team.requiredSkills.slice(0, 3).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {team.requiredSkills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{team.requiredSkills.length - 3} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-transparent"
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                Request to Join
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Individual Teammates */}
              {suggestedTeammates.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Suggested Individual Teammates
                      </h2>
                      <p className="text-gray-600">
                        Students who could be perfect collaborators for your
                        project
                      </p>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Powered
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {suggestedTeammates.map(
                      ({ user, matchScore, commonInterests, reasoning }) => (
                        <Card
                          key={user.id}
                          className="hover:shadow-lg transition-shadow"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage
                                    src={user.avatar || "/placeholder.svg"}
                                  />
                                  <AvatarFallback>
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-lg">
                                    {user.name}
                                  </CardTitle>
                                  <p className="text-sm text-gray-600">
                                    {user.university}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {user.major} • {user.year}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-purple-100 text-purple-800 mb-2">
                                  {matchScore}% Match
                                </Badge>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                  {user.rating}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-sm text-gray-600">
                                {user.bio}
                              </p>

                              <div className="bg-purple-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-purple-900 mb-1">
                                  Why they're a great match:
                                </p>
                                <p className="text-sm text-purple-800">
                                  {reasoning}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-gray-900 mb-2">
                                  Skills
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {user.skills.slice(0, 4).map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                  {user.skills.length > 4 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{user.skills.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-gray-900 mb-2">
                                  Common Interests
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {commonInterests.map((interest) => (
                                    <Badge
                                      key={interest}
                                      variant="outline"
                                      className="text-xs text-purple-600 border-purple-200"
                                    >
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">
                                    Experience:
                                  </span>
                                  <p className="font-medium">
                                    {user.experience}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Projects:
                                  </span>
                                  <p className="font-medium">
                                    {user.projects} completed
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Availability:
                                  </span>
                                  <p className="font-medium">
                                    {user.availability}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Rating:</span>
                                  <p className="font-medium">
                                    {user.rating}/5.0
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 bg-transparent"
                                >
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
                      )
                    )}
                  </div>
                </div>
              )}

              {/* No Results */}
              {recommendedTeams.length === 0 &&
                suggestedTeammates.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No matches found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        We couldn't find any teams or teammates that match your
                        current project idea. Try refining your description or
                        check back later as new teams join the platform.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowSuggestions(false)}
                      >
                        Try Different Description
                      </Button>
                    </CardContent>
                  </Card>
                )}

              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  className="mr-4 bg-transparent"
                  onClick={() => setShowSuggestions(false)}
                >
                  Refine Search
                </Button>
                <Button onClick={handleSubmit} disabled={isGenerating}>
                  Get More Suggestions
                </Button>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to find your dream team?
                </h3>
                <p className="text-gray-500 mb-6">
                  Describe your project idea above and let Gemini AI find the
                  perfect teammates and teams for you.
                </p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span>✨ Gemini AI-powered matching</span>
                  <span>🎯 Skill-based recommendations</span>
                  <span>⚡ Real-time analysis</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
