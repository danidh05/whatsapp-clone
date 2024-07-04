import { useState, useEffect, useRef } from "react";

// Define an interface to type the returned values from the hook
interface ComponentVisibleHook {
    ref: React.RefObject<any>;
    isComponentVisible: boolean;
    setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

// Custom hook to manage component visibility based on outside clicks
export default function useComponentVisible(initialIsVisible: boolean): ComponentVisibleHook {
    // State to keep track of the visibility of the component
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    // Ref to attach to the component we want to detect outside clicks for
    const ref = useRef<any>(null);

    // Function to handle clicks outside the referenced component
    const handleClickOutside = (event: MouseEvent) => {
        // Check if the click is outside the component
        if (ref.current && !ref.current.contains(event.target as Node)) {
            // If the click is outside, set the component visibility to false
            setIsComponentVisible(false);
        }
    };

    // useEffect hook to add and clean up the event listener
    useEffect(() => {
        // Add event listener for clicks on the document
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            // Remove event listener on cleanup to avoid memory leaks
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount and cleanup on unmount

    // Return the ref and visibility state along with a function to set the visibility state
    return { ref, isComponentVisible, setIsComponentVisible };
}
