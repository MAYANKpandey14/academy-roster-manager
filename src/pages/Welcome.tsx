
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mail, Phone } from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        // Preload background image
        const img = new Image();
        img.src = '/images.svg';
        img.onload = () => setImageLoaded(true);
    }, []);

    const handleNext = () => {
        navigate("/trainees");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* Background div */}
            <div
                className="absolute inset-0 w-full h-full"
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
                <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black m-2 font-mangal">
                    आरटीसी प्रशिक्षु प्रबंधन प्रणाली
                </h1>
                <button
                    onClick={handleNext}
                    className="m-4 px-4 sm:px-6 py-2 bg-blue-600 border-2 border-blue-600 hover:bg-white hover:text-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mangal"
                    aria-label="डैशबोर्ड खोलें"
                >
                    डैशबोर्ड खोलें
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
