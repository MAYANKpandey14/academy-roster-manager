
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/languageswitch/LanguageSwitcher";
import { Mail,Phone } from 'lucide-react';

const Welcome = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);
    const { t } = useTranslation();

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
            {/* Language Switcher positioned at top-right */}
            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher />
            </div>

            {/* Background div */}
            <div
                className="absolute inset-0 w-full h-full "
                style={{
                    backgroundImage: imageLoaded ? "url('/images.svg')" : "none",
                    backgroundSize: "36rem 36rem",
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
                <img src="/commando.png" alt="" className="w-mid h-mid md:w-large md:h-large" style={{
                    filter: "drop-shadow(0.5rem .75rem .75rem rgba(0, 0, 0, 1))",
                }} />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black m-2">
                    {t("headerTitle")}
                </h1>
                <button
                    onClick={handleNext}
                    className="m-4 px-4 sm:px-6 py-2 bg-blue-600 border-2 border-blue-600 hover:bg-white hover:text-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label={t("openDashboard")}
                >
                    {t("openDashboard")}
                </button>
            </div>
            <div className="flex flex-col items-center align-bottom text-center text-gray-600">
                <p className="font-light m-2 text-md">Made by - Mayank Pandey, BTECH CSE, Freelance Full Stack Developer</p>
                <div className="flex justify-center space-x-4 text-black">
                <a href="mailto:'mayankpandeyofficial404@gmail.com'" className="text-md"><Mail></Mail></a>
                <a href="tel:'+917505728099'" className="text-md"><Phone></Phone></a>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
