import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaBookOpen,
  FaTrophy,
  FaUserPlus,
  FaBullhorn,
  FaRocket,
  FaChartLine,
  FaFileAlt,
  FaStar,
  FaMedal,
  FaPaintBrush,
  FaCrown,
  FaFireAlt,
  FaUsers,
  FaClock,
} from "react-icons/fa";
import { RiUserAddLine } from "react-icons/ri";

// Pool of Indian names for user-related alerts
const namePool = [
  "Rohan",
  "Priya",
  "Arjun",
  "Anjali",
  "Neha",
  "Vikram",
  "Sneha",
  "Amit",
  "Shreya",
  "Rahul",
  "Pooja",
  "Karan",
  "Divya",
  "Siddharth",
  "Meera",
  "Aditya",
  "Kavya",
  "Nikhil",
  "Riya",
  "Sanjay",
  "Tanvi",
  "Manish",
  "Ishita",
  "Raj",
  "Avni",
  "Suraj",
  "Naina",
  "Varun",
  "Tanya",
  "Deepak",
  "Jatin",
  "Preeti",
  "Abhishek",
  "Mitali",
  "Rakesh",
  "Isha",
  "Dhruv",
  "Simran",
  "Harsh",
  "Juhi",
  "Kunal",
  "Ayesha",
  "Parth",
  "Diya",
  "Yash",
  "Bhavna",
  "Gaurav",
  "Kirti",
  "Mohit",
  "Trisha",
  "Ankit",
  "Payal",
  "Suresh",
  "Lavanya",
  "Kartik",
  "Sonam",
  "Naveen",
  "Chandni",
  "Uday",
  "Radhika",
  "Vishal",
  "Rekha",
  "Nitin",
  "Aparna",
  "Ajay",
  "Kriti",
  "Ravi",
  "Namrata",
  "Ashwin",
  "Jaya",
  "Dev",
  "Swati",
  "Lokesh",
  "Anushka",
  "Sagar",
  "Tina",
  "Harshad",
  "Ritu",
  "Pranav",
  "Sakshi",
  "Tejas",
  "Bhavya",
  "Jay",
  "Monika",
  "Tarun",
  "Nandini",
  "Pratik",
  "Vaishnavi",
  "Sahil",
  "Alka",
  "Rituraj",
  "Meghna",
  "Shyam",
  "Ira",
  "Dinesh",
  "Sanya",
  "Rajeev",
  "Amrita",
  "Sharad",
  "Karishma",
  "Manoj",
  "Shraddha",
  "Akhil",
  "Zoya",
  "Rajat",
  "Pallavi",
  "Mayank",
  "Seema",
  "Anurag",
  "Rashmi",
  "Lakshya",
  "Aarti",
  "Vivek",
  "Bharti",
  "Hemant",
  "Nargis",
  "Tushar",
  "Lata",
  "Omkar",
  "Sheetal",
  "Devansh",
  "Vandana",
  "Madhav",
  "Surbhi",
  "Farhan",
  "Snehal",
  "Imran",
  "Gayatri",
  "Kishore",
  "Amisha",
  "Yuvraj",
  "Anaya",
  "Niraj",
  "Mallika",
  "Zaid",
  "Madhuri",
  "Faizan",
  "Priyanka",
  "Kabir",
  "Urvashi",
  "Neeraj",
  "Asmita",
  "Kabeer",
  "Komal",
  "Raghav",
  "Deeksha",
  "Shivam",
  "Ankita",
  "Bhavesh",
  "Tanushree",
  "Aarav",
  "Saanvi",
  "Vedant",
  "Myra",
  "Reyansh",
  "Tara",
  "Arnav",
  "Ishaanvi",
  "Vivaan",
  "Kiyana",
  "Hrithik",
  "Mahira",
  "Aryan",
  "Kiara",
  "Shaurya",
  "Vanya",
  "Lakshay",
  "Prisha",
  "Devanshi",
  "Aarohi",
  "Ansh",
  "Mishti",
  "Krish",
  "Ridhi",
  "Neil",
  "Charvi",
  "Yuvan",
  "Anvi",
  "Rehan",
  "Avisha",
  "Atharv",
  "Suhana",
  "Ayaan",
  "Inaaya",
  "Ranveer",
  "Aadhya",
  "Reyansh",
  "Nyra",
  "Rian",
  "Aanya",
  "Tanish",
  "Kritika",
  "Samar",
  "Rhea",
  "Aarush",
  "Aaliya",
  "Vihaan",
  "Divyanshi",
  "Zayan",
  "Sharanya",
  "Ritvik",
  "Avni",
  "Nivaan",
  "Aishani",
  "Dhian",
  "Saanvika",
  "Eshaan",
  "Drishti",
  "Arush",
  "Yashvi",
  "Agastya",
  "Miraya",
  "Kiaan",
  "Vedika",
  "Shaunak",
  "Tvesa",
  "Aariz",
  "Navya",
  "Advik",
  "Kashvi",
  "Bhavin",
  "Krisha",
  "Vivik",
  "Siddhi",
  "Jivaan",
  "Saisha",
  "Ruhan",
  "Anvika",
  "Ivaan",
  "Elina",
  "Ishir",
  "Amayra",
  "Divit",
  "Kuhu",
  "Kabirraj",
  "Larisa",
  "Prayan",
  "Ruhani",
  "Sarthak",
  "Aavya",
  "Tanmay",
  "Nehal",
  "Manan",
  "Sravya",
  "Shivansh",
  "Yamika",
  "Chirag",
  "Pranika",
  "Arjit",
  "Bhawna",
];

