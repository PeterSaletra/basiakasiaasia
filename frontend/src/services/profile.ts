import { USE_MOCK_API } from "@/config/api";
import { getUserProfile } from "./roleService";
import { mockGetCurrentUserProfile } from "@/mocks/mockApi";

type UserThread = {
  id: string;
  forumId: string;
  title: string;
  createdAt: string;
  replies: number;
};

type UserProfileData = {
  username: string;
  email: string;
  role: string | null;
  avatar: string | null;
  date_of_birth: string | null;
  gender: string | null;
  createdAt: string | null;
  threads: UserThread[];
};

export async function fetchProfile(userUid: string | null): Promise<UserProfileData | null> {
  if (!userUid) return null;

  if (USE_MOCK_API) {
    const mockProfile = await mockGetCurrentUserProfile();
    return {
      username: mockProfile.username,
      email: mockProfile.email,
      role: mockProfile.role,
      avatar: mockProfile.avatar,
      date_of_birth: mockProfile.date_of_birth,
      gender: mockProfile.gender,
      createdAt: null,
      threads: mockProfile.threads,
    };
  }

  const profile = await getUserProfile(userUid);
  if (!profile) return null;

  return {
    username: profile.username,
    email: profile.email,
    role: profile.role,
    avatar: null,
    date_of_birth: null,
    gender: null,
    createdAt: profile.createdAt,
    threads: [],
  };
}
