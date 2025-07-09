import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Users, Calendar, Sparkles, MessageCircle, Check, X, Clock } from "lucide-react"
import Sidebar from "@/components/sidebar"

const notifications = [
  {
    id: 1,
    type: "team_invitation",
    title: "Team Invitation",
    message: "Sarah Chen invited you to join 'EcoTrack - Sustainability App'",
    timestamp: "2 minutes ago",
    unread: true,
    avatar: "/placeholder.svg?height=40&width=40",
    actionable: true,
  },
  {
    id: 2,
    type: "ai_suggestion",
    title: "New AI Suggestion",
    message: "We found 3 new potential teammates for your StudyBuddy AI project",
    timestamp: "1 hour ago",
    unread: true,
    avatar: null,
    actionable: true,
  },
  {
    id: 3,
    type: "event_reminder",
    title: "Event Reminder",
    message: "HackMIT 2024 registration closes in 24 hours",
    timestamp: "3 hours ago",
    unread: true,
    avatar: null,
    actionable: false,
  },
  {
    id: 4,
    type: "team_update",
    title: "Team Update",
    message: "Marcus Johnson updated the project timeline for StudyBuddy AI",
    timestamp: "5 hours ago",
    unread: false,
    avatar: "/placeholder.svg?height=40&width=40",
    actionable: false,
  },
  {
    id: 5,
    type: "message",
    title: "New Message",
    message: "Priya Patel sent you a message about CampusConnect collaboration",
    timestamp: "1 day ago",
    unread: false,
    avatar: "/placeholder.svg?height=40&width=40",
    actionable: true,
  },
  {
    id: 6,
    type: "event_update",
    title: "Event Update",
    message: "Stanford TreeHacks added new workshops and mentorship sessions",
    timestamp: "2 days ago",
    unread: false,
    avatar: null,
    actionable: false,
  },
  {
    id: 7,
    type: "team_invitation",
    title: "Team Invitation",
    message: "David Kim invited you to join 'HealthTracker Pro' as a Frontend Developer",
    timestamp: "3 days ago",
    unread: false,
    avatar: "/placeholder.svg?height=40&width=40",
    actionable: true,
  },
  {
    id: 8,
    type: "ai_suggestion",
    title: "AI Match Update",
    message: "Your compatibility score with Alex Rodriguez increased to 94%",
    timestamp: "1 week ago",
    unread: false,
    avatar: null,
    actionable: false,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "team_invitation":
      return <Users className="h-5 w-5 text-blue-600" />
    case "ai_suggestion":
      return <Sparkles className="h-5 w-5 text-purple-600" />
    case "event_reminder":
    case "event_update":
      return <Calendar className="h-5 w-5 text-green-600" />
    case "message":
      return <MessageCircle className="h-5 w-5 text-orange-600" />
    case "team_update":
      return <Bell className="h-5 w-5 text-gray-600" />
    default:
      return <Bell className="h-5 w-5 text-gray-600" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "team_invitation":
      return "bg-blue-100"
    case "ai_suggestion":
      return "bg-purple-100"
    case "event_reminder":
    case "event_update":
      return "bg-green-100"
    case "message":
      return "bg-orange-100"
    case "team_update":
      return "bg-gray-100"
    default:
      return "bg-gray-100"
  }
}

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Stay updated with your teams, events, and AI suggestions</p>
            </div>
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} unread</Badge>}
              <Button variant="outline" size="sm">
                Mark All Read
              </Button>
            </div>
          </div>

          {/* Notification Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Invites</p>
                    <p className="text-2xl font-bold text-blue-600">2</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Suggestions</p>
                    <p className="text-2xl font-bold text-purple-600">2</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Event Updates</p>
                    <p className="text-2xl font-bold text-green-600">2</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Messages</p>
                    <p className="text-2xl font-bold text-orange-600">1</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest notifications and updates</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${notification.unread ? "bg-blue-50/50" : ""}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}
                      >
                        {notification.avatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{notification.message.split(" ")[0][0]}</AvatarFallback>
                          </Avatar>
                        ) : (
                          getNotificationIcon(notification.type)
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <div className="flex items-center space-x-2">
                            {notification.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{notification.message}</p>

                        {notification.actionable && (
                          <div className="flex space-x-2">
                            {notification.type === "team_invitation" && (
                              <>
                                <Button size="sm" className="h-8">
                                  <Check className="h-3 w-3 mr-1" />
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 bg-transparent">
                                  <X className="h-3 w-3 mr-1" />
                                  Decline
                                </Button>
                              </>
                            )}
                            {notification.type === "ai_suggestion" && (
                              <Button size="sm" variant="outline" className="h-8 bg-transparent">
                                View Suggestions
                              </Button>
                            )}
                            {notification.type === "message" && (
                              <Button size="sm" variant="outline" className="h-8 bg-transparent">
                                Reply
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Empty State (if no notifications) */}
          {notifications.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-gray-500">
                  When you receive team invitations, AI suggestions, or event updates, they'll appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
