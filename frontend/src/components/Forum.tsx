import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom"
import { getForums } from "@/services/forums";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Forum(){
    const [forums, setForums] = useState<Array<{id: string; title: string; creator: string; created_at: string;}>>([]);
    const [titleFilter, setTitleFilter] = useState("");
    const [authorFilter, setAuthorFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const handleFetchForums = async () => {
        try {
        const data = await getForums();
            setForums(data);
        } catch (error) {
            toast.error(`Error fetching forums: ${error}`);
        }
    };

    useEffect(() => {
        handleFetchForums();
    }, []);

    const filteredForums = forums.filter((forum) => {
        const forumDate = new Date(forum.created_at).toLocaleDateString();

        return forum.title.toLowerCase().includes(titleFilter.toLowerCase())
            && forum.creator.toLowerCase().includes(authorFilter.toLowerCase())
            && forumDate.toLowerCase().includes(dateFilter.toLowerCase());
    });

    return (
        <div>
            <div className="w-9/10 mx-auto mb-4 grid gap-3 md:grid-cols-3">
                <Input
                    placeholder="Search by title"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                />
                <Input
                    placeholder="Search by author"
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                />
                <Input
                    placeholder="Search by date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
            </div>
            <Table className="w-9/10 mx-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredForums.length > 0 ? filteredForums.map((forum) => (
                        <TableRow key={forum.id} className="hover:bg-gray-50 cursor-pointer">
                            <TableCell>
                                <Link
                                    to={`/forum/${forum.id}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                >
                                    {forum.title}
                                </Link>
                            </TableCell>
                            <TableCell>{forum.creator}</TableCell>
                            <TableCell>{new Date(forum.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="py-8 text-center text-gray-500">
                                No forums match the current filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default Forum;
