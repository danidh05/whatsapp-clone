import { SignInButton, UserButton } from '@clerk/clerk-react';
import { Authenticated, Unauthenticated } from 'convex/react';
import './globals.css';

function App() {
    return (
        <div className="App">
            <Unauthenticated>
                <SignInButton mode="modal" />
            </Unauthenticated>
            <Authenticated>
                <UserButton />
                <Content />
            </Authenticated>
        </div>
    );
}

function Content() {
    return <div>Authenticated content goes here</div>;
}

export default App;
