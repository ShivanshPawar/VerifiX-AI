import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollManager() {
    const location = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        // Enable native browser scroll restoration
        window.history.scrollRestoration = "auto";

        // Only scroll to top for NEW navigations
        if (navigationType === "PUSH") {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant",
            });
        }
    }, [location, navigationType]);

    return null;
}