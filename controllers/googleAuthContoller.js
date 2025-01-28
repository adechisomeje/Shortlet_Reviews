const User = require('../models/User');

const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId } = req.body; // Extract from Google response

    // Find or create the user
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId, // Save the Google ID
      });

      await user.save();
    }

    // Return the user or token (if implementing JWT)
    res.status(200).json({ message: 'Authentication successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { googleAuth };
