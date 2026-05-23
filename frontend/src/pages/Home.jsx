import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import Tilt from "react-parallax-tilt";
import Confetti from "react-confetti";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { 
  Heart, ShoppingCart, Eye, Bookmark, TrendingUp, Sparkles, Zap, 
  Star, Crown, Gem, ChevronUp, Share2, Award, Rocket,
  Car, Bike, Trophy, Fuel, Gauge, Clock, Shield, Wrench,
  Users, ThumbsUp, Phone, Mail, MapPin, Instagram, Facebook, Twitter,
  User, Settings, LogOut, Menu, X, Search, Filter, Sliders,
  Sun, Moon, Volume2, VolumeX, Play, Pause, Download, 
  Battery, Navigation, Wind, Cloud, Droplets, Thermometer
} from "lucide-react";

// ============== REAL VEHICLE IMAGES ==============
// Bike Images
const bikeImages = {
  royalEnfield: "https://images.unsplash.com/photo-1634505434211-b3f0d4fc0459?w=600&h=400&fit=crop",
  ktm: "https://images.unsplash.com/photo-1591637333188-6e8e267ec1b7?w=600&h=400&fit=crop",
  yamaha: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop",
  bajaj: "https://images.unsplash.com/photo-1623139809630-347d6f2d38f3?w=600&h=400&fit=crop",
  honda: "https://images.unsplash.com/photo-1599819811279-d5ad9ccf8387?w=600&h=400&fit=crop",
  tvs: "https://images.unsplash.com/photo-1565843708714-52ecf69ab81f?w=600&h=400&fit=crop",
  suzukiBike: "https://images.unsplash.com/photo-1589465885857-44edb59bbff4?w=600&h=400&fit=crop",
  ducati: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&h=400&fit=crop",
  bmw: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=400&fit=crop",
  harley: "https://images.unsplash.com/photo-1558981809-8c5b5f7c7f4b?w=600&h=400&fit=crop"
};

// Car Images
const carImages = {
  hyundai: "https://images.unsplash.com/photo-1621259182978-fbf93132d3fd?w=600&h=400&fit=crop",
  tata: "https://images.unsplash.com/photo-1631295868223-63228b10f8a9?w=600&h=400&fit=crop",
  mahindra: "https://images.unsplash.com/photo-1533473359331-84c5d6888c6c?w=600&h=400&fit=crop",
  maruti: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=400&fit=crop",
  hondaCar: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d4?w=600&h=400&fit=crop",
  toyota: "https://images.unsplash.com/photo-1626663774845-3ae47f2a6f5a?w=600&h=400&fit=crop",
  bmwCar: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
  audi: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
  mercedes: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&h=400&fit=crop",
  kia: "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=600&h=400&fit=crop"
};

// Scooter Images
const scooterImages = {
  suzuki: "https://images.unsplash.com/photo-1609234656388-0ff363383899?w=600&h=400&fit=crop",
  hondaScooter: "https://images.unsplash.com/photo-1605522557861-02ac21b2e9b4?w=600&h=400&fit=crop",
  tvsScooter: "https://images.unsplash.com/photo-1626197031507-170c997ae3ac?w=600&h=400&fit=crop",
  vespa: "https://images.unsplash.com/photo-1587538968101-5b7b2e2cbe0c?w=600&h=400&fit=crop"
};

// ============== COMPLETE VEHICLE DATA WITH REAL IMAGES ==============
const allVehicles = [
  // BIKES
  { id: 1, name: "Royal Enfield Classic 350", tamilName: "ராயல் என்ஃபீல்ட்", price: 215000, originalPrice: 225000, discount: 5, category: "Bike", brand: "Royal Enfield", model: "Classic 350", year: 2024, engine: "349cc", mileage: "35 kmpl", fuelType: "Petrol", transmission: "5 Speed", topSpeed: "120 kmph", image: bikeImages.royalEnfield, likes: 2345, rating: 4.9, reviews: 456, inStock: true, isNew: true, isFeatured: true, features: ["ABS", "Dual Channel", "LED Lights", "Digital Console", "Anti-Theft"] },
  { id: 2, name: "KTM Duke 390", tamilName: "கேடிஎம் டியூக்", price: 295000, originalPrice: 310000, discount: 5, category: "Bike", brand: "KTM", model: "Duke 390", year: 2024, engine: "373cc", mileage: "28 kmpl", fuelType: "Petrol", transmission: "6 Speed", topSpeed: "160 kmph", image: bikeImages.ktm, likes: 1876, rating: 4.8, reviews: 345, inStock: true, isNew: true, isFeatured: true, features: ["Traction Control", "Quick Shifter", "TFT Display", "LED Headlamps", "Slipper Clutch"] },
  { id: 3, name: "Yamaha R15 V4", tamilName: "யமஹா ஆர்15", price: 185000, originalPrice: 195000, discount: 5, category: "Bike", brand: "Yamaha", model: "R15 V4", year: 2024, engine: "155cc", mileage: "40 kmpl", fuelType: "Petrol", transmission: "6 Speed", topSpeed: "145 kmph", image: bikeImages.yamaha, likes: 8901, rating: 4.8, reviews: 1200, inStock: true, isNew: true, isFeatured: true, features: ["VVA", "Slipper Clutch", "Traction Control", "Dual Channel ABS", "Quick Shifter"] },
  { id: 4, name: "Bajaj Pulsar NS200", tamilName: "பஜாஜ் பல்சார்", price: 145000, originalPrice: 155000, discount: 6, category: "Bike", brand: "Bajaj", model: "Pulsar NS200", year: 2024, engine: "199.5cc", mileage: "40 kmpl", fuelType: "Petrol", transmission: "6 Speed", topSpeed: "135 kmph", image: bikeImages.bajaj, likes: 3456, rating: 4.7, reviews: 678, inStock: true, isNew: false, isFeatured: false, features: ["Projector Headlamp", "Perimeter Frame", "Radial Tyres", "Digital Console", "LED DRLs"] },
  { id: 5, name: "Honda CB350", tamilName: "ஹோண்டா சிபி350", price: 210000, originalPrice: 220000, discount: 4, category: "Bike", brand: "Honda", model: "CB350", year: 2024, engine: "348cc", mileage: "36 kmpl", fuelType: "Petrol", transmission: "5 Speed", topSpeed: "130 kmph", image: bikeImages.honda, likes: 2341, rating: 4.8, reviews: 234, inStock: true, isNew: true, isFeatured: false, features: ["HSTC", "Dual ABS", "LED Lights", "Smart Key", "Bluetooth"] },
  { id: 6, name: "TVS Apache RR310", tamilName: "டிவிஎஸ் அப்பாச்சி", price: 260000, originalPrice: 270000, discount: 3, category: "Bike", brand: "TVS", model: "Apache RR310", year: 2024, engine: "312cc", mileage: "30 kmpl", fuelType: "Petrol", transmission: "6 Speed", topSpeed: "160 kmph", image: bikeImages.tvs, likes: 5678, rating: 4.8, reviews: 567, inStock: true, isNew: true, isFeatured: false, features: ["Race Tuned", "Dynamic Kits", "Cornering ABS", "Glide Through Tech", "Race Replica"] },
  { id: 7, name: "Suzuki Gixxer SF", tamilName: "சுஸூகி கிக்சர்", price: 160000, originalPrice: 170000, discount: 5, category: "Bike", brand: "Suzuki", model: "Gixxer SF", year: 2024, engine: "155cc", mileage: "45 kmpl", fuelType: "Petrol", transmission: "6 Speed", topSpeed: "135 kmph", image: bikeImages.suzukiBike, likes: 4321, rating: 4.7, reviews: 345, inStock: true, isNew: false, isFeatured: false, features: ["LED Headlamp", "Digital Console", "Dual ABS", "Suzuki Eco Performance", "Race Styling"] },
  { id: 8, name: "Ducati Monster", tamilName: "டுகாட்டி மான்ஸ்டர்", price: 1200000, originalPrice: 1350000, discount: 11, category: "Bike", brand: "Ducati", model: "Monster", year: 2024, engine: "937cc", mileage: "18 kmpl", fuelType: "Petrol", transmission: "6 Speed", topSpeed: "220 kmph", image: bikeImages.ducati, likes: 9876, rating: 4.9, reviews: 234, inStock: true, isNew: true, isFeatured: true, features: ["TFT Display", "Cornering ABS", "Launch Control", "Ducati Traction Control", "Wheelie Control"] },
  
  // CARS
  { id: 9, name: "Hyundai i20 N Line", tamilName: "ஹூண்டாய் ஐ20", price: 1250000, originalPrice: 1350000, discount: 7, category: "Car", brand: "Hyundai", model: "i20 N Line", year: 2024, engine: "1.0L Turbo", mileage: "18 kmpl", fuelType: "Petrol", transmission: "7 Speed DCT", topSpeed: "200 kmph", image: carImages.hyundai, likes: 4567, rating: 4.8, reviews: 789, inStock: true, isNew: true, isFeatured: true, features: ["Sunroof", "Bose Speakers", "360 Camera", "Ventilated Seats", "BlueLink"] },
  { id: 10, name: "Tata Nexon EV", tamilName: "டாடா நெக்சான்", price: 1450000, originalPrice: 1550000, discount: 6, category: "Car", brand: "Tata", model: "Nexon EV", year: 2024, engine: "Electric", mileage: "312 km/charge", fuelType: "Electric", transmission: "Automatic", topSpeed: "140 kmph", image: carImages.tata, likes: 5678, rating: 4.9, reviews: 890, inStock: true, isNew: true, isFeatured: true, features: ["Ziptron", "Fast Charging", "Connected Car", "Regenerative Braking", "Multi Mode Drive"] },
  { id: 11, name: "Mahindra Thar", tamilName: "மகிந்திரா தார்", price: 1650000, originalPrice: 1750000, discount: 5, category: "Car", brand: "Mahindra", model: "Thar", year: 2024, engine: "2.0L Turbo", mileage: "15 kmpl", fuelType: "Diesel", transmission: "6 Speed", topSpeed: "160 kmph", image: carImages.mahindra, likes: 7890, rating: 4.9, reviews: 1100, inStock: true, isNew: true, isFeatured: true, features: ["4x4", "Convertible Top", "Touchscreen", "Cruise Control", "Off-road Mode"] },
  { id: 12, name: "Maruti Suzuki Swift", tamilName: "மாருதி சுஸூகி ஸ்விஃப்ட்", price: 800000, originalPrice: 850000, discount: 5, category: "Car", brand: "Maruti Suzuki", model: "Swift", year: 2024, engine: "1.2L K12", mileage: "23 kmpl", fuelType: "Petrol", transmission: "5 Speed", topSpeed: "180 kmph", image: carImages.maruti, likes: 3456, rating: 4.7, reviews: 2345, inStock: true, isNew: false, isFeatured: false, features: ["LED Projector", "Keyless Entry", "Touchscreen", "Reverse Camera", "Auto AC"] },
  { id: 13, name: "Honda City", tamilName: "ஹோண்டா சிட்டி", price: 1200000, originalPrice: 1280000, discount: 6, category: "Car", brand: "Honda", model: "City", year: 2024, engine: "1.5L i-VTEC", mileage: "18 kmpl", fuelType: "Petrol", transmission: "CVT", topSpeed: "190 kmph", image: carImages.hondaCar, likes: 6789, rating: 4.8, reviews: 1567, inStock: true, isNew: true, isFeatured: true, features: ["Sunroof", "Lane Watch", "Honda Sensing", "Leather Seats", "Premium Audio"] },
  { id: 14, name: "Toyota Fortuner", tamilName: "டொயோட்டா ஃபார்ச்சூனர்", price: 3800000, originalPrice: 4000000, discount: 5, category: "SUV", brand: "Toyota", model: "Fortuner", year: 2024, engine: "2.8L Diesel", mileage: "12 kmpl", fuelType: "Diesel", transmission: "6 Speed", topSpeed: "180 kmph", image: carImages.toyota, likes: 9876, rating: 4.9, reviews: 2345, inStock: true, isNew: true, isFeatured: true, features: ["4x4", "7 Seats", "Ventilated Seats", "JBL Audio", "Panoramic Sunroof"] },
  { id: 15, name: "BMW 3 Series", tamilName: "பிஎம்டபிள்யூ 3", price: 5500000, originalPrice: 5800000, discount: 5, category: "Luxury Car", brand: "BMW", model: "3 Series", year: 2024, engine: "2.0L TwinPower", mileage: "15 kmpl", fuelType: "Petrol", transmission: "8 Speed", topSpeed: "250 kmph", image: carImages.bmwCar, likes: 8765, rating: 4.9, reviews: 567, inStock: true, isNew: true, isFeatured: true, features: ["M Sport Package", "Laser Lights", "Gesture Control", "Harman Kardon", "Driving Assistant"] },
  { id: 16, name: "Audi Q5", tamilName: "ஆடி க்யூ5", price: 6500000, originalPrice: 6800000, discount: 4, category: "Luxury SUV", brand: "Audi", model: "Q5", year: 2024, engine: "2.0L TFSI", mileage: "14 kmpl", fuelType: "Petrol", transmission: "7 Speed", topSpeed: "230 kmph", image: carImages.audi, likes: 7654, rating: 4.8, reviews: 456, inStock: true, isNew: true, isFeatured: true, features: ["Quattro", "Virtual Cockpit", "Bang & Olufsen", "Ambient Lighting", "Park Assist"] },
  { id: 17, name: "Kia Seltos", tamilName: "கியா செல்டாஸ்", price: 1600000, originalPrice: 1700000, discount: 5, category: "SUV", brand: "Kia", model: "Seltos", year: 2024, engine: "1.5L Turbo", mileage: "17 kmpl", fuelType: "Petrol", transmission: "7 Speed DCT", topSpeed: "190 kmph", image: carImages.kia, likes: 5432, rating: 4.8, reviews: 3456, inStock: true, isNew: true, isFeatured: false, features: ["UVO Connect", "Bose Sound", "Ventilated Seats", "Panoramic Sunroof", "Air Purifier"] },
  
  // SCOOTERS
  { id: 18, name: "Suzuki Access 125", tamilName: "சுஸூகி அக்சஸ்", price: 85000, originalPrice: 90000, discount: 5, category: "Scooter", brand: "Suzuki", model: "Access 125", year: 2024, engine: "124cc", mileage: "50 kmpl", fuelType: "Petrol", transmission: "CVT", topSpeed: "90 kmph", image: scooterImages.suzuki, likes: 6789, rating: 4.7, reviews: 1001, inStock: true, isNew: false, isFeatured: false, features: ["External Fuel Fill", "Silent Start", "Large Boot Space", "LED Headlamp", "Digital Console"] },
  { id: 19, name: "Honda Activa 6G", tamilName: "ஹோண்டா ஆக்டிவா", price: 82000, originalPrice: 88000, discount: 6, category: "Scooter", brand: "Honda", model: "Activa 6G", year: 2024, engine: "109cc", mileage: "55 kmpl", fuelType: "Petrol", transmission: "CVT", topSpeed: "85 kmph", image: scooterImages.hondaScooter, likes: 9876, rating: 4.8, reviews: 2345, inStock: true, isNew: true, isFeatured: true, features: ["BS6 Engine", "Combi Brake", "Tubeless Tyres", "External Fuel Fill", "Digital Display"] },
  { id: 20, name: "TVS Jupiter", tamilName: "டிவிஎஸ் ஜூப்பிட்டர்", price: 78000, originalPrice: 85000, discount: 8, category: "Scooter", brand: "TVS", model: "Jupiter", year: 2024, engine: "109cc", mileage: "55 kmpl", fuelType: "Petrol", transmission: "CVT", topSpeed: "85 kmph", image: scooterImages.tvsScooter, likes: 7654, rating: 4.7, reviews: 1876, inStock: true, isNew: false, isFeatured: false, features: ["Econometer", "Eco Mode", "Power Mode", "Mobile Charger", "Anti-theft Alarm"] }
];

