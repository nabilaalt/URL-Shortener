# URL Shortener

URL Shortener is a web application that allows users to shorten long URLs, making them more manageable and easier to share. This application utilizes React for the frontend and Vite as the build tool. It allows users to input long URLs and provides a shortened version that can be copied or shared.

## Features

- **Shorten URLs**: Users can input long URLs and receive a shortened version.
- **User Authentication**: Includes login and registration systems to manage access.
- **Responsive Design**: The app is fully responsive, ensuring optimal performance across all devices.
- **Copy Functionality**: Users can easily copy the shortened URL to their clipboard.
- **Simple UI**: Clean and intuitive user interface that focuses on user experience.
- **Dashboard**: Registered users can access a dashboard to view their previous shortened URLs.

## Tech Stack

- **React**: A JavaScript library for building the user interface.
- **Vite**: A fast build tool that offers fast development and refresh times.
- **JavaScript**: For the application logic, handling URL shortening and user interactions.
- **CSS**: For styling the components, creating a clean and modern design.
- **Tailwind CSS**: A utility-first CSS framework used to rapidly build custom designs.
- **LocalStorage**: Used to persist data across sessions on the user’s browser.
- **Firebase/Backend API (Optional)**: For user authentication and saving shortened URLs.

## Installation

To get started with the URL Shortener project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/nabilaalt/URL-Shortener
    ```

2. Install the dependencies:

    ```bash
    cd url-shortener
    npm install
    ```

3. Run the app in development mode:

    ```bash
    npm run dev
    ```

4. Open the app in your browser at `http://localhost:3000`.


## How It Works

- The **landing page** allows users to input a long URL and generates a shortened URL on submission.
- Registered users can log in to manage their shortened URLs and track usage.
- The application offers responsive design, ensuring it looks great on both desktop and mobile devices.

## Future Improvements

- **Analytics**: Track the number of clicks on shortened URLs.
- **Custom Shortened URLs**: Allow users to create custom shortened links.
- **Email Verification**: Add an email verification system during registration.
- **Mobile App**: Create a mobile app version of the URL Shortener for easy access.
