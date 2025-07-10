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
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Filter,
  Star,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { getEvents, joinEvent, hasUserJoinedEvent } from "@/lib/firestore";
import type { Event } from "@/lib/types";
import { AuthWrapper } from "@/components/auth-wrapper";
import { CreateEventModal } from "@/components/create-event-modal";
import { useAuthUser } from "@/lib/useAuthUser";
import { toast } from "sonner";

export default function EventsPage() {
  const { user } = useAuthUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());

  const fetchEvents = async () => {
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);

      // Check which events the user has joined
      if (user) {
        const joinedEventIds = new Set<string>();
        for (const event of eventsData) {
          const hasJoined = await hasUserJoinedEvent(event.id, user.uid);
          if (hasJoined) {
            joinedEventIds.add(event.id);
          }
        }
        setJoinedEvents(joinedEventIds);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast.error("Please log in to join events");
      return;
    }

    try {
      await joinEvent(eventId, user.uid);
      toast.success("Successfully joined event!");
      fetchEvents(); // Refresh data
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("Failed to join event. It might be full.");
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
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain =
      selectedDomain === "all" ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(selectedDomain.toLowerCase())
      );
    const matchesDifficulty =
      selectedDifficulty === "all" || event.difficulty === selectedDifficulty;

    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(a.date.split("-")[0]).getTime() -
        new Date(b.date.split("-")[0]).getTime()
      );
    } else if (sortBy === "popularity") {
      return b.participants - a.participants;
    } else if (sortBy === "prizes") {
      return (
        Number.parseInt(b.prizes.replace(/[^0-9]/g, "")) -
        Number.parseInt(a.prizes.replace(/[^0-9]/g, ""))
      );
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
                  Discover Events
                </h1>
                <p className="text-gray-600">
                  Find hackathons, workshops, and tech events near you
                </p>
              </div>
              <CreateEventModal onEventCreated={fetchEvents} />
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
                  <Select
                    value={selectedDomain}
                    onValueChange={setSelectedDomain}
                  >
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
                  <Select
                    value={selectedDifficulty}
                    onValueChange={setSelectedDifficulty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="All Levels">
                        Beginner Friendly
                      </SelectItem>
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
                  className={`hover:shadow-lg transition-shadow ${
                    event.featured ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {event.name}
                          </CardTitle>
                          {event.featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          {event.description}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          event.status === "upcoming" ? "default" : "secondary"
                        }
                        className="ml-2"
                      >
                        {event.status === "upcoming"
                          ? "Upcoming"
                          : "Open Registration"}
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
                        {event.participants}/{event.maxParticipants}{" "}
                        participants
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.difficulty} • {event.prizes} in prizes
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <span className="text-sm text-gray-500">
                          by {event.organizer}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {joinedEvents.has(event.id) ? (
                            <Button size="sm" disabled className="bg-green-600">
                              ✓ Joined
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleJoinEvent(event.id)}
                            >
                              {event.status === "upcoming"
                                ? "Join Event"
                                : "Register"}
                            </Button>
                          )}
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No events found
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
