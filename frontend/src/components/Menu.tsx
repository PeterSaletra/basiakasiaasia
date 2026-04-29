import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router";
import Logo from "../assets/img/Logo-full.svg"
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "@/components/NotificationBell";


function Menu() {
    const auth = useAuth()

    return (
    <div className="inline-flex items-center justify-between w-full border-b border-black border-solid">
        <div>
            <img src={Logo} alt="Logo" className="h-20 m-2" />
        </div>
        <div className="flex items-center gap-2">
            {auth.isAuthenticated && <NotificationBell accessToken={auth.accessToken} />}

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className="text-xl">
                            <Link to="/" >Main Page</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className="text-xl">
                            <Link to="/forum">Forum</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {auth.isAuthenticated && auth.role === "user" && (
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className="text-xl">
                            <Link to="/profile">Profile</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    )}
                    {auth.isAuthenticated && auth.role === "admin" && (
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className="text-xl">
                            <Link to="/admin">Admin Panel</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    )}
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className="text-xl">
                            <Link to="/about">About Us</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    {auth.isAuthenticated && (
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="text-xl">
                                <button type="button" onClick={() => auth.logout()}>
                                    Logout
                                </button>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    {!auth.isAuthenticated && (
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className="text-xl">
                            <Link to="/login">Login</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    )}
                </NavigationMenuList>   
            </NavigationMenu>
        </div>
    </div>
    )
}

export default Menu;
