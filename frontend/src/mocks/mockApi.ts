import asiaAvatar from "@/assets/img/Asia.jpg";
import basiaAvatar from "@/assets/img/Basia.jpg";
import kasiaAvatar from "@/assets/img/Kasia.jpg";
import defaultUserAvatar from "@/assets/img/default-user.svg";
import { MOCK_DATABASE_STORAGE_KEY } from "@/config/storage";
import { addNotification } from "@/services/notifications";
import {
  type SessionRole,
  readMockSessionUser,
  writeMockSessionUser,
} from "@/services/mockSession";

type Gender = "male" | "female" | "other";
type Role = SessionRole;

type MockUserRecord = {
  user_id: number;
  username: string;
  email: string;
  password: string;
  date_of_birth?: string;
  gender: Gender;
  role: Role;
  is_banned: boolean;
  avatar: string;
};

type MockForumRecord = {
  id: number;
  title: string;
  description?: string;
  creator: string;
  creator_id: number;
  created_at: string;
};

type MockThreadRecord = {
  id: number;
  forum_id: number;
  title: string;
  description: string;
  author: string;
  author_id: number;
  created_at: string;
};

type MockCommentRecord = {
  id: number;
  thread_id: number;
  username: string;
  user_id: number;
  avatar: string;
  content: string;
  created_at: string;
};

type MockDatabase = {
  users: MockUserRecord[];
  forums: MockForumRecord[];
  threads: MockThreadRecord[];
  comments: MockCommentRecord[];
};

export type MockAuthResponse = {
  role: Role;
  access_token_type: "Bearer";
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
  username: string;
  user_id: number;
};

const NETWORK_DELAY_MS = 150;

const clone = <T>(value: T): T => {
  if (value === null || value === undefined) {
    return value;
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const withDelay = async <T>(value: T): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
  return clone(value);
};

const formatDisplayDate = (value: string): string =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const nextId = (values: number[]): number =>
  values.length > 0 ? Math.max(...values) + 1 : 1;

const normalizeGender = (gender: string): Gender => {
  if (gender === "male" || gender === "female" || gender === "other") {
    return gender;
  }

  return "other";
};

const parseRoleFromSession = (): Role | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawRole = window.sessionStorage.getItem("role");
  if (!rawRole) {
    return null;
  }

  try {
    return JSON.parse(rawRole) as Role;
  } catch {
    return null;
  }
};

const createDefaultDatabase = (): MockDatabase => ({
  users: [
    {
      user_id: 1,
      username: "asia_admin",
      email: "admin@kasiakasiabasia.test",
      password: "admin123",
      date_of_birth: "1995-03-18",
      gender: "female",
      role: "admin",
      is_banned: false,
      avatar: asiaAvatar,
    },
    {
      user_id: 2,
      username: "kasia_user",
      email: "kasia@kasiakasiabasia.test",
      password: "user123",
      date_of_birth: "1999-08-22",
      gender: "female",
      role: "user",
      is_banned: false,
      avatar: kasiaAvatar,
    },
    {
      user_id: 3,
      username: "basia_user",
      email: "basia@kasiakasiabasia.test",
      password: "user123",
      date_of_birth: "2001-01-11",
      gender: "female",
      role: "user",
      is_banned: false,
      avatar: basiaAvatar,
    },
  ],
  forums: [
    {
      id: 1,
      title: "Parenting Tips",
      description: "Daily routines, communication and practical support for parents.",
      creator: "asia_admin",
      creator_id: 1,
      created_at: "2026-04-20T09:30:00.000Z",
    },
    {
      id: 2,
      title: "School and Learning",
      description: "Homework, concentration and healthy study habits.",
      creator: "asia_admin",
      creator_id: 1,
      created_at: "2026-04-18T14:10:00.000Z",
    },
    {
      id: 3,
      title: "Health and Wellbeing",
      description: "Sleep, diet and emotional balance in everyday life.",
      creator: "kasia_user",
      creator_id: 2,
      created_at: "2026-04-16T11:05:00.000Z",
    },
  ],
  threads: [
    {
      id: 1,
      forum_id: 1,
      title: "How do you handle evening routines?",
      description: "I am looking for a predictable routine that helps kids calm down before sleep.",
      author: "kasia_user",
      author_id: 2,
      created_at: "2026-04-25T17:20:00.000Z",
    },
    {
      id: 2,
      forum_id: 1,
      title: "Ideas for weekend family activities",
      description: "Share simple indoor and outdoor activities that do not require a big budget.",
      author: "basia_user",
      author_id: 3,
      created_at: "2026-04-24T10:45:00.000Z",
    },
    {
      id: 3,
      forum_id: 2,
      title: "What helps with homework focus?",
      description: "We are testing shorter learning blocks and fewer distractions. What works for you?",
      author: "asia_admin",
      author_id: 1,
      created_at: "2026-04-23T08:15:00.000Z",
    },
    {
      id: 4,
      forum_id: 3,
      title: "Healthy breakfast ideas",
      description: "Looking for quick breakfasts that are realistic on school mornings.",
      author: "kasia_user",
      author_id: 2,
      created_at: "2026-04-22T06:55:00.000Z",
    },
  ],
  comments: [
    {
      id: 1,
      thread_id: 1,
      username: "asia_admin",
      user_id: 1,
      avatar: asiaAvatar,
      content: "We keep the order fixed every day: bath, reading and then lights out.",
      created_at: "2026-04-25T18:00:00.000Z",
    },
    {
      id: 2,
      thread_id: 1,
      username: "basia_user",
      user_id: 3,
      avatar: basiaAvatar,
      content: "A visible checklist on the wall helped a lot with independence.",
      created_at: "2026-04-25T18:35:00.000Z",
    },
    {
      id: 3,
      thread_id: 2,
      username: "kasia_user",
      user_id: 2,
      avatar: kasiaAvatar,
      content: "We rotate between picnic, bike ride and one craft project at home.",
      created_at: "2026-04-24T12:05:00.000Z",
    },
    {
      id: 4,
      thread_id: 3,
      username: "basia_user",
      user_id: 3,
      avatar: basiaAvatar,
      content: "Pomodoro blocks with a 5 minute break work best for us.",
      created_at: "2026-04-23T09:10:00.000Z",
    },
  ],
});

