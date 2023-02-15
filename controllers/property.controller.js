import Property from '../mongodb/models/property.js';
import user from '../mongodb/models/user.js';

import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).limit(req.query._end);

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyDetail = async (req, res) => {};

const createProperty = async (req, res) => {
  try {
    const { title, description, propertyType, location, price, photo, email } =
      req.body;

    // Start a new session...
    const session = await mongoose.startSession();
    session.startTransaction();

    const User = await user.findOne({ email }).session(session);

    if (!User) throw new Error('User not found');

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newProperty = await Property.create({
      title,
      description,
      propertyType,
      location,
      price,
      photo: photoUrl.url,
      creator: User.id,
    });

    User.allProperties.push(newProperty._id);

    await User.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: 'Property created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {};

const deleteProperty = async (req, res) => {};

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
};