// Alert messages with placeholders for names, WPM, accuracy, and rank
const alertMessages = [
  // New Paragraph (4)
  {
    id: "1",
    text: "New SSC CGL paragraph added! Practice now!",
    type: "new-paragraph",
    icon: <FaBookOpen />,
  },
  {
    id: "6",
    text: "New CHSL paragraph live! Boost your score!",
    type: "new-paragraph",
    icon: <FaFileAlt />,
  },
  {
    id: "9",
    text: "New UPPSC RO/ARO paragraph available! Start today!",
    type: "new-paragraph",
    icon: <FaBookOpen />,
  },
  {
    id: "14",
    text: "New NTPC paragraph added! Get typing!",
    type: "new-paragraph",
    icon: <FaFileAlt />,
  },
  // Sign-up (4)
  {
    id: "2",
    text: "{name} joined the race! Challenge them now!",
    type: "signup",
    icon: <FaUserPlus />,
  },
  {
    id: "5",
    text: "{name} signed up! Compete in the next test!",
    type: "signup",
    icon: <RiUserAddLine />,
  },
  {
    id: "8",
    text: "{name} is here! Show off your typing skills!",
    type: "signup",
    icon: <FaUserPlus />,
  },
  {
    id: "10",
    text: "{name} joined TypeSprint! Prove you’re faster!",
    type: "signup",
    icon: <RiUserAddLine />,
  },
  // Motivation (3)
  {
    id: "3",
    text: "Smash your next test to top the leaderboard!",
    type: "motivation",
    icon: <FaTrophy />,
  },
  {
    id: "7",
    text: "Accuracy is your secret weapon! Keep practicing!",
    type: "motivation",
    icon: <FaStar />,
  },
  {
    id: "11",
    text: "Unleash your speed! Crush the leaderboard!",
    type: "motivation",
    icon: <FaRocket />,
  },
  // News (3)
  {
    id: "4",
    text: "News: RRB speed challenges are live!",
    type: "news",
    icon: <FaBullhorn />,
  },
  {
    id: "12",
    text: "News: Custom themes now available!",
    type: "news",
    icon: <FaPaintBrush />,
  },
  {
    id: "16",
    text: "News: Track your progress with our new analytics!",
    type: "news",
    icon: <FaChartLine />,
  },
  // Achievement (4)
  {
    id: "17",
    text: "{name} hit {wpm} WPM in SSC CGL! Beat them NOW!",
    type: "achievement",
    icon: <FaMedal />,
  },
  {
    id: "18",
    text: "{name} nailed {accuracy}% accuracy! Match their skill!",
    type: "achievement",
    icon: <FaStar />,
  },
  {
    id: "19",
    text: "{name} completed 5 tests today! Catch up!",
    type: "achievement",
    icon: <FaCrown />,
  },
  {
    id: "20",
    text: "{name} earned a speed badge! Grab yours!",
    type: "achievement",
    icon: <FaTrophy />,
  },
  // Challenge (4)
  {
    id: "21",
    text: "{name} is #{rank} on the leaderboard! Steal their spot!",
    type: "challenge",
    icon: <FaFireAlt />,
  },
  {
    id: "22",
    text: "Beat {name}’s {wpm} WPM in 30 minutes for a badge!",
    type: "challenge",
    icon: <FaClock />,
  },
  {
    id: "23",
    text: "Only 5 points to pass {name} at #{rank}! Go now!",
    type: "challenge",
    icon: <FaCrown />,
  },
  {
    id: "24",
    text: "Top {name}’s {accuracy}% accuracy! Take the challenge!",
    type: "challenge",
    icon: <FaRocket />,
  },
  // Rivalry (4)
  {
    id: "25",
    text: "{name} is 2 WPM behind {name2}! Catch up!",
    type: "rivalry",
    icon: <FaUsers />,
  },
  {
    id: "26",
    text: "{name} overtook {name2} at #{rank}! Fight back!",
    type: "rivalry",
    icon: <FaFireAlt />,
  },
  {
    id: "27",
    text: "{name} vs. {name2}: Who’ll hit {wpm} WPM first?",
    type: "rivalry",
    icon: <FaUsers />,
  },
  {
    id: "28",
    text: "{name} is closing in on {name2}’s #{rank} rank! Join in!",
    type: "rivalry",
    icon: <FaCrown />,
  },
];

