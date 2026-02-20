# AlgoSphere

**Master Code. Grow Together.**

AlgoSphere is a modern web platform that blends rigorous technical training with a professional developer network. Solve algorithmic problems, share insights with peers, and advance your career.

## ✨ Features

### 🧩 Adaptive Problem Solving
- **Curated Problem Set** — Access 500+ classic algorithm problems
- **In-Browser IDE** — Write, run, and test code directly in your browser
- **Difficulty Ladders** — Problems broken down into manageable micro-concepts

### 👥 Collaborative Community
- **Live Feed** — Share insights, solutions, and "Aha!" moments
- **Developer Network** — Connect with peers and grow your professional circle
- **Direct Messages** — Collaborate and learn through private conversations

### 🚀 Career Advancement
- **Job Board** — Discover opportunities from companies looking for problem-solvers
- **Profile & XP System** — Track your progress and showcase your skills
- **Skill Verification** — Verified stats for recruiters and employers



## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **React Router** | Client-side Routing |
| **Tailwind CSS** | Styling |
| **Lucide React** | Icon Library |

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | REST API Framework |
| **SQLAlchemy** | ORM |
| **SQLite** | Database |
| **JWT (python-jose)** | Authentication |
| **bcrypt** | Password Hashing |


## 📁 Project Structure

`
algosphere/
├── src/
│   ├── assets/              # Static assets (JSON data, images)
│   ├── components/          # Reusable UI components
│   ├── context/             # React Context (AuthContext)
│   ├── pages/               # Page components
│   │   ├── LandingPage.jsx  # Home/marketing page
│   │   ├── ProblemList.jsx  # Algorithm problems browser
│   │   ├── IDE.jsx          # In-browser code editor
│   │   ├── Feed.jsx         # Social feed
│   │   ├── Network.jsx      # Developer connections
│   │   ├── Messages.jsx     # Direct messaging
│   │   ├── Courses.jsx      # Learning courses
│   │   ├── JobBoard.jsx     # Job listings
│   │   ├── Profile.jsx      # User profile
│   │   ├── Login.jsx        # Authentication
│   │   └── Signup.jsx       # User registration
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component & routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Database operations
│   ├── database.py          # Database configuration
│   └── requirements.txt     # Python dependencies
├── public/                  # Public static files
├── package.json             # Node.js dependencies
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # Tailwind CSS configuration

```
## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **npm** or **yarn**

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd algosphere
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**  
   Navigate to `http://localhost:5173`

### Backend Setup (Optional)

1. **Create a virtual environment**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate the environment**
   ```bash
   # Windows
   .\venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the API server**
   ```bash
   uvicorn main:app --reload
   ```

5. **API Docs**  
   Visit `http://localhost:8000/docs` for interactive API documentation


## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |


## 🔐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/token` | Authenticate and get JWT |
| `GET` | `/users/me` | Get current user profile |


## 🎨 Design Philosophy

AlgoSphere follows a **monochrome design system** with:
- Clean, minimalist aesthetics
- Subtle animations and hover effects
- Responsive layouts for all devices
- Glassmorphism and soft shadows




