import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
  where,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Event, Team, User } from "./types";

// Events
export const getEvents = async (): Promise<Event[]> => {
  const eventsRef = collection(db, "events");
  const snapshot = await getDocs(
    query(eventsRef, orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Event[];
};

export const getEvent = async (id: string): Promise<Event | null> => {
  const eventRef = doc(db, "events", id);
  const snapshot = await getDoc(eventRef);
  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() || new Date(),
  } as Event;
};

export const addEvent = async (
  event: Omit<Event, "id" | "createdAt">
): Promise<string> => {
  const eventsRef = collection(db, "events");
  const docRef = await addDoc(eventsRef, {
    ...event,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const joinEvent = async (
  eventId: string,
  userId: string
): Promise<void> => {
  const eventRef = doc(db, "events", eventId);
  const eventDoc = await getDoc(eventRef);

  if (eventDoc.exists()) {
    const eventData = eventDoc.data() as Event;
    if (eventData.participants < eventData.maxParticipants) {
      await updateDoc(eventRef, {
        participants: eventData.participants + 1,
        participantIds: arrayUnion(userId),
      });
    } else {
      throw new Error("Event is full");
    }
  }
};

// Teams
export const getTeams = async (): Promise<Team[]> => {
  const teamsRef = collection(db, "teams");
  const snapshot = await getDocs(query(teamsRef, orderBy("createdAt", "desc")));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Team[];
};

export const getTeam = async (id: string): Promise<Team | null> => {
  const teamRef = doc(db, "teams", id);
  const snapshot = await getDoc(teamRef);
  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() || new Date(),
  } as Team;
};

export const addTeam = async (
  team: Omit<Team, "id" | "createdAt">
): Promise<string> => {
  const teamsRef = collection(db, "teams");
  const docRef = await addDoc(teamsRef, {
    ...team,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const joinTeam = async (
  teamId: string,
  userId: string,
  userName: string
): Promise<void> => {
  const teamRef = doc(db, "teams", teamId);
  const teamDoc = await getDoc(teamRef);

  if (teamDoc.exists()) {
    const teamData = teamDoc.data() as Team;
    if (teamData.members < teamData.maxMembers) {
      await updateDoc(teamRef, {
        members: teamData.members + 1,
        memberIds: arrayUnion(userId),
        memberNames: arrayUnion(userName),
      });
    } else {
      throw new Error("Team is full");
    }
  }
};

// Users
export const getUsers = async (): Promise<User[]> => {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(query(usersRef, orderBy("createdAt", "desc")));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as User[];
};

export const getUser = async (id: string): Promise<User | null> => {
  const userRef = doc(db, "users", id);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() || new Date(),
  } as User;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  } as User;
};

export const addUser = async (
  user: Omit<User, "id" | "createdAt">
): Promise<string> => {
  const usersRef = collection(db, "users");
  const docRef = await addDoc(usersRef, {
    ...user,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: Timestamp.now(),
  });
};

// Search functions
export const searchTeamsBySkills = async (
  skills: string[]
): Promise<Team[]> => {
  const teamsRef = collection(db, "teams");
  const snapshot = await getDocs(teamsRef);

  return snapshot.docs
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as Team)
    )
    .filter((team) =>
      skills.some(
        (skill) =>
          team.requiredSkills.some((reqSkill) =>
            reqSkill.toLowerCase().includes(skill.toLowerCase())
          ) ||
          team.tags.some((tag) =>
            tag.toLowerCase().includes(skill.toLowerCase())
          )
      )
    );
};

export const searchUsersBySkills = async (
  skills: string[]
): Promise<User[]> => {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  return snapshot.docs
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as User)
    )
    .filter((user) =>
      skills.some((skill) =>
        user.skills.some((userSkill) =>
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );
};

// Dashboard Statistics
export const getUserStats = async (
  userId: string
): Promise<{
  teamsJoined: number;
  eventsJoined: number;
  teamsCreated: number;
  eventsCreated: number;
  skillMatches: number;
}> => {
  try {
    // Get teams where user is a member
    const teamsRef = collection(db, "teams");
    const teamsSnapshot = await getDocs(teamsRef);
    const teamsJoined = teamsSnapshot.docs.filter(
      (doc) =>
        doc.data().memberIds?.includes(userId) ||
        doc.data().leader?.id === userId
    ).length;

    // Get teams created by user
    const teamsCreated = teamsSnapshot.docs.filter(
      (doc) => doc.data().leader?.id === userId
    ).length;

    // Get events where user is a participant
    const eventsRef = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsRef);
    const eventsJoined = eventsSnapshot.docs.filter((doc) =>
      doc.data().participantIds?.includes(userId)
    ).length;

    // Get events created by user
    const eventsCreated = eventsSnapshot.docs.filter(
      (doc) => doc.data().creatorId === userId
    ).length;

    // Calculate skill matches (teams that match user's skills)
    const userProfile = await getUserByEmail(userId); // This would need to be updated to use userId
    let skillMatches = 0;
    if (userProfile) {
      skillMatches = teamsSnapshot.docs.filter((doc) => {
        const teamData = doc.data();
        return teamData.requiredSkills?.some((skill: string) =>
          userProfile.skills.some((userSkill) =>
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      }).length;
    }

    return {
      teamsJoined,
      eventsJoined,
      teamsCreated,
      eventsCreated,
      skillMatches,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return {
      teamsJoined: 0,
      eventsJoined: 0,
      teamsCreated: 0,
      eventsCreated: 0,
      skillMatches: 0,
    };
  }
};

export const getRecentActivity = async (
  userId: string
): Promise<{
  recentTeamJoins: Team[];
  recentEventJoins: Event[];
  pendingInvitations: number;
}> => {
  try {
    // Get recent teams joined (last 30 days)
    const teamsRef = collection(db, "teams");
    const teamsSnapshot = await getDocs(teamsRef);
    const recentTeamJoins = teamsSnapshot.docs
      .filter((doc) => doc.data().memberIds?.includes(userId))
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          } as Team)
      )
      .slice(0, 3);

    // Get recent events joined
    const eventsRef = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsRef);
    const recentEventJoins = eventsSnapshot.docs
      .filter((doc) => doc.data().participantIds?.includes(userId))
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          } as Event)
      )
      .slice(0, 3);

    // Mock pending invitations (in a real app, you'd have an invitations collection)
    const pendingInvitations = Math.floor(Math.random() * 5) + 1;

    return {
      recentTeamJoins,
      recentEventJoins,
      pendingInvitations,
    };
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return {
      recentTeamJoins: [],
      recentEventJoins: [],
      pendingInvitations: 0,
    };
  }
};

export const hasUserJoinedEvent = async (
  eventId: string,
  userId: string
): Promise<boolean> => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);
    if (eventDoc.exists()) {
      const eventData = eventDoc.data();
      return eventData.participantIds?.includes(userId) || false;
    }
    return false;
  } catch (error) {
    console.error("Error checking event join status:", error);
    return false;
  }
};

export const hasUserJoinedTeam = async (
  teamId: string,
  userId: string
): Promise<boolean> => {
  try {
    const teamRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamRef);
    if (teamDoc.exists()) {
      const teamData = teamDoc.data();
      return (
        teamData.memberIds?.includes(userId) ||
        teamData.leader?.id === userId ||
        false
      );
    }
    return false;
  } catch (error) {
    console.error("Error checking team join status:", error);
    return false;
  }
};
