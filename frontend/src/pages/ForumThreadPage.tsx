import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Menu from "@/components/Menu";
import Footer from "@/components/Foooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { getThreadsByForumId } from '@/services/forums';
import { createThread } from '@/services/threads';

function ForumThreadPage() {
    const { id } = useParams<{ id: string }>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [threadTitle, setThreadTitle] = useState("");
    const [threadDescription, setThreadDescription] = useState("");
    const [titleFilter, setTitleFilter] = useState("");
    const [authorFilter, setAuthorFilter] = useState("");
    const [repliesFilter, setRepliesFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const navigate = useNavigate();

    // Mock data for threads in this forum
    const [forumThreads, setForumThreads] = useState<Array<{id: string; title: string; author: string; date: string; replies: number;}>>([]);

    const handleGetThreads = useCallback(async () => {
        try{
            const threads = await getThreadsByForumId(Number(id));
            setForumThreads(threads);
        } catch (error) {
            toast.error(`Error fetching threads: ${error}`);
        }
    }, [id]);


    useEffect(() => {
        handleGetThreads();
    }, [handleGetThreads]);

    const handleCreateThread = async () => {
        try{
            if (!threadTitle.trim()) {
                toast.warning("Please enter a thread title");
                return;
            }

            // Create new thread object

            await createThread(Number(id), threadTitle, threadDescription);

            await handleGetThreads();
            // Clear form and close dialog
            setThreadTitle("");
            setThreadDescription("");
            setIsDialogOpen(false);

            // Show success message
            toast.success("Thread created successfully!");
        } catch (error) {
            toast.error(`Error creating thread: ${error}`);
        }
    };

    const filteredThreads = forumThreads.filter((thread) =>
        thread.title.toLowerCase().includes(titleFilter.toLowerCase())
        && thread.author.toLowerCase().includes(authorFilter.toLowerCase())
        && thread.replies.toString().includes(repliesFilter.trim())
        && thread.date.toLowerCase().includes(dateFilter.toLowerCase())
    );

    return (
        <div className='w-full min-h-screen flex flex-col gap-4 p-4 bg-gray-50'>
            <Menu />
            
            <div className="container mx-auto max-w-6xl flex-1">
                {/* Forum Header */}
                <div className="mb-6">
                    <Button variant="outline" onClick={() => navigate("/forum")} className="mb-4">
                        ← Back to Forums
                    </Button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Forum Category {id}</h1>
                            <p className="text-gray-600">Browse and discuss threads in this category</p>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    + Create New Thread
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Thread</DialogTitle>
                                    <DialogDescription>
                                        Start a new discussion in this forum category
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Thread Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="Enter thread title..."
                                            value={threadTitle}
                                            onChange={(e) => setThreadTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (Optional)</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Enter thread description..."
                                            className="min-h-[100px] resize-none"
                                            value={threadDescription}
                                            onChange={(e) => setThreadDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateThread}>
                                        Create Thread
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Threads Table */}
                <div className="bg-white rounded-lg border shadow-sm">
                    <div className="grid gap-3 border-b p-4 md:grid-cols-2 xl:grid-cols-4">
                        <Input
                            placeholder="Search by thread title"
                            value={titleFilter}
                            onChange={(e) => setTitleFilter(e.target.value)}
                        />
                        <Input
                            placeholder="Search by author"
                            value={authorFilter}
                            onChange={(e) => setAuthorFilter(e.target.value)}
                        />
                        <Input
                            placeholder="Search by replies"
                            value={repliesFilter}
                            onChange={(e) => setRepliesFilter(e.target.value)}
                        />
                        <Input
                            placeholder="Search by date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50%]">Thread Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Replies</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredThreads.length > 0 ? filteredThreads.map((thread) => (
                                <TableRow key={thread.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <Link 
                                            to={`/forum/${id}/thread/${thread.id}`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                        >
                                            {thread.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-gray-700">{thread.author}</TableCell>
                                    <TableCell className="text-gray-700">{thread.replies}</TableCell>
                                    <TableCell className="text-gray-500">{thread.date}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                                        No threads match the current filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ForumThreadPage;
