# Firebase Cloud Functions Setup

This repository contains Firebase Cloud Functions for handling various backend operations, such as logging article likes and triggering events.

---

## Prerequisites

Before running the project locally, ensure you have the following:

1. **Node.js**: Install [Node.js](https://nodejs.org/) (version 18 or higher is recommended).
2. **Firebase CLI**: Install the Firebase CLI by running:
   ```bash
   npm install -g firebase-tools
3. **Google Cloud Project**: Set up a Google Cloud project and enable Firestore and Cloud Functions APIs.
4. **Service Account Key**:

- Download your Firebase service account key from the Google Cloud Console.

- Save the key as `serviceAccountKey.json` in the root directory of your project.

## Steps to Set Up and Run Locally

1. Clone the Repository

    Start by cloning the repository:
    
        git clone https://github.com/apoorvsarang10/liverapp-test.git
        cd liverapp-test/functions

2. Install Dependencies

    Navigate to the functions directory and install the required dependencies:

        npm install

3. Add Service Account Key

    Place the `serviceAccountKey.json` file in the `functions` directory. This file is required to initialize Firebase Admin SDK.

4. Set Up Firebase

    Log in to Firebase and initialize the project:

    1. Log in:

            firebase login

    2. Link the project to Firebase:

            firebase use --add

    Follow the prompts to select your Firebase project.

5. Run the Firebase Emulators Locally

    Start the Firebase emulators to test the functions locally:

        firebase emulators:start

    - Functions Emulator runs on http://localhost:5001.
    - Firestore Emulator runs on http://localhost:8080.
    - You can access the emulator UI at http://localhost:4000.

6. Test Functions Locally

    You can test the functions using tools like Postman or curl.

    Example curl request for the logArticleLike function:

        curl -X POST http://127.0.0.1:5001/livertest-apoorvsarang/us-central1/logArticleLike \
          -H "Content-Type: application/json" \
          -d '{"userId": "user123", "articleId": "article456"}'

