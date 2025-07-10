"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Plus, X } from "lucide-react";
import { useAuthUser } from "@/lib/useAuthUser";
import { addUser, updateUser, getUserByEmail } from "@/lib/firestore";
import { toast } from "sonner";
import type { User as UserType } from "@/lib/types";

interface ProfileModalProps {
  onProfileUpdated?: () => void;
}

export function ProfileModal({ onProfileUpdated }: ProfileModalProps) {
  const { user } = useAuthUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    major: "",
    year: "",
    bio: "",
    experience: "",
    availability: "",
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState("");

  const years = [
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "Graduate",
    "PhD",
  ];
  const experiences = [
    "< 1 year",
    "1 year",
    "1.5 years",
    "2 years",
    "2.5 years",
    "3 years",
    "3+ years",
    "4+ years",
    "5+ years",
  ];
  const availabilities = [
    "5-10 hours/week",
    "10-15 hours/week",
    "15-20 hours/week",
    "20-25 hours/week",
    "25-30 hours/week",
    "30+ hours/week",
  ];

  useEffect(() => {
    if (user && open) {
      const loadProfile = async () => {
        try {
          // Try to find existing user profile by email
          const existingUser = await getUserByEmail(user.email || "");
          if (existingUser) {
            setExistingProfile(existingUser);
            setFormData({
              name:
                existingUser.name ||
                user.displayName ||
                user.email?.split("@")[0] ||
                "",
              university: existingUser.university || "",
              major: existingUser.major || "",
              year: existingUser.year || "",
              bio: existingUser.bio || "",
              experience: existingUser.experience || "",
              availability: existingUser.availability || "",
              skills: existingUser.skills || [],
            });
          } else {
            // Set default values from Firebase Auth if no profile exists
            setFormData({
              name: user.displayName || user.email?.split("@")[0] || "",
              university: "",
              major: "",
              year: "",
              bio: "",
              experience: "",
              availability: "",
              skills: [],
            });
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          // Fallback to Firebase Auth data
          setFormData({
            name: user.displayName || user.email?.split("@")[0] || "",
            university: "",
            major: "",
            year: "",
            bio: "",
            experience: "",
            availability: "",
            skills: [],
          });
        }
      };
      loadProfile();
    }
  }, [user, open]);

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        ...formData,
        email: user.email || "",
        avatar: user.photoURL || "/placeholder.svg?height=60&width=60",
        projects: existingProfile?.projects || 0,
        rating: existingProfile?.rating || 5.0,
      };

      if (existingProfile) {
        // Update existing profile
        await updateUser(existingProfile.id, profileData);
        toast.success("Profile updated successfully!");
      } else {
        // Create new profile
        await addUser(profileData);
        toast.success("Profile created successfully!");
      }

      setOpen(false);
      onProfileUpdated?.();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <User className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information to help teammates find you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || "/placeholder.svg"} />
              <AvatarFallback>
                {formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{user?.email}</h3>
              <p className="text-sm text-gray-500">
                Profile photo from your Google account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University *</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    university: e.target.value,
                  }))
                }
                placeholder="e.g., Stanford University"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major">Major *</Label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, major: e.target.value }))
                }
                placeholder="e.g., Computer Science"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Academic Year *</Label>
              <Select
                value={formData.year}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, year: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Tell others about yourself, your interests, and what you're passionate about..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level *</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, experience: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {experiences.map((exp) => (
                    <SelectItem key={exp} value={exp}>
                      {exp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability *</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, availability: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilities.map((avail) => (
                    <SelectItem key={avail} value={avail}>
                      {avail}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills *</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
            {formData.skills.length === 0 && (
              <p className="text-sm text-gray-500">
                Add at least one skill to help teammates find you
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || formData.skills.length === 0}
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
