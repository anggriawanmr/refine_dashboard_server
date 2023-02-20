import user from '../mongodb/models/user.js';

const getAllUsers = async (req, res) => {
  try {
    const users = await user.find({}).limit(req.query._end);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const userExists = await user.findOne({ email });

    if (userExists) return res.status(200).json(userExists);

    const newUser = await user.create({
      name,
      email,
      avatar,
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserInfoById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).populate('allProperties');

  if (user) res.status(200).json(user);

  res.status(404).json({ message: 'User not Found' });
};

export { getAllUsers, createUser, getUserInfoById };
