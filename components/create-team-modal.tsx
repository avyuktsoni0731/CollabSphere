"use client";

import type React from "react";

import { useState } from "react";
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
import { Plus, X } from "lucide-react";
import { addTeam } from "@/lib/firestore";
import { useAuthUser } from "@/lib/useAuthUser";
import { toast } from "sonner";

interface CreateTeamModalProps {
  onTeamCreated?: () => void;
}

export function CreateTeamModal({ onTeamCreated }: CreateTeamModalProps) {
  const { user } = useAuthUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    idea: "",
    category: "",
    stage: "",
    commitment: "",
    duration: "",
    maxMembers: 4,
    requiredSkills: [] as string[],
    tags: [] as string[],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");

  const categories = [
    "Mobile App",
    "AI/ML",
    "Social Platform",
    "HealthTech",
    "EdTech",
    "Smart City",
    "Fintech",
    "Gaming",
    "IoT",
    "Blockchain",
  ];

  const stages = [
    "Ideation",
    "Planning",
    "Research Phase",
    "MVP Development",
    "Prototype",
    "Beta Testing",
    "Launch Ready",
  ];

  const commitments = [
    "5-10 hours/week",
    "10-15 hours/week",
    "15-20 hours/week",
    "20-25 hours/week",
    "25+ hours/week",
  ];

  const durations = [
    "1 month",
    "2 months",
    "3 months",
    "4 months",
    "5 months",
    "6+ months",
  ];

  const addSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create a team");
      return;
    }

    setLoading(true);
    try {
      const teamData = {
        ...formData,
        leader: {
          name: user.displayName || user.email?.split("@")[0] || "User",
          avatar: user.photoURL || "/placeholder.svg?height=40&width=40",
          university: "Your University", // This should come from user profile
          major: "Your Major", // This should come from user profile
        },
        members: 1,
        currentSkills: [], // This should come from user profile
        featured: false,
      };

      await addTeam(teamData);
      toast.success("Team created successfully!");
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        idea: "",
        category: "",
        stage: "",
        commitment: "",
        duration: "",
        maxMembers: 4,
        requiredSkills: [],
        tags: [],
      });
      onTeamCreated?.();
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Fill out the details below to create your team and start finding
            teammates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., EcoTrack App"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of your project..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idea">Project Idea *</Label>
            <Textarea
              id="idea"
              value={formData.idea}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, idea: e.target.value }))
              }
              placeholder="Detailed explanation of your project idea and vision..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Project Stage *</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, stage: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxMembers">Max Team Size *</Label>
              <Input
                id="maxMembers"
                type="number"
                min="2"
                max="10"
                value={formData.maxMembers}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxMembers: Number.parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commitment">Time Commitment *</Label>
              <Select
                value={formData.commitment}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, commitment: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select commitment" />
                </SelectTrigger>
                <SelectContent>
                  {commitments.map((commitment) => (
                    <SelectItem key={commitment} value={commitment}>
                      {commitment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Project Duration *</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, duration: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Required Skills</Label>
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
              {formData.requiredSkills.map((skill) => (
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
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
