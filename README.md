# Drowse App

Drowse is a mobile application built with Expo and React Native, designed empower parents, guide children! Drowse helps manage phone addiction in young kids by making screen time intentional and controlled. With smart monitoring, gentle restrictions, and interactive engagement, create a balanced digital experience for your child. 🚀

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (Node Package Manager)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Project Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Bismay07/drowse.git
   cd drowse
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Environment
   - Create a new file `config.js` in the `constants` directory
   - Add the following configuration structure:
     ```javascript
     export const conf = {
         endpoint: "YOUR_APPWRITE_ENDPOINT",
         platform: "YOUR_PLATFORM_ID",
         projectId: "YOUR_PROJECT_ID",
         databaseId: "YOUR_DATABASE_ID",
         usersCollectionId: "YOUR_USERS_COLLECTION_ID",
         bucketId: "YOUR_BUCKET_ID"
     }
     ```
   - Replace the placeholder values with the actual credentials provided by the project maintainer
   - Note: The `config.js` file is gitignored for security reasons. You'll need to obtain these credentials separately

4. Start the development server
   ```bash
   npx expo start
   ```

## Development Options

After starting the development server, you can run the app in:
- iOS Simulator
- Android Emulator
- Physical device using Expo Go app
- Web browser (experimental)

## Project Structure

```
/app                 # Main application code
  /(auth)            # Authentication related screens
  /(tabs)            # Tab-based navigation screens
/assets              # Static assets (images, fonts)
/components          # Reusable React components
/constants           # Configuration and constants
/context             # React Context providers
/libs                # Utility functions and services
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Start the app in iOS simulator
- `npm run android` - Start the app in Android emulator
- `npm run web` - Start the app in web browser

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Troubleshooting

If you encounter any issues:
1. Ensure all dependencies are installed correctly
2. Verify that `config.js` is properly set up with valid credentials
3. Clear the npm cache and node_modules if needed:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

## Support

For any additional help or credentials needed, please contact the project maintainer.

## Connect to the Project Maintainer
[Project Maintainer - Bismay Bibhu Prakash ⇠ `Click Me`](https://www.instagram.com/_bismay.__/)