const AlertSystem = ({ darkMode, isLoading }) => {
  const [currentAlert, setCurrentAlert] = useState(null);
  const [dismissedAlerts, setDismissedAlerts] = useState(() => {
    const saved = localStorage.getItem("dismissedAlerts");
    return saved ? JSON.parse(saved) : [];
  });

  // Save dismissed alerts to localStorage
  useEffect(() => {
    localStorage.setItem("dismissedAlerts", JSON.stringify(dismissedAlerts));
  }, [dismissedAlerts]);

  // Get random name from namePool
  const getRandomName = () => {
    const randomIndex = Math.floor(Math.random() * namePool.length);
    return namePool[randomIndex];
  };

  // Get random WPM (40–80)
  const getRandomWPM = () => Math.floor(Math.random() * (80 - 40 + 1)) + 40;

  // Get random accuracy (90–98%)
  const getRandomAccuracy = () =>
    Math.floor(Math.random() * (98 - 90 + 1)) + 90;

  // Get random rank (1–10)
  const getRandomRank = () => Math.floor(Math.random() * 10) + 1;

  // Alert cycling logic with weighted probabilities
  useEffect(() => {
    if (isLoading) return;

    const availableAlerts = alertMessages.filter(
      (alert) => !dismissedAlerts.includes(alert.id)
    );

    if (availableAlerts.length === 0) {
      setCurrentAlert(null);
      return;
    }

    const showNextAlert = () => {
      // 70% chance for competitive alerts
      const competitiveTypes = ["achievement", "challenge", "rivalry"];
      const isCompetitive = Math.random() < 0.7;
      const filteredAlerts = isCompetitive
        ? availableAlerts.filter((alert) =>
            competitiveTypes.includes(alert.type)
          )
        : availableAlerts;

      if (filteredAlerts.length === 0) return;

      const randomIndex = Math.floor(Math.random() * filteredAlerts.length);
      const selectedAlert = filteredAlerts[randomIndex];

      // Replace placeholders
      let displayText = selectedAlert.text;
      if (["signup", "achievement", "challenge"].includes(selectedAlert.type)) {
        displayText = displayText.replace("{name}", getRandomName());
        if (displayText.includes("{wpm}")) {
          displayText = displayText.replace("{wpm}", getRandomWPM());
        }
        if (displayText.includes("{accuracy}")) {
          displayText = displayText.replace("{accuracy}", getRandomAccuracy());
        }
        if (displayText.includes("{rank}")) {
          displayText = displayText.replace("{rank}", getRandomRank());
        }
      } else if (selectedAlert.type === "rivalry") {
        const name1 = getRandomName();
        let name2 = getRandomName();
        while (name2 === name1) name2 = getRandomName();
        displayText = displayText
          .replace("{name}", name1)
          .replace("{name2}", name2);
        if (displayText.includes("{wpm}")) {
          displayText = displayText.replace("{wpm}", getRandomWPM());
        }
        if (displayText.includes("{rank}")) {
          displayText = displayText.replace("{rank}", getRandomRank());
        }
      }

      setCurrentAlert({ ...selectedAlert, text: displayText });
    };

    showNextAlert();
    const interval = setInterval(showNextAlert, 5000);
    return () => clearInterval(interval);
  }, [isLoading, dismissedAlerts]);

  // Dismiss alert handler
  const handleDismiss = useCallback(() => {
    if (currentAlert) {
      setDismissedAlerts((prev) => [...prev, currentAlert.id]);
      setCurrentAlert(null);
    }
  }, [currentAlert]);

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs w-full md:max-w-sm">
      <AnimatePresence>
        {currentAlert && (
          <motion.div
            key={currentAlert.id}
            className={`relative bg-gradient-to-r ${
              currentAlert.type === "new-paragraph"
                ? "from-blue-600 to-indigo-900"
                : currentAlert.type === "signup"
                ? "from-green-600 to-teal-800"
                : currentAlert.type === "motivation"
                ? "from-pink-600 to-rose-800"
                : currentAlert.type === "news"
                ? "from-purple-600 to-violet-800"
                : currentAlert.type === "achievement"
                ? "from-yellow-600 to-amber-800"
                : currentAlert.type === "challenge"
                ? "from-red-600 to-orange-600"
                : "from-orange-600 to-red-800" // rivalry
            } rounded-lg p-4 shadow-lg text-white flex items-center justify-between backdrop-blur-md border border-white/10`}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            aria-live="polite"
          >
            <div className="flex items-center space-x-3">
              <span
                className="text-lg md:text-xl transform hover:scale-110 transition-transform duration-300"
                style={{
                  color: "#ffd700",
                  textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                }}
                data-testid="alert-icon"
              >
                {currentAlert.icon}
              </span>
              <p className="text-sm md:text-base font-semibold pr-4 leading-tight">
                {currentAlert.text}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-200 hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-full p-1"
              aria-label="Dismiss alert"
            >
              <FaTimes size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(AlertSystem);
