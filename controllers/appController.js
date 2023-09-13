const User = require('../models/User');
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

const secret = process.env.SECRET;

//all route-functions go here

module.exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      const payload = {
        id: userDoc._id,
        username: userDoc.username,
      };

      const token = jwt.sign(payload, secret);
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.status(200).json({ user: userDoc._id, username: userDoc.username });
    } else res.status(400).json('Invalid Credentials');
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.logout = (req, res) => {
  res
    .cookie('jwt', '', {
      httpOnly: true,
    })
    .json('ok');
};

module.exports.profile = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, secret, (err, info) => {
      if (err) {
        res.status(400).json('Token verification failed');
      } else {
        res.json(info);
      }
    });
  } else {
    res.status(401).send('JWT token not found in cookies');
  }
};

//use JWT for CRUD operations on expense by user
module.exports.expense_post = async (req, res) => {
  const { expense, datetime, description } = req.body;
  const { username } = req.user;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json('User not found' );
  const expenseDoc = new Expense({
    user: user._id,
    expense,
    datetime,
    description,
  });
  await expenseDoc.save();
  res.status(200).json('Expense created');
};

module.exports.expense_get = async (req, res) => {
  const { username } = req.user;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json('User not found' );
  const expenses = await Expense.find({ user: user._id });
  res.status(200).json(expenses);
};

module.exports.expense_delete = async (req, res) => {
  const expId=req.params.id;
  try{
    const expense= await Expense.findById(expId);
    if(!expense){
      res.status(400).json('User not found')
    }
      await expense.deleteOne();
      res.status(200).json('Expense Deleted!')
  }
  catch(err){
    res.status(400).json(err);
  }
};
