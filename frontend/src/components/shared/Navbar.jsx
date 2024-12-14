import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Menu, X, ChevronDown } from 'lucide-react'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'

const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(null))
                navigate("/")
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <h1 className="text-2xl font-bold">Q<span className="text-green-600">ualtr</span></h1>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {!user ? (
                                <>
                                    <NavLink to="/agencies">Agencies</NavLink>
                                    <NavLink to="/open-projects">Open Projects</NavLink>
                                    <NavLink to="/impact">Our Impact</NavLink>
                                    <NavLink to="/how-to-find-work">How to Find Work</NavLink>
                                </>
                            ) : user.role === 'recruiter' ? (
                                <>
                                    <NavLink to="/agencies" id="agencies-page-link">Agencies</NavLink>
                                    <NavLink to="/admin/companies">Companies</NavLink>
                                    <NavLink to="/admin/projects" id="post-project-button">Projects</NavLink>
                                    <NavLink to="/compare-list" id="post-project-button">Compare List</NavLink>
                                    <NavLink to="/my-meetings" id="my-meetings-link">My Meetings</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/open-projects">Open Projects</NavLink>
                                    <NavLink to="/profile?tab=applied">Bids</NavLink>
                                    <NavLink to="/my-meetings">My Meetings</NavLink>
                                    <NavLink to={`/agency/${user?._id}`} onClick={(e) => {
                                        if (!user) {
                                            e.preventDefault()
                                            toast.error("Please log in to access your agency.")
                                        }
                                    }} target="_blank">
                                        My Agency
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {!user ? (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="outline" className="text-gray-700 hover:text-green-600 border-gray-300 hover:border-green-600">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="User avatar" />
                                            <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-gray-700">{user?.fullname}</span>
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-2">
                                    {user && user.role === 'student' && (
                                        <Link to="/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                                            <User2 size={18} />
                                            <span>View Profile</span>
                                        </Link>
                                    )}
                                    {user && user.role === 'recruiter' && (
                                        <Link to="/dashboard/brand" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                                        <User2 size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                    )}
                                    <button onClick={logoutHandler} className="flex items-center space-x-2 w-full p-2 text-left hover:bg-gray-100 rounded-md">
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {!user ? (
                            <>
                                <MobileNavLink to="/agencies">Agencies</MobileNavLink>
                                <MobileNavLink to="/open-projects">Open Projects</MobileNavLink>
                                <MobileNavLink to="/our-impact">Our Impact</MobileNavLink>
                                <MobileNavLink to="/how-to-find-work">How to Find Work</MobileNavLink>
                            </>
                        ) : user.role === 'recruiter' ? (
                            <>
                                <MobileNavLink to="/agencies">Agencies</MobileNavLink>
                                <MobileNavLink to="/admin/companies">Companies</MobileNavLink>
                                <MobileNavLink to="/admin/projects">Projects</MobileNavLink>
                            </>
                        ) : (
                            <>
                                <MobileNavLink to="/open-projects">Open Projects</MobileNavLink>
                                <MobileNavLink to={`/agency/${user?._id}`} onClick={(e) => {
                                    if (!user) {
                                        e.preventDefault()
                                        toast.error("Please log in to access your agency.")
                                    }
                                }}>
                                    My Agency
                                </MobileNavLink>
                            </>
                        )}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        {user ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="User avatar" />
                                        <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user?.fullname}</div>
                                    <div className="text-sm font-medium text-gray-500">{user?.profile?.bio}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-1">
                                <MobileNavLink to="/login">Login</MobileNavLink>
                                <MobileNavLink to="/signup">Signup</MobileNavLink>
                            </div>
                        )}
                        <div className="mt-3 space-y-1">
                            {user && user.role === 'student' && (
                                <MobileNavLink to="/profile">View Profile</MobileNavLink>
                            )}
                            {user && (
                                <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

const NavLink = ({ to, children, ...props }) => (
    <Link
        to={to}
        className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
        {...props}
    >
        {children}
    </Link>
)

const MobileNavLink = ({ to, children, ...props }) => (
    <Link
        to={to}
        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-green-500 hover:text-green-600"
        {...props}
    >
        {children}
    </Link>
)

export default Navbar
