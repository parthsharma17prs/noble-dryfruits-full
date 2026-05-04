# Noble Dryfruits Platform

Noble Dryfruits is a full-stack e-commerce platform built for a premium dry fruits and spices brand. It features a responsive frontend built with HTML/CSS/JS and a C# Minimal API backend that handles data management, orders, and automated email receipts.

## Features
- **Dynamic Product Grid:** Products are loaded dynamically from the C# backend.
- **Cart & Checkout Flow:** Calculates Subtotal, Tax (5%), and Delivery Fees automatically.
- **Order Processing:** Secures orders through the API and automatically sends a detailed HTML email receipt to the customer via SMTP.
- **Sorting & Filtering:** Front-end logic handles on-the-fly alphabet and price sorting.
- **Supabase Integration:** Uses a Supabase PostgreSQL database for persistent product and order storage.

## Folder Structure
- `/frontend`: Contains all the HTML, CSS, JavaScript, and assets for the web client.
- `/backend`: Contains the C# Minimal API (.NET) application.

## Setup Instructions for Windows (C# Backend)

If you are running on a Windows system, follow these simple steps to get the C# backend running:

1. **Install the .NET SDK:**
   Download and install the latest [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) for Windows (choose the x64 installer).

2. **Open the Project:**
   Open a terminal (Command Prompt or PowerShell) and navigate into the backend folder:
   ```cmd
   cd path\to\noble-dryfruits-full\backend
   ```

3. **Restore Dependencies:**
   Run the following command to download all necessary packages (like Supabase and MailKit):
   ```cmd
   dotnet restore
   ```

4. **Run the Server:**
   Start the API server by running:
   ```cmd
   dotnet run
   ```
   The backend will usually start on `http://localhost:5195`. Leave this terminal open.

5. **Start the Frontend:**
   Open a separate terminal window, navigate to the `frontend` folder, and use any simple HTTP server (like Python's or Node's `http-server`) to serve the files. For example:
   ```cmd
   npx http-server -p 8001
   ```
   Now visit `http://localhost:8001` in your browser!

---
*Created for Noble Dryfruits*