let memoryDatabase = createDefaultDatabase();

const persistDatabase = (database: MockDatabase): void => {
  memoryDatabase = clone(database);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(MOCK_DATABASE_STORAGE_KEY, JSON.stringify(memoryDatabase));
  }
};

const readDatabase = (): MockDatabase => {
  if (typeof window === "undefined") {
    return clone(memoryDatabase);
  }

  const rawDatabase = window.localStorage.getItem(MOCK_DATABASE_STORAGE_KEY);
  if (!rawDatabase) {
    persistDatabase(memoryDatabase);
    return clone(memoryDatabase);
  }

  try {
    const parsedDatabase = JSON.parse(rawDatabase) as MockDatabase;
    memoryDatabase = parsedDatabase;
    return clone(parsedDatabase);
  } catch {
    memoryDatabase = createDefaultDatabase();
    persistDatabase(memoryDatabase);
    return clone(memoryDatabase);
  }
};

const getCurrentUser = (database: MockDatabase): MockUserRecord => {
  const sessionUser = readMockSessionUser();
  if (sessionUser) {
    const currentUser = database.users.find((user) => user.user_id === sessionUser.user_id);
    if (currentUser) {
      return currentUser;
    }
  }

  const role = parseRoleFromSession();
  const userByRole = role
    ? database.users.find((user) => user.role === role && !user.is_banned)
    : undefined;

  return userByRole ?? database.users.find((user) => !user.is_banned) ?? database.users[0];
};

export async function mockLogin(email: string, password: string): Promise<MockAuthResponse> {
  const database = readDatabase();
  const user = database.users.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase()
  );

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  if (user.is_banned) {
    throw new Error("Twoje konto zostalo zablokowane. Skontaktuj sie z administratorem.");
  }

  writeMockSessionUser({
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role,
  });

  return withDelay({
    role: user.role,
    access_token_type: "Bearer",
    access_token: `mock-access-token-${user.user_id}`,
    refresh_token: `mock-refresh-token-${user.user_id}`,
    access_token_expires_in: 3600,
    refresh_token_expires_in: 86400,
    username: user.username,
    user_id: user.user_id,
  });
}

export async function mockRegister(
  email: string,
  password: string,
  username: string,
  dateOfBirth: Date | undefined,
  gender: string,
  roleId = 1
) {
  const database = readDatabase();
  const emailExists = database.users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (emailExists) {
    throw new Error("User with this email already exists");
  }

  const newUser: MockUserRecord = {
    user_id: nextId(database.users.map((user) => user.user_id)),
    username,
    email,
    password,
    date_of_birth: dateOfBirth?.toISOString(),
    gender: normalizeGender(gender),
    role: roleId === 3 ? "admin" : "user",
    is_banned: false,
    avatar: defaultUserAvatar,
  };

  database.users.unshift(newUser);
  persistDatabase(database);
  addNotification(newUser.user_id, {
    kind: "success",
    title: "Welcome to the forum",
    message: `Your account ${newUser.username} is ready to use.`,
    href: "/forum",
  });

  return withDelay({
    user_id: newUser.user_id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  });
}

export async function mockLogout() {
  writeMockSessionUser(null);
  return withDelay({ success: true });
}

export async function mockGetUsers() {
  const database = readDatabase();

  return withDelay(
    database.users.map(({ password, avatar, ...user }) => user)
  );
}

