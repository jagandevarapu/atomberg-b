const mixers = require("../models/mixermodel");
const asynchandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");

const getmixers = asynchandler(async (req, res) => {
  const mixer = await mixers.find();
  if (!mixer || mixer.length === 0) {
    return res.status(404).json({ message: "No mixers exist" });
  }
  res.status(200).json(mixer);
});

const createmixer = asynchandler(async (req, res) => {
  const { title, colors, actualprice, currentprice, discount, images } =
    req.body;

  if (
    !title ||
    !colors ||
    !actualprice ||
    !currentprice ||
    !discount ||
    !images
  ) {
    res.status(400);
    throw new Error("All fields are mandatory.");
  }

  if (!Array.isArray(images) || images.length === 0) {
    res.status(400);
    throw new Error("Images must be a non-empty array of strings.");
  }

  const mixer = await mixers.create({
    title,
    colors,
    actualprice,
    currentprice,
    discount,
    images,
  });

  if (mixer) {
    res.status(201).json(mixer);
  } else {
    res.status(400);
    throw new Error("Fan creation failed.");
  }
});

const updatemixer = asynchandler(async (req, res) => {
  // Find the mixer by ObjectId
  const mixer = await mixers.findById(req.params.id);
  if (!mixer) {
    return res.status(404).json({ message: "Mixer doesn't exist" });
  }

  // Define allowed fields for updates
  const allowedUpdates = [
    "title",
    "colors",
    "actualprice",
    "currentprice",
    "discount",
    "images",
    
  ];

  // Filter the request body to include only allowed fields
  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Update the mixer record
  const updatedMixer = await mixers.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true } // Return the updated document and apply schema validations
  );

  // Respond with the updated mixer
  res.status(200).json(updatedMixer);
});

module.exports = {
  getmixers,
  createmixer,
  updatemixer,
};
