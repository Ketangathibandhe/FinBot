# FinBot

**AI-Powered Expense Tracking via Telegram Bot & Web Dashboard**

[Live Demo](https://fin-bot.dev)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [System Workflows](#system-workflows)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## Overview

**FinBot** is an AI-powered expense tracking application that simplifies personal finance management through a combination of Telegram bot integration and a modern web dashboard. Instead of manually entering every expense, users can simply send a text message like "100 momos" or upload a bill photo to the Telegram bot, and AI automatically extracts the amount, item name, category, and payment mode.

The platform provides real-time expense tracking, intelligent categorization, visual analytics, monthly PDF reports, and customizable spending insights—all accessible through both Telegram and a comprehensive web interface.

### What Makes FinBot Different?

- **Natural Language Processing**: AI understands casual messages and extracts expense details automatically
- **Receipt Scanning**: Upload bill photos and AI reads the total amount, merchant name, and payment mode
- **Dual Interface**: Full-featured web dashboard and convenient Telegram bot access
- **Real-Time Sync**: Expenses added via bot instantly appear on the web dashboard using Socket.IO
- **Smart Categorization**: AI automatically assigns categories like Food, Travel, Fuel, Shopping, etc.
- **Monthly Reports**: Generate professional PDF statements with spending breakdowns
- **Multi-Language Support**: AI processes receipts in English and Hindi

---

## Key Features

### Telegram Bot Integration
- **One-Time Linking**: Generate a unique code from the website and send it to the bot to link your account
- **Text-Based Entry**: Simply message "spent 100 for petrol" and the bot saves it
- **Receipt Scanning**: Upload bill photos and AI extracts amount, merchant, category, and payment mode
- **Instant Feedback**: Delete button appears with every expense for quick corrections
- **Monthly Reports**: Use `/report` command to get a PDF statement of current month expenses
- **Forgot Password Recovery**: Receive OTP via bot for secure password reset

### Web Dashboard
- **Real-Time Updates**: Expenses added via bot appear instantly on the dashboard without refresh
- **Visual Analytics**: 
  - Spending activity charts showing daily expense trends
  - Category breakdown with pie charts
  - Cash vs Online payment distribution
  - Recent transactions list with delete functionality
- **Expense Management**: Manually add expenses through the web interface with photo upload support
- **Monthly Reports**: Download PDF statements for any month/year combination
- **Interactive Widgets**: Stats grid showing total spent, transaction count, payment mode split, and top category

### AI-Powered Analysis
- **Gemini 2.5 Flash Integration**: Advanced OCR and natural language understanding
- **Automatic Categorization**: Intelligently assigns expenses to predefined categories
- **Multi-Format Support**: Processes both text messages and receipt images
- **Payment Mode Detection**: Identifies Cash or Online payments from context
- **Hindi Language Support**: Reads receipts in Hindi and extracts relevant details

### Security & Authentication
- **JWT-Based Authentication**: Secure token-based login system
- **Password Reset Flow**: OTP sent via Telegram bot for verification
- **Account Linking Validation**: One-time verification codes with expiration
- **Strong Password Requirements**: Enforced during signup for security

---

## Architecture

FinBot employs a **modern full-stack architecture** with real-time communication capabilities and AI-powered analysis.

### System Components
```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vercel/Render)                          │   │
│  │  - React Components  - Recharts Visualizations           │   │
│  │  - Real-time Updates - Socket.IO Client                  │   │
│  │  - Zustand State Management                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS / WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express API Server (Render)                             │   │
│  │  - REST Endpoints    - JWT Authentication                │   │
│  │  - Socket.IO Server  - Session Management                │   │
│  │  - Telegram Bot      - File Upload Handling              │   │
│  │  - PDF Generation    - Email Notifications               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ API Calls
┌─────────────────────────────────────────────────────────────────┐
│                      AI ANALYSIS LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Google Gemini API                                       │   │
│  │  - Receipt OCR                                           │   │
│  │  - Text Understanding                                    │   │
│  │  - Category Classification                               │   │
│  │  - Amount Extraction                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                            |
│           ┌─────────────────┐  ┌─────────────────┐              │
│           │  MongoDB        │  │  Telegram API   │              │
│           │  - User Data    │  │  - Bot Messages │              │
│           │  - Expenses     │  │  - File Uploads │              │
│           │  - Analytics    │  │  - Notifications│              │
│           └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**1. Telegram Bot as Primary Input**
- **Telegraf Framework**: Robust bot development with built-in session management
- **Webhook Integration**: Real-time message processing with instant responses
- **File Handling**: Direct integration with Telegram's file API for receipt uploads
- **Command System**: Structured commands for reports and account management

**2. Real-Time Synchronization**
- **Socket.IO**: Bidirectional communication between server and clients
- **Room-Based Events**: User-specific event broadcasting for privacy
- **Instant Updates**: Expenses added via bot trigger dashboard refresh immediately
- **Connection Management**: Automatic reconnection handling for reliability

**3. AI-Powered Processing**
- **Google Gemini 2.5 Flash**: Latest model for accurate OCR and text understanding
- **Structured Output**: JSON responses parsed for reliable data extraction
- **Fallback Handling**: Graceful degradation when AI service unavailable
- **Batch Processing**: Efficient API usage with request batching

**4. Data Flow**
- **User Journey**: Telegram → Express API → MongoDB → Socket.IO → React Dashboard
- **Analysis Pipeline**: Image/Text → Gemini API → Structured Data → Database
- **Report Generation**: MongoDB Query → PDFKit Processing → File Download/Telegram Send

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI component library |
| Vite | 6.0.11 | Build tool and dev server |
| Zustand | 5.0.2 | State management |
| Recharts | 2.15.1 | Line charts and area graphs |
| Axios | 1.11.0 | HTTP client |
| Socket.io-client | 4.8.1 | Real-time communication |
| Lucide React | 0.469.0 | Icon library |
| React Hot Toast | 2.4.1 | Notification system |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |

### Backend (Node.js)
| Technology | Purpose |
|------------|---------|
| **Express.js** | REST API framework |
| **Telegraf** | Telegram bot framework |
| **Mongoose** | MongoDB object modeling |
| **Socket.io** | WebSocket server |
| **JWT** | Authentication tokens |
| **Bcrypt** | Password hashing |
| **Axios** | HTTP requests to external APIs |
| **PDFKit-Table** | PDF report generation |
| **Multer** | File upload handling |
| **Validator** | Input validation |
| **Google Generative AI** | Gemini API integration |

### Database & Infrastructure
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Cloud database for user and expense data |
| **Render** | Backend hosting with automatic deployments |
| **Vercel** | Frontend hosting with edge network |
| **Telegram Bot API** | Bot messaging and file handling |
| **Google Gemini API** | AI-powered OCR and text analysis |

---

## System Workflows

### 1. Account Linking Flow
```mermaid
sequenceDiagram
    participant User
    participant Website
    participant Express
    participant MongoDB
    participant Telegram
    participant Bot

    User->>Website: Login to FinBot
    Website->>Express: Request verification code
    Express->>MongoDB: Generate 6-digit code
    Express->>MongoDB: Save code to user record
    Express-->>Website: Return code (e.g., 849201)
    Website-->>User: Display code
    User->>Telegram: Open Telegram app
    User->>Bot: Send /start 849201
    Bot->>Express: Verify code
    Express->>MongoDB: Find user with code
    MongoDB-->>Express: User found
    Express->>MongoDB: Save telegramChatId
    Express->>MongoDB: Clear verification code
    Express->>Socket.io: Emit user-linked event
    Socket.io-->>Website: Notify frontend
    Bot-->>User: Account linked successfully!
    Website-->>User: Show success notification
```

**Process Steps:**
1. User logs into the web dashboard
2. Clicks "Link Telegram Bot" in sidebar
3. System generates a unique 6-digit verification code
4. Code displayed on the website with instructions
5. User opens Telegram and starts a chat with FinBot
6. User sends `/start CODE` command
7. Bot validates the code against database
8. If valid, bot saves the user's Telegram chat ID
9. Verification code cleared from database (one-time use)
10. Real-time notification sent to web dashboard via Socket.IO
11. Both interfaces confirm successful linking

---

### 2. Expense Entry via Text Message
```mermaid
sequenceDiagram
    participant User
    participant Bot
    participant Express
    participant Gemini
    participant MongoDB
    participant Socket.io
    participant Dashboard

    User->>Bot: "spent 100 for petrol"
    Bot->>Express: Send text message
    Express->>MongoDB: Verify user is linked
    MongoDB-->>Express: User found
    Express->>Bot: Show "Analyzing..." message
    Express->>Gemini: Analyze text with prompt
    Note over Gemini: Extract: item, amount, category, mode
    Gemini-->>Express: JSON response
    Express->>Express: Parse JSON
    Express->>MongoDB: Create expense record
    Express->>Socket.io: Emit expense-updated event
    Socket.io-->>Dashboard: Notify user's dashboard
    Dashboard-->>Dashboard: Refresh expense list
    Express->>Bot: Edit message with details
    Bot-->>User: Show expense with Delete button
```

**Process Steps:**
1. User sends casual text to the Telegram bot
2. Bot forwards message to Express API
3. API verifies user has linked account
4. "Analyzing..." temporary message shown to user
5. Text sent to Gemini API with structured prompt
6. AI extracts item name, amount, category, and payment mode
7. Response parsed and validated
8. Expense saved to MongoDB
9. Socket.IO event emitted to user's dashboard room
10. Dashboard automatically updates in real-time
11. Bot message edited to show final expense details
12. Delete button added for instant correction

---

### 3. Receipt Scanning via Photo Upload
```mermaid
sequenceDiagram
    participant User
    participant Bot
    participant Express
    participant Telegram
    participant Gemini
    participant MongoDB
    participant Socket.io
    participant Dashboard

    User->>Bot: Upload bill photo
    Bot->>Express: Send photo message
    Express->>MongoDB: Verify user is linked
    MongoDB-->>Express: User found
    Express->>Bot: Show "Scanning Receipt..." message
    Express->>Telegram: Get file download link
    Telegram-->>Express: File URL
    Express->>Express: Download image as buffer
    Express->>Gemini: Send image + analysis prompt
    Note over Gemini: OCR: Read bill, extract details
    Gemini-->>Express: JSON with item, amount, category, mode
    Express->>Express: Parse and validate
    Express->>MongoDB: Create expense record
    Express->>Socket.io: Emit expense-updated event
    Socket.io-->>Dashboard: Notify user's dashboard
    Dashboard-->>Dashboard: Refresh with new expense
    Express->>Bot: Edit message with scanned details
    Bot-->>User: Show expense with Delete button
```

**Process Steps:**
1. User takes photo of receipt and sends to bot
2. Bot receives photo and forwards to Express API
3. API gets file metadata from Telegram
4. Image downloaded as buffer using axios
5. Image buffer + caption sent to Gemini API
6. Gemini performs OCR and extracts structured data
7. JSON response parsed for item, amount, category, mode
8. Expense created in MongoDB
9. Real-time event sent to dashboard via Socket.IO
10. Dashboard updates automatically
11. Bot message edited with scanned details
12. Delete button provided for corrections

---

### 4. Monthly PDF Report Generation
```mermaid
sequenceDiagram
    participant User
    participant Bot/Website
    participant Express
    participant MongoDB
    participant PDFKit
    participant FileSystem

    alt Via Telegram Bot
        User->>Bot: Send /report command
        Bot->>Express: Request report
    else Via Website
        User->>Website: Select month/year, click Download
        Website->>Express: GET /api/reports/pdf?month=12&year=2025
    end

    Express->>MongoDB: Query expenses for selected month
    MongoDB-->>Express: Return expense records
    Express->>Express: Sort expenses by date (latest first)
    Express->>PDFKit: Initialize PDF document
    PDFKit->>PDFKit: Add header (FinBot Monthly Statement)
    PDFKit->>PDFKit: Add user name and period
    PDFKit->>PDFKit: Create table with expenses
    Note over PDFKit: Columns: Date, Item, Category, Mode, Amount
    PDFKit->>PDFKit: Calculate total expense
    PDFKit->>PDFKit: Add total at bottom
    PDFKit->>PDFKit: Add footer (Generated by FinBot)
    PDFKit->>FileSystem: Save PDF temporarily
    FileSystem-->>Express: Return file path

    alt Via Telegram Bot
        Express->>Bot: Send PDF as document
        Bot-->>User: Deliver PDF file
        Express->>FileSystem: Delete temporary file
    else Via Website
        Express-->>Website: Stream PDF as download
        Website-->>User: Browser downloads PDF
    end
```

**Process Steps:**
1. User requests report via `/report` command or website
2. API queries MongoDB for expenses in selected month
3. Expenses sorted by date (latest first)
4. PDFKit creates new document with A4 size
5. Header added with "FinBot Monthly Statement" title
6. User name and period displayed
7. Table created with columns: Date, Item, Category, Mode, Amount
8. Each expense added as a table row
9. Total calculated and displayed at bottom
10. Footer added with branding
11. PDF saved to temporary file system
12. File sent to Telegram or streamed to browser
13. Temporary file deleted after delivery

---

### 5. Forgot Password Flow
```mermaid
sequenceDiagram
    participant User
    participant Website
    participant Express
    participant MongoDB
    participant Telegram
    participant Bot

    User->>Website: Click "Forgot Password"
    Website->>Website: Display email input form
    User->>Website: Enter email address
    Website->>Express: POST /api/auth/forgot-password
    Express->>MongoDB: Find user by email
    
    alt User not found
        Express-->>Website: Error: User not found
        Website-->>User: Show error message
    else Telegram not linked
        Express-->>Website: Error: Bot not linked
        Website-->>User: Show error message
    else Success
        Express->>Express: Generate 4-digit OTP
        Express->>MongoDB: Save OTP and expiration (5 min)
        Express->>Telegram: Send OTP via bot
        Bot-->>User: Receive OTP in Telegram
        Express-->>Website: Success: OTP sent
        Website->>Website: Show OTP input form
        User->>Website: Enter OTP and new password
        Website->>Express: POST /api/auth/reset-password
        Express->>MongoDB: Verify OTP and expiration
        
        alt OTP invalid or expired
            Express-->>Website: Error: Invalid OTP
            Website-->>User: Show error message
        else OTP valid
            Express->>Express: Hash new password
            Express->>MongoDB: Update password
            Express->>MongoDB: Clear OTP fields
            Express-->>Website: Success: Password changed
            Website-->>User: Redirect to login
        end
    end
```

**Process Steps:**
1. User clicks "Forgot Password" on login page
2. Email input form displayed
3. User enters registered email
4. API checks if user exists and has linked Telegram
5. If valid, 4-digit OTP generated
6. OTP saved to database with 5-minute expiration
7. OTP sent to user's linked Telegram bot
8. Website displays OTP and new password input
9. User enters OTP and new password
10. API verifies OTP hasn't expired
11. If valid, password hashed with bcrypt
12. Database updated with new password hash
13. OTP fields cleared from database
14. User redirected to login page

---

### 6. Real-Time Dashboard Update Flow
```mermaid
sequenceDiagram
    participant Bot
    participant Express
    participant MongoDB
    participant Socket.io
    participant Dashboard

    Note over Dashboard: User viewing dashboard
    Dashboard->>Socket.io: Connect with userId
    Socket.io->>Socket.io: Join room: userId
    
    Note over Bot: User adds expense via bot
    Bot->>Express: New expense created
    Express->>MongoDB: Save expense
    Express->>Express: Identify userId from expense
    Express->>Socket.io: Emit to room: expense-updated
    Socket.io->>Dashboard: Send event to connected client
    Dashboard->>Dashboard: Trigger data fetch
    Dashboard->>Express: GET /api/expense/user-expenses
    Express->>MongoDB: Query current month expenses
    MongoDB-->>Express: Return expense list
    Express-->>Dashboard: Send updated data
    Dashboard->>Dashboard: Update UI without refresh
    Dashboard-->>Dashboard: Show new expense in list
```

**Process Steps:**
1. User opens web dashboard in browser
2. Socket.IO client connects to server
3. Client joins private room using userId
4. User adds expense via Telegram bot
5. Express saves expense to MongoDB
6. Server emits "expense-updated" event to user's room
7. Dashboard receives event instantly
8. Dashboard triggers background data fetch
9. API queries latest expenses for current month
10. Updated data sent to dashboard
11. UI refreshes automatically without page reload
12. New expense appears in transaction list

---

## Installation & Setup

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** 5.x or higher (or MongoDB Atlas account)
- **Telegram Bot Token** (from BotFather)
- **Google Gemini API Key** (from Google AI Studio)
- **Gmail Account** (for Nodemailer)

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/Ketangathibandhe/FinBot.git
cd FinBot
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials (see Environment Configuration section)

# Start server
npm start
# Backend runs on http://localhost:5000
```

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with backend URL

npm run dev
# Frontend runs on http://localhost:5173
```

#### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo service mongodb start
```

**Option B: MongoDB Atlas (Recommended)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and add to .env

#### 5. Telegram Bot Setup

1. Open Telegram and search for @BotFather
2. Send `/newbot` command
3. Follow prompts to create bot
4. Copy the bot token provided
5. Add token to backend .env file
6. Set webhook URL (for production) or use long polling (for development)

---

## Environment Configuration

### Backend (.env)
```dotenv
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/finbot
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finbot

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_from_botfather

# Google Gemini API
GEMINI_API_KEY=your_google_gemini_api_key

# Email Configuration (for OTP)
# Use Gmail App Password, not regular password
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
# For production: https://yourdomain.com

# Cookie Settings
COOKIE_DOMAIN=localhost
# For production: .yourdomain.com

# Node Environment
NODE_ENV=development
# For production: production
```

### Frontend (.env)
```dotenv
# Backend API URL
VITE_API_URL=http://localhost:5000/api
# For production: https://your-backend.com/api

# Socket.IO URL (usually same as API URL without /api)
VITE_SOCKET_URL=http://localhost:5000
# For production: https://your-backend.com
```

### Getting API Keys

**Google Gemini API:**
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key to your .env file

**Gmail App Password:**
1. Enable 2-Factor Authentication on your Google account
2. Visit https://myaccount.google.com/apppasswords
3. Select "Mail" and "Other (Custom name)"
4. Generate password
5. Copy the 16-character password (no spaces) to .env

---

## Deployment

### Production Architecture
```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Vercel/Render)                                │
│  - Automatic deployments from main branch               │
│  - CDN delivery                                          │
│  - Environment variables via dashboard                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Backend (Render/Heroku)                                 │
│  - Express API Server                                    │
│  - Telegram Bot running                                  │
│  - Socket.IO server                                      │
│  - PDF generation                                        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Database (MongoDB Atlas)                                │
│  - Managed MongoDB cluster                               │
│  - Automatic backups                                     │
│  - Global distribution                                   │
└─────────────────────────────────────────────────────────┘
```

### Deployment Steps

**Frontend (Vercel):**
```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

**Backend (Render):**
1. Create account at https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
5. Add environment variables from .env
6. Click "Create Web Service"

**Telegram Bot Webhook Setup:**
```bash
# Set webhook URL to your deployed backend
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_BACKEND_URL>/webhook"
```

### Environment Variables in Production

**Critical Settings:**
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET` (min 32 characters)
- Set correct `FRONTEND_URL` for CORS
- Update `COOKIE_DOMAIN` to your domain
- Ensure MongoDB Atlas IP whitelist includes your backend server

---

## Screenshots

### Home Page
![Home Page](FinBot-Frontend/public/HomePage.png)
*Landing page with hero section, features overview, and call-to-action buttons*

### Dashboard
![Dashboard](FinBot-Frontend/public/Dashboard.png)
*Main dashboard showing spending activity chart, category breakdown pie chart, stats grid, and recent transactions*

### Add Expense Drawer
![Add Expense](FinBot-Frontend/public/AddExpenseDrawer.png)
*Mobile-friendly drawer interface for manual expense entry with photo upload option*

### Telegram Bot Interface
![Telegram Bot](FinBot-Frontend/public/telegram.png)

*Telegram chat showing expense entry, receipt scanning, and delete button functionality*

### Link Telegram Drawer
![Link Telegram](FinBot-Frontend/public/TeleLinkDrawer.png)
*Step-by-step interface for linking Telegram account with verification code*

### Monthly Report PDF Drawer
![PDF Report](FinBot-Frontend/public/ReportDrawer.png)
*Generated PDF statement showing expense table, totals, and branding*

---

**Built by Ketan Gathibandhe**

[GitHub](https://github.com/Ketangathibandhe) • [LinkedIn](https://www.linkedin.com/in/ketangathibandhe/) • [Email](mailto:ketangathibandhe04@gmail.com)