export async function mockBanUser(userId: number) {
  const database = readDatabase();
  const user = database.users.find((entry) => entry.user_id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.is_banned = true;
  persistDatabase(database);
  addNotification(user.user_id, {
    kind: "moderation",
    title: "Account restricted",
    message: "An administrator has banned your account.",
    href: user.role === "admin" ? "/admin" : "/profile",
  });

  return withDelay({ success: true });
}

export async function mockUnbanUser(userId: number) {
  const database = readDatabase();
  const user = database.users.find((entry) => entry.user_id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.is_banned = false;
  persistDatabase(database);
  addNotification(user.user_id, {
    kind: "success",
    title: "Account restored",
    message: "An administrator has unbanned your account.",
    href: user.role === "admin" ? "/admin" : "/profile",
  });

  return withDelay({ success: true });
}

export async function mockGetForums() {
  const database = readDatabase();
  const forums = [...database.forums]
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .map((forum) => ({
      ...forum,
      id: String(forum.id),
    }));

  return withDelay(forums);
}

export async function mockGetForumById(forumId: number) {
  const database = readDatabase();
  const forum = database.forums.find((entry) => entry.id === forumId);

  if (!forum) {
    throw new Error("Forum not found");
  }

  return withDelay({
    ...forum,
    id: String(forum.id),
  });
}

export async function mockCreateForum(title: string, description: string) {
  const database = readDatabase();
  const currentUser = getCurrentUser(database);
  const newForum: MockForumRecord = {
    id: nextId(database.forums.map((forum) => forum.id)),
    title,
    description,
    creator: currentUser.username,
    creator_id: currentUser.user_id,
    created_at: new Date().toISOString(),
  };

  database.forums.unshift(newForum);
  persistDatabase(database);
  addNotification(currentUser.user_id, {
    kind: "success",
    title: "Forum created",
    message: `You created the forum "${newForum.title}".`,
    href: `/forum/${newForum.id}`,
  });

  return withDelay({
    ...newForum,
    id: String(newForum.id),
  });
}

export async function mockGetThreadsByForumId(forumId: number) {
  const database = readDatabase();
  const threads = database.threads
    .filter((thread) => thread.forum_id === forumId)
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .map((thread) => ({
      id: String(thread.id),
      title: thread.title,
      author: thread.author,
      date: formatDisplayDate(thread.created_at),
      replies: database.comments.filter((comment) => comment.thread_id === thread.id).length,
    }));

  return withDelay(threads);
}

export async function mockCreateThread(
  forumId: number,
  title: string,
  description: string
) {
  const database = readDatabase();
  const forum = database.forums.find((entry) => entry.id === forumId);
  if (!forum) {
    throw new Error("Forum not found");
  }

  const currentUser = getCurrentUser(database);
  const newThread: MockThreadRecord = {
    id: nextId(database.threads.map((thread) => thread.id)),
    forum_id: forumId,
    title,
    description,
    author: currentUser.username,
    author_id: currentUser.user_id,
    created_at: new Date().toISOString(),
  };

  database.threads.unshift(newThread);
  persistDatabase(database);
  addNotification(currentUser.user_id, {
    kind: "success",
    title: "Thread created",
    message: `You started the thread "${newThread.title}".`,
    href: `/forum/${forumId}/thread/${newThread.id}`,
  });

  return withDelay({
    id: newThread.id,
    title: newThread.title,
    description: newThread.description,
    author: newThread.author,
    date: formatDisplayDate(newThread.created_at),
  });
}

export async function mockGetThreadById(threadId: number) {
  const database = readDatabase();
  const thread = database.threads.find((entry) => entry.id === threadId);

  if (!thread) {
    throw new Error("Thread not found");
  }

  return withDelay({
    id: thread.id,
    title: thread.title,
    description: thread.description,
    author: thread.author,
    date: formatDisplayDate(thread.created_at),
  });
}

export async function mockGetCommentsByThreadId(threadId: number) {
  const database = readDatabase();
  const comments = database.comments
    .filter((comment) => comment.thread_id === threadId)
    .sort((left, right) => left.created_at.localeCompare(right.created_at))
    .map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: formatDisplayDate(comment.created_at),
      avatar: comment.avatar,
      content: comment.content,
    }));

  return withDelay(comments);
}

export async function mockCreateComment(threadId: number, content: string) {
  const database = readDatabase();
  const thread = database.threads.find((entry) => entry.id === threadId);
  if (!thread) {
    throw new Error("Thread not found");
  }

  const currentUser = getCurrentUser(database);
  const newComment: MockCommentRecord = {
    id: nextId(database.comments.map((comment) => comment.id)),
    thread_id: threadId,
    username: currentUser.username,
    user_id: currentUser.user_id,
    avatar: currentUser.avatar,
    content,
    created_at: new Date().toISOString(),
  };

  database.comments.push(newComment);
  persistDatabase(database);
  addNotification(currentUser.user_id, {
    kind: "info",
    title: "Comment posted",
    message: `Your comment was added to "${thread.title}".`,
    href: `/forum/${thread.forum_id}/thread/${thread.id}`,
  });

  return withDelay({
    id: newComment.id,
    username: newComment.username,
    date: formatDisplayDate(newComment.created_at),
    avatar: newComment.avatar,
    content: newComment.content,
  });
}