// AI Assistant Component
const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, isUser: true }]);
    setTimeout(() => {
      let response = "Thanks for your query! Our team will contact you shortly.";
      if (input.toLowerCase().includes("price")) response = "Prices range from ₹78,000 to ₹65,00,000 depending on the vehicle.";
      if (input.toLowerCase().includes("emi")) response = "We offer EMI options starting from 0% interest. Contact us for details!";
      if (input.toLowerCase().includes("test ride")) response = "You can book a test ride by calling +91 98765 43210.";
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);
    setInput("");
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-24 right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition">
        <Sparkles className="h-6 w-6" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="fixed bottom-36 right-8 w-80 bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5" /> AI Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-3/4 p-3 rounded-xl ${msg.isUser ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-200"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700 flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage()} placeholder="Ask me anything..." className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button onClick={sendMessage} className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition"><Send className="h-5 w-5" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Vehicle Card Component
const VehicleCard = ({ vehicle, onAddToCart, onLike, isLiked }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const handleAddToCart = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    onAddToCart(vehicle);
  };

  return (
    <>
      {showConfetti && <Confetti numberOfPieces={100} recycle={false} />}
      <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} whileHover={{ y: -10 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} className="break-inside-avoid mb-6">
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.3} scale={1.02}>
          <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              {vehicle.discount > 0 && <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">{vehicle.discount}% OFF</div>}
              {vehicle.isNew && <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">NEW</div>}
              {vehicle.isFeatured && <div className="absolute bottom-20 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><Star className="h-3 w-3" /> FEATURED</div>}
              <div className={`absolute bottom-4 left-4 right-4 flex justify-between gap-2 transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                <button onClick={handleAddToCart} className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-3 shadow-xl hover:scale-110 transition"><ShoppingCart className="h-5 w-5 text-white" /></button>
                <button onClick={() => onLike(vehicle.id)} className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-xl hover:scale-110 transition"><Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-700 dark:text-white"}`} /></button>
                <button className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-xl hover:scale-110 transition"><Share2 className="h-5 w-5 text-gray-700 dark:text-white" /></button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div><h3 className="font-bold text-gray-900 dark:text-white text-lg">{vehicle.name}</h3><p className="text-xs text-gray-500">{vehicle.tamilName}</p></div>
                <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span className="text-sm font-semibold">{vehicle.rating}</span></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div><p className="text-2xl font-bold text-orange-500">₹{vehicle.price.toLocaleString()}</p><p className="text-xs text-gray-400 line-through">₹{vehicle.originalPrice.toLocaleString()}</p></div>
                <div className="text-right"><p className="text-xs text-gray-600">{vehicle.brand}</p><p className="text-xs text-gray-500">{vehicle.model}</p></div>
              </div>
              <div className="flex gap-2 mt-3">{vehicle.features.slice(0, 3).map((f, i) => (<span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{f}</span>))}</div>
            </div>
          </div>
        </Tilt>
      </motion.div>
    </>
  );
};

// Generate more vehicles for infinite scroll
const generateMoreVehicles = (startId) => {
  const newVehicles = [];
  for (let i = 0; i < 6; i++) {
    const base = allVehicles[i % allVehicles.length];
    newVehicles.push({ ...base, id: startId + i, name: `${base.name} ${Math.floor(Math.random() * 100) + 1}`, likes: Math.floor(Math.random() * 5000) + 1000 });
  }
  return newVehicles;
};

// Typing Animation
const TypingAnimation = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const phrases = ["Discover Premium Vehicles 🏍️🚗", "Best Deals in Tamil Nadu 💰", "Zero Down Payment 🎯", "Free Test Ride Available 🏁"];
  useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !reverse) { setReverse(true); return; }
    if (subIndex === 0 && reverse) { setReverse(false); setIndex((prev) => (prev + 1) % phrases.length); return; }
    const timeout = setTimeout(() => setSubIndex(prev => prev + (reverse ? -1 : 1)), 100);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);
  useEffect(() => setText(phrases[index].substring(0, subIndex)), [subIndex, index]);
  return <div className="text-xl md:text-2xl text-orange-300 mb-6 block h-16">{text}<span className="animate-pulse">|</span></div>;
};

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2"><span className="text-2xl">🏍️</span><span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Tamil Auto Hub</span></div>
          <div className="hidden md:flex items-center gap-6"><a href="#" className="text-white hover:text-orange-500">Home</a><a href="#vehicles" className="text-white hover:text-orange-500">Vehicles</a><a href="#about" className="text-white hover:text-orange-500">About</a><a href="#contact" className="text-white hover:text-orange-500">Contact</a><a href="#" className="text-white hover:text-orange-500">Offers</a></div>
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-orange-500"><Search className="h-5 w-5" /></button>
            <button className="relative group">
              <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" onClick={() => setShowProfile(!showProfile)} />
              {showProfile && (<div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2"><button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 flex items-center gap-2"><User className="h-4 w-4" /> Profile</button><button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 flex items-center gap-2"><Settings className="h-4 w-4" /> Settings</button><button className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 flex items-center gap-2"><LogOut className="h-4 w-4" /> Logout</button></div>)}
            </button>
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          </div>
        </div>
        {isMenuOpen && (<div className="md:hidden py-4 border-t border-gray-800"><a href="#" className="block py-2 text-white hover:text-orange-500">Home</a><a href="#vehicles" className="block py-2 text-white hover:text-orange-500">Vehicles</a><a href="#about" className="block py-2 text-white hover:text-orange-500">About</a><a href="#contact" className="block py-2 text-white hover:text-orange-500">Contact</a></div>)}
      </div>
    </nav>
  );
};

