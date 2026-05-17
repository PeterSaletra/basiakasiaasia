import Menu from '@/components/Menu';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { SerializedEditorState } from 'lexical';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Editor } from '@/components/blocks/editor-00/editor';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchProfile } from '@/services/profile';

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Hello World 🚀',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState;

const handleUpdateSignature = () => {
  console.log('Updated signature:', 'JEBAC DISA KURWE JEBANA GIERCZAKA');
  alert('Signature updated successfully!');
};

function ProfilePage() {
  const auth = useAuth();
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    avatar: string | null;
    date_of_birth: string | null;
    gender: string | null;
    createdAt: string | null;
    threads: { id: string; forumId: string; title: string; createdAt: string; replies: number }[];
  } | null>(null);

  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [backup, setBackup] = useState({ nickname: "", dateOfBirth: "", gender: "" });

  useEffect(() => {
    if (auth.user) {
      fetchProfile(auth.user.uid).then((data) => {
        if (data) {
          setProfile(data);
          setNickname(data.username);
          setDateOfBirth(data.date_of_birth ?? "");
          setGender(data.gender ?? "");
        }
      });
    }
  }, [auth.user]);

  if (!profile || auth.loading) {
    return (
      <div className="w-full min-h-screen flex flex-col gap-4 p-4 bg-background">
        <Menu />
        <div className="flex-1 flex items-center justify-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col gap-4 p-4 bg-background">
      <Menu />
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <Card className="w-full md:w-3/4 lg:w-2/3 border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-5xl font-bold">
                {profile.username}'s Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <img
                src={profile.avatar ?? "/src/assets/img/default-user.svg"}
                alt="Profile Picture"
                className="rounded-3xl w-56 h-56 md:w-80 md:h-80 object-cover"
              />
              <div className="text-sm text-muted-foreground">
                {profile.email}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-5xl font-bold">About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-justify text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua...
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl font-semibold">
                    Profile Information
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm md:text-base">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Nickname</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                              />
                            ) : (
                              nickname
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Email</TableCell>
                          <TableCell>{profile.email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Date of Birth</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                              />
                            ) : (
                              dateOfBirth || "-"
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Account Created</TableCell>
                          <TableCell>
                            {profile.createdAt
                              ? new Date(profile.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Gender</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                              />
                            ) : (
                              gender || "-"
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className="flex justify-end">
                      {!isEditing ? (
                        <Button
                          onClick={() => {
                            setBackup({ nickname, dateOfBirth, gender });
                            setIsEditing(true);
                          }}
                        >
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setIsEditing(false);
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setNickname(backup.nickname);
                              setDateOfBirth(backup.dateOfBirth);
                              setGender(backup.gender);
                              setIsEditing(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Custom User Signature
                      </h3>
                      <div className="border rounded-md p-2">
                        <Editor
                          editorSerializedState={editorState}
                          onSerializedChange={(value) => setEditorState(value)}
                        />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button onClick={handleUpdateSignature}>
                          Update Signature
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-xl font-semibold">
                    User Threads
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm md:text-base">
                    {profile.threads.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No threads yet.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Thread Title</TableHead>
                            <TableHead>Replies</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {profile.threads.map((thread) => (
                            <TableRow key={thread.id}>
                              <TableCell className="font-medium">
                                <Link
                                  to={`/forum/${thread.forumId}/thread/${thread.id}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {thread.title}
                                </Link>
                              </TableCell>
                              <TableCell>{thread.replies}</TableCell>
                              <TableCell>{thread.createdAt}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

export default ProfilePage;
