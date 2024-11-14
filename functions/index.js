// Import Firebase Functions and Admin SDK (using v2 API)
const functions = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");  // Import from v2 firestore
const { FieldValue } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
//const FieldValue = admin.firestore.FieldValue;

// Set Firestore emulator settings if running locally
if (process.env.FUNCTIONS_EMULATOR) {
  admin.firestore().settings({
    host: "localhost:8080", // Firestore emulator host
    ssl: false,              // Disable SSL since the emulator does not use it
  });
}

// Define the HTTP function for logging article likes
exports.logArticleLike = onRequest({ cors: true }, async (req, res) => {
  try {
    // Extract userId and articleId from request body
    if (req.method !== "POST") {
      console.error("Invalid request method:", req.method);
      return res.status(405).json({ error: "Method Not Allowed. Use POST." });
    }

    const { userId, articleId } = req.body;

    // Validate request data
    if (!userId || !articleId) {
      return res.status(400).json({ error: "Missing userId or articleId" });
    }

    // Create a new document in the "article_likes" collection
    const likeData = {
      userId,
      articleId,
      timestamp: FieldValue.serverTimestamp(),
    };
    await db.collection("article_likes").add(likeData);

    // Send success response
    res.status(200).json({ message: "Article like logged successfully" });
  } catch (error) {
    console.error("Error logging article like:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the Firestore trigger for creating user activity logs (using v2 API)
exports.onArticleLikeCreated = onDocumentCreated('article_likes/{likeId}', async (event) => {
  try {
    // Get the data from the document
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const data = snapshot.data();
    const {userId, articleId, timestamp} = data;

    if (!userId || !articleId) {
      console.error("Invalid data: Missing userId or articleId in article_likes document");
      return;
    }

    // Log the user activity in "user_activity" collection
    const userActivityData = {
      userId,
      activityType: "article_liked",
      articleId,
      timestamp: timestamp || FieldValue.serverTimestamp(),
    };
    await db.collection("user_activity").add(userActivityData);
    console.log("User activity logged successfully.");
  } catch (error) {
    console.error("Error creating user activity log:", error);
  }
});