// Main Component
const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [likedVehicles, setLikedVehicles] = useState([]);
  const [toast, setToast] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => { setVehicles(allVehicles); setLoading(false); }, []);

  const fetchMoreData = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => { setVehicles(prev => [...prev, ...generateMoreVehicles(prev.length + 1)]); setHasMore(vehicles.length < 50); setLoading(false); }, 1000);
  };

  const showToast = (msg) => { setToast({ message: msg }); setTimeout(() => setToast(null), 2500); };
  const handleAddToCart = (v) => { setCartItems(prev => [...prev, v]); showToast(`${v.name} added to enquiry! 🏍️`); };
  const handleLike = (id) => { setLikedVehicles(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); showToast(likedVehicles.includes(id) ? "Removed" : "Added to wishlist! ❤️"); };

  const categories = ["All", "Bike", "Car", "SUV", "Scooter", "Luxury Car", "Luxury SUV"];
  const filteredVehicles = activeCategory === "All" ? vehicles : vehicles.filter(v => v.category === activeCategory);

  useEffect(() => { const handleScroll = () => setShowBackToTop(window.scrollY > 500); window.addEventListener("scroll", handleScroll); return () => window.removeEventListener("scroll", handleScroll); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navbar />
      <motion.div className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 z-40" style={{ scaleX, transformOrigin: "0%" }} />
      <AnimatePresence>{toast && (<motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="fixed top-24 right-4 z-50 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl">{toast.message}</motion.div>)}</AnimatePresence>
      
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600" alt="Hero" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50" /></div>
        <div className="relative z-10 text-center text-white px-4"><motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-4">🏍️</motion.div><h1 className="text-5xl md:text-7xl font-bold mb-4">Tamil Nadu's <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Premium Auto Hub</span></h1><TypingAnimation /><div className="flex gap-4 justify-center"><button onClick={() => document.getElementById('vehicles')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 rounded-full font-semibold hover:scale-105 transition">View All Vehicles →</button><button className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">Book Test Ride</button></div></div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"><ChevronUp className="h-8 w-8 rotate-180" /></motion.div>
      </div>
      
      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-16"><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[{ label: "Vehicles", value: 50, icon: Car }, { label: "Customers", value: 50000, icon: Users }, { label: "Test Rides", value: 100, icon: Trophy }, { label: "Ratings", value: 4.9, icon: Star }].map((stat, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center cursor-pointer"><stat.icon className="h-10 w-10 mx-auto mb-3" /><p className="text-3xl font-bold"><CountUp end={stat.value} duration={2.5} />+</p><p className="text-sm">{stat.label}</p></motion.div>))}</div></div>
      
      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 mb-8"><div className="flex gap-3 justify-center flex-wrap">{categories.map(cat => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-full font-semibold transition ${activeCategory === cat ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>{cat}</button>))}</div></div>
      
      {/* Vehicles Grid */}
      <div id="vehicles" className="max-w-7xl mx-auto px-4 py-8"><InfiniteScroll dataLength={filteredVehicles.length} next={fetchMoreData} hasMore={hasMore} loader={<div className="text-center py-8 text-gray-400">Loading more vehicles... 🚗🏍️</div>} endMessage={<div className="text-center py-12"><div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl"><Trophy className="h-6 w-6" /><span className="font-bold text-lg">🏆 You've explored all {filteredVehicles.length} premium vehicles! 🏆</span></div></div>}><div className="columns-1 md:columns-2 lg:columns-3 gap-6">{filteredVehicles.map((v, idx) => (<VehicleCard key={v.id} vehicle={v} onAddToCart={handleAddToCart} onLike={handleLike} isLiked={likedVehicles.includes(v.id)} />))}</div></InfiniteScroll></div>
      
      {/* AI Assistant */}
      <AIAssistant />
      
      {/* Floating Cart */}
      {cartItems.length > 0 && (<motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-2"><ShoppingCart className="h-6 w-6" /><span className="font-bold text-lg">{cartItems.length}</span></motion.button>)}
      
      {/* Back to Top */}
      {showBackToTop && (<motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1, rotate: 360 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-8 left-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl z-50"><Rocket className="h-6 w-6" /></motion.button>)}
    </div>
  );
};

// Add Send icon import
const Send = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

export default Home;
