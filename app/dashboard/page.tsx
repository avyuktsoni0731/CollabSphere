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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Sparkles,
  Target,
  Trophy,
  Bell,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { AuthWrapper } from "@/components/auth-wrapper";
import { CreateTeamModal } from "@/components/create-team-modal";
import { CreateEventModal } from "@/components/create-event-modal";
import { useAuthUser } from "@/lib/useAuthUser";
import {
  getEvents,
  getTeams,
  joinEvent,
  joinTeam,
  getUserStats,
  getRecentActivity,
  hasUserJoinedEvent,
  hasUserJoinedTeam,
} from "@/lib/firestore";
import type { Event, Team } from "@/lib/types";
import { toast } from "sonner";

interface UserStats {
  teamsJoined: number;
  eventsJoined: number;
  teamsCreated: number;
  eventsCreated: number;
  skillMatches: number;
}

interface RecentActivity {
  recentTeamJoins: Team[];
  recentEventJoins: Event[];
  pendingInvitations: number;
}

export default function DashboardPage() {
  const { user } = useAuthUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    teamsJoined: 0,
    eventsJoined: 0,
    teamsCreated: 0,
    eventsCreated: 0,
    skillMatches: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({
    recentTeamJoins: [],
    recentEventJoins: [],
    pendingInvitations: 0,
  });
  const [loading, setLoading] = useState(true);

  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());
  const [joinedTeams, setJoinedTeams] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    try {
      const [eventsData, teamsData] = await Promise.all([
        getEvents().catch(() => []),
        getTeams().catch(() => []),
      ]);
      setEvents(eventsData || []);
      setTeams(teamsData || []);

      // Check join status for events and teams
      if (user) {
        const [stats, activity] = await Promise.all([
          getUserStats(user.uid),
          getRecentActivity(user.uid),
        ]);
        setUserStats(stats);
        setRecentActivity(activity);

        // Check which events and teams the user has joined
        const joinedEventIds = new Set<string>();
        const joinedTeamIds = new Set<string>();

        for (const event of eventsData || []) {
          const hasJoined = await hasUserJoinedEvent(event.id, user.uid);
          if (hasJoined) {
            joinedEventIds.add(event.id);
          }
        }

        for (const team of teamsData || []) {
          const hasJoined = await hasUserJoinedTeam(team.id, user.uid);
          if (hasJoined) {
            joinedTeamIds.add(team.id);
          }
        }

        setJoinedEvents(joinedEventIds);
        setJoinedTeams(joinedTeamIds);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast.error("Please log in to join events");
      return;
    }

    try {
      await joinEvent(eventId, user.uid);
      toast.success("Successfully joined event!");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("Failed to join event. It might be full.");
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      toast.error("Please log in to join teams");
      return;
    }

    try {
      const userName = user.displayName || user.email?.split("@")[0] || "User";
      await joinTeam(teamId, user.uid, userName);
      toast.success("Successfully requested to join team!");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error("Failed to join team. It might be full.");
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.displayName || user.email?.split("@")[0] || "User";
  };

  // Get recommended events and teams (not joined yet)
  const recommendedEvents = events
    .filter((event) => !event.participantIds?.includes(user?.uid || ""))
    .slice(0, 3);

  const recommendedTeams = teams
    .filter(
      (team) =>
        !team.memberIds?.includes(user?.uid || "") &&
        team.leader?.id !== user?.uid &&
        team.members < team.maxMembers
    )
    .slice(0, 3);

  if (loading) {
    return (
      <AuthWrapper>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 lg:ml-0">
            <div className="p-6 lg:p-8">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-xl mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-black to-cyan-800 rounded-xl p-6 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {getUserDisplayName()}! 👋
                  </h1>
                  <p className="text-blue-100">
                    {recentActivity.pendingInvitations > 0
                      ? `You have ${recentActivity.pendingInvitations} new team invitations and ${recommendedEvents.length} recommended events.`
                      : `Discover ${recommendedEvents.length} new events and ${recommendedTeams.length} teams looking for members.`}
                  </p>
                </div>
                <div className="hidden md:flex gap-2">
                  <CreateTeamModal onTeamCreated={fetchData} />
                  <CreateEventModal onEventCreated={fetchData} />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Teams Joined
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStats.teamsJoined}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {userStats.teamsCreated > 0
                      ? `+${userStats.teamsCreated} created by you`
                      : "Join your first team"}
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
                  <div className="text-2xl font-bold">
                    {userStats.eventsJoined}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {userStats.eventsCreated > 0
                      ? `+${userStats.eventsCreated} organized by you`
                      : "Join your first event"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Skill Matches
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStats.skillMatches}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Teams matching your skills
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Invites
                  </CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {recentActivity.pendingInvitations}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {recentActivity.pendingInvitations > 0
                      ? "Check notifications"
                      : "No pending invites"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recommended Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Recommended Events
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/events">View All</a>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Events that match your interests and skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedEvents.length ? (
                    recommendedEvents.map((event) => (
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
                            {event.tags?.slice(0, 2).map((tag) => (
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
                        {joinedEvents.has(event.id) ? (
                          <Button size="sm" disabled className="bg-green-600">
                            ✓ Joined
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleJoinEvent(event.id)}
                          >
                            Join
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        All caught up!
                      </p>
                      <p className="text-xs text-gray-500">
                        You've joined all available events that match your
                        profile.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommended Teams */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Teams for You
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/teams">View All</a>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Teams looking for your skills and expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedTeams.length ? (
                    recommendedTeams.map((team) => (
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
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {team.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {team.requiredSkills?.slice(0, 2).map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {team.requiredSkills?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{team.requiredSkills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {team.leader.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">
                              {team.leader.name}
                            </span>
                          </div>
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No new teams right now
                      </p>
                      <p className="text-xs text-gray-500">
                        Check back later or create your own team!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Section */}
            {(recentActivity.recentTeamJoins.length > 0 ||
              recentActivity.recentEventJoins.length > 0) && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Your Recent Activity
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recentActivity.recentTeamJoins.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Recently Joined Teams
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recentActivity.recentTeamJoins.map((team) => (
                            <div
                              key={team.id}
                              className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-green-900">
                                  {team.name}
                                </p>
                                <p className="text-sm text-green-700">
                                  {team.category}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Joined
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {recentActivity.recentEventJoins.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Recently Joined Events
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recentActivity.recentEventJoins.map((event) => (
                            <div
                              key={event.id}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-blue-900">
                                  {event.name}
                                </p>
                                <p className="text-sm text-blue-700">
                                  {event.date}
                                </p>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">
                                Registered
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
