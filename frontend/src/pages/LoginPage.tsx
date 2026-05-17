import Menu from "@/components/Menu";
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { RegisterCard } from "@/components/registerCard";

function LoginPage() {
    const [activeTab, setActiveTab] = React.useState("signIn")
    const [emailLogin, setEmailLogin] = React.useState("");
    const [passwordLogin, setPasswordLogin] = React.useState("");
    const auth = useAuth();

    const handleLogin = async () => {
        const id = toast.loading("Logging in...");
        try {
            if (emailLogin === "" && passwordLogin === "") {
                toast.warning("Email and password are required", {id});
                return;
            }

            await auth.login(emailLogin, passwordLogin);
            toast.success("Login successful!", {id, duration: 2000});
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Login failed";
            toast.error(msg, {id});
        }
    }

    const handleGoogleLogin = async () => {
        const id = toast.loading("Signing in with Google...");
        try {
            await auth.loginWithGoogle();
            toast.success("Login successful!", {id, duration: 2000});
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Google login failed";
            toast.error(msg, {id});
        }
    }

    const handleRegister = async (data: { name: string; email: string; password: string; repeatPassword: string; gender: string; date: Date | undefined }) => {
        const id = toast.loading("Registering...");
        try {
            if (!data.email || !data.password) {
                toast.warning("Email and password are required", { id });
                return;
            }

            if (data.password !== data.repeatPassword) {
                toast.warning("Passwords do not match", { id });
                return;
            }

            await auth.register(data.email, data.password, data.name);
            toast.success("Registration successful!", { id, duration: 2000 });
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Registration failed";
            toast.error(msg, { id });
        }
    }

    return (
        <div className='w-full min-h-screen flex flex-col gap-4 p-4 bg-gray-50'>
            <Menu />
            <div className="bg-[url(/src/assets/img/background.svg)] p-4 flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-3/10 justify-center bg-white/80 mx-auto p-4 rounded-lg">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signIn">Sign In</TabsTrigger>
                        <TabsTrigger value="signUp">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signIn">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign In!</CardTitle>
                                <CardDescription>Please sign in to your account.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-email">Email</Label>
                                    <Input id="tabs-demo-email" value={emailLogin} placeholder="your.email@gmail.com" onChange={(e) => setEmailLogin(e.target.value)} />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-password">Password</Label>
                                    <Input id="tabs-demo-password" type="password" value={passwordLogin} placeholder="Your password" onChange={(e) => setPasswordLogin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}/>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">or</span>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Sign in with Google
                                </Button>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-black! text-white" onClick={handleLogin}>Sign In</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signUp">
                        <RegisterCard
                            onRegister={handleRegister}
                            title="Sign Up!"
                            description="Don't have an account? Register now!"
                            buttonText="Sign Up"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default LoginPage;
