import { useEffect, useState } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        fetchDashboard();
        fetchUsers();
    }, []);

    const fetchDashboard = async () => {
        const { data } = await axios.get("/api/dashboard-stats");
        setStats(data.data);
    };

    const fetchUsers = async () => {
        const { data } = await axios.get("/api/users");
        setUsers(data.profiles);
    };

    const fetchEmails = async () => {
        const { data } = await axios.get("/api/emails");
        setEmails(data.emails);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
                <Card>
                    <CardContent>
                        <h2 className="text-lg font-semibold">Total Users</h2>
                        <p>{stats.totalUsers || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <h2 className="text-lg font-semibold">Total Agencies</h2>
                        <p>{stats.totalAgencies || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <h2 className="text-lg font-semibold">Top Locations</h2>
                        <ul>
                            {stats.topLocations?.map((loc) => (
                                <li key={loc._id}>{loc._id}: {loc.count}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold">Users</h2>
                <div className="overflow-auto">
                    <table className="min-w-full mt-2 border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Full Name</th>
                                <th className="p-2 border">Agency</th>
                                <th className="p-2 border">Location</th>
                                <th className="p-2 border">Website</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border">
                                    <td className="p-2 border">{user.fullname}</td>
                                    <td className="p-2 border">{user.agencyName}</td>
                                    <td className="p-2 border">{user.location}</td>
                                    <td className="p-2 border">
                                        {user.website ? <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a> : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6">
                <Button onClick={fetchEmails} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Fetch Emails
                </Button>
                {emails.length > 0 && (
                    <CopyToClipboard text={emails.join(", ")}>
                        <Button className="bg-green-500 text-white px-4 py-2 ml-2 rounded">
                            Copy All Emails
                        </Button>
                    </CopyToClipboard>
                )}
            </div>
        </div>
    );
}
