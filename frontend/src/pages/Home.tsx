import '../index.css';
import './css/Home.css';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import miata from '../resources/Featcars/miatamx5.png';
import civic from '../resources/Featcars/civic.png';
import raptor from '../resources/Featcars/Raptor.png';
import fortuner from '../resources/Featcars/Fortuner.png';
import nsx from '../resources/Featcars/NSX.png';
import { useState, useEffect, useRef } from 'react';

const featuredCars = [
  { src: miata, alt: 'Mazda MX-5 Miata' },
  { src: civic, alt: 'Honda Civic' },
  { src: raptor, alt: 'Ford Raptor' },
  { src: fortuner, alt: 'Toyota Fortuner' },
  { src: nsx, alt: 'Honda NSX' },
];

function Home() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection('right');
      setCurrent((prev) => (prev + 1) % featuredCars.length);
    }, 3000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    resetTimer();
    // eslint-disable-next-line
  }, [current]);

  const nextCar = () => {
    setDirection('right');
    setCurrent((current + 1) % featuredCars.length);
  };
  const prevCar = () => {
    setDirection('left');
    setCurrent((current - 1 + featuredCars.length) % featuredCars.length);
  };

  return (
    <Layout>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Every Vehicle at a Glance</h1>
          <p className="hero-subtext">Explore an expertly curated global catalog of cars, SUVs, trucks, and specialty models complete with detailed specs, high-resolution images, and performance data.</p>
          <button className="hero-enquiry-btn" onClick={() => navigate('/Catalog')}>Get Started</button>
        </div>
        <div className="hero-carousel">
          <button className="carousel-arrow left" onClick={prevCar} aria-label="Previous car">&#8592;</button>
          <div className="carousel-image-wrapper">
            {featuredCars.map((car, idx) => (
              <div
                key={car.alt}
                className={`carousel-border${current === idx ? ' active' : ''}`}
              >
                <img
                  src={car.src}
                  alt={car.alt}
                  className={`carousel-image${current === idx ? ' active ' + direction : ''}`}
                  onClick={() => navigate('/Catalog')}
                  style={{ cursor: 'pointer' }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <button className="carousel-arrow right" onClick={nextCar} aria-label="Next car">&#8594;</button>
        </div>
      </div>
    </Layout>
  );
}

export default Home;