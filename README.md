# Math Buddy - K-2 Math Learning App

An interactive web application for children to learn addition, subtraction, counting, and more, powered by Google Gemini.

## 🚀 Deployment Instructions (Vercel)

This project is configured to run on Vercel with a serverless backend to protect your API key.

1.  **Fork/Clone** this repository to your GitHub.
2.  Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3.  Select your repository.
4.  **Important**: In the "Environment Variables" section, add:
    *   Name: `GEMINI_API_KEY`
    *   Value: `Your_Google_Gemini_API_Key_Here`
5.  Click **Deploy**.

## 🛠 Local Development

To run this locally, you need to simulate the backend API. The easiest way is using the Vercel CLI.

1.  Install Vercel CLI: `npm i -g vercel`
2.  Link project: `vercel link`
3.  Add environment variable locally: `vercel env add GEMINI_API_KEY`
4.  Run development server: `vercel dev`

The app will start at `http://localhost:3000`.

## 📁 Structure

*   `src/` - React Frontend
*   `api/` - Serverless Backend (Proxies requests to Gemini)
