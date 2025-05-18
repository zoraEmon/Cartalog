import '../index.css';
import './css/About.css';
import { AutoScroll, HtmlLoader } from '../index1.js';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout'
import { useState, useEffect } from 'react';
import lingcopinesImg from '../resources/imgs/lingcopines.jpg';
import linaImg from '../resources/imgs/lina.jpg';
import listangcoImg from '../resources/imgs/listangco.jpg';
import lobrioImg from '../resources/imgs/lobrio.jpg';
import lopezImg from '../resources/imgs/lopez.jpg';
import groupicImg from '../resources/imgs/groupic.jpg';
import cartalogBanner from '../resources/imgs/Cartalog Banner.png';
import sirImg from '../resources/imgs/sir.jpg';

function About() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | ''>('');

    const developers = [
        {
            name: "Rodel Lingcopines",
            role: "BSCS2A - San Bartolome",
            image: lingcopinesImg,
            description: "lincopinesrodel3@gmail.com",
            facebook: "https://www.facebook.com/rodel.lingcopines.73"
        },
        {
            name: "Jhan Russel Lina",
            role: "BSCS2A - San Bartolome",
            image: linaImg,
            description: "linejhanrussel@gmail.com",
            facebook: "https://www.facebook.com/jhanrussel.lina"
        },
        {
            name: "Frankjohn Listangco",
            role: "BSCS2A - San Bartolome",
            image: listangcoImg,
            description: "frankjohnlistangco668@gmail.com",
            facebook: "https://www.facebook.com/frankjohn.listangco.3"
        },
        {
            name: "Ivahn Mika Lobrio",
            role: "BSCS2A - San Bartolome",
            image: lobrioImg,
            description: "lobrio.mika.felipe@gmail.com",
            facebook: "https://www.facebook.com/ivahnmika.lobrio"
        },
        {
            name: "Jefferson Lopez",
            role: "BSCS2A - San Bartolome",
            image: lopezImg,
            description: "lopez.jefferson.cabanos1@gmail.com",
            facebook: "https://www.facebook.com/jefferson.lopez.351098"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setSlideDirection('left');
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % developers.length);
                setSlideDirection('');
            }, 300);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleSwipe = (direction: 'left' | 'right') => {
        setSlideDirection(direction);
        setTimeout(() => {
            if (direction === 'left') {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % developers.length);
            } else {
                setCurrentIndex((prevIndex) => (prevIndex - 1 + developers.length) % developers.length);
            }
            setSlideDirection('');
        }, 300);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (Math.abs(distance) > 50) {
            handleSwipe(distance > 0 ? 'left' : 'right');
        }
        setTouchEnd(null);
        setTouchStart(null);
    };

    return (
        <Layout>
            <main>
                <div className="w-full min-h-screen bg-gray-100">
                    {/* Catalog Button in navbar area */}
                    <div className="w-full bg-white py-2 px-4 flex flex-col items-center gap-4">
                    <button
                            onClick={() => {
                              const pdfUrl = `${window.location.origin}${import.meta.env.BASE_URL}docs/Product Catalog Management System.docx.pdf`;
                              window.open(pdfUrl, "_blank", "noopener");
                            }}
                            className="transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        >
                            <img
                                src={cartalogBanner}
                                alt="Cartalog"
                                className="w-[400px] h-auto"
                            />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-600">Developer's Profile</h1>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left side - Carousel */}
                            <div className="w-full md:w-1/2 relative">
                                <div 
                                    className={`bg-white rounded-lg shadow-lg p-8 text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer min-h-[600px] flex flex-col justify-center ${
                                        slideDirection === 'left' ? 'animate-slide-left' : 
                                        slideDirection === 'right' ? 'animate-slide-right' : ''
                                    }`}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    onClick={() => window.open(developers[currentIndex].facebook, '_blank')}
                                >
                                    <div className="w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-500">
                                        <img 
                                            src={developers[currentIndex].image} 
                                            alt={developers[currentIndex].name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">{developers[currentIndex].name}</h3>
                                    <p className="text-xl text-blue-600 font-medium mb-3">{developers[currentIndex].role}</p>
                                    <p className="text-lg text-gray-600">{developers[currentIndex].description}</p>
                                </div>
                                
                                <button 
                                    onClick={() => handleSwipe('right')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 text-xl"
                                >
                                    ←
                                </button>
                                <button 
                                    onClick={() => handleSwipe('left')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 text-xl"
                                >
                                    →
                                </button>
                            </div>

                            {/* Right side - Text with background */}
                            <div className="w-full md:w-1/2 flex items-center justify-center relative">
                                <div 
                                    className="absolute inset-0 bg-cover bg-center opacity-50"
                                    style={{ backgroundImage: `url(${groupicImg})` }}
                                />
                                <div className="relative z-10 text-center max-w-md bg-white/80 p-8 rounded-lg backdrop-blur-sm">
                                    <p className="text-gray-700 text-lg mb-6">
                                        In partial Fulfillment of the Requirements in IM101 and PL101 courses
                                        <br />
                                        (Advance Database Design and Programming Languages)
                                    </p>
                                    <p className="text-gray-700 text-lg mb-3">Submitted To:</p>
                                    <div className="w-48 h-48 mx-auto mb-4 overflow-hidden border-4 border-blue-500">
                                        <img 
                                            src={sirImg} 
                                            alt="Dr. Manuel Luis C. Delos Santos" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-gray-700 text-xl font-semibold mb-2">Dr. Manuel Luis C. Delos Santos</p>
                                    <p className="text-gray-700 text-lg">Professor</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default About;