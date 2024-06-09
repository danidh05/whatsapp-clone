// Import necessary modules
import { SignIn } from "@clerk/nextjs";

// Define SignInPage component
export default function SignInPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
            <SignIn routing="path" path="/sign-in" />
        </main>
    );
}
