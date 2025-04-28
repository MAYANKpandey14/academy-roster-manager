import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Welcome = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        // Only log errors for invalid routes, not the welcome page itself
        if (location.pathname !== "/welcome") {
            console.error(
                "404 Error: User attempted to access non-existent route:",
                location.pathname
            );
        }

        // Preload background image
        const img = new Image();
        img.src = '/images.svg';
        img.onload = () => setImageLoaded(true);

    }, [location.pathname]);

    const handleNext = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* Background div */}
            <div
                className="absolute inset-0 w-full h-full "
                style={{
                    backgroundImage: imageLoaded ? "url('/images.svg')" : "none",
                    backgroundSize: "44rem 44rem",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "#ffff", // Fallback color while loading
                    opacity: 0.3,
                    zIndex: -1,
                    transition: "opacity 0.5s ease-in-out",
                }}
            />

            {/* Content positioned over the background */}
            <div className="flex flex-col items-center justify-center z-10 relative">
                <img src="/commando.png" alt="" className="w-[26rem] h-[30rem] " style={{
                    filter: "drop-shadow(0.5rem .75rem .75rem rgba(0, 0, 0, 1))",
                }} />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-black m-2">
                    RTC POLICE LINE, MORADABAD
                </h1>
                <button
                    onClick={handleNext}
                    className="m-2 px-4 sm:px-6 py-2 bg-blue-600 border-2 border-blue-600 hover:bg-white hover:text-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Open Dashboard"
                >
                    Open Dashboard
                </button>
            </div>
        </div>
    );
};

export default Welcome;