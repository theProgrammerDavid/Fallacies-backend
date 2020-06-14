const submissions = require('express').Router();
const fetch = require('node-fetch');
const { stringify } = require('querystring');
const user = require('../models/User');
const question = require('../models/Questions');

submissions.get('/', async (req, res) => {
  try {
    if (req.session.email) {
      const users = await user.findOne({
        email: req.session.email,
      });
      const answer = await question.findOne({
        Id: users.points - 1,
      });
      if (users.points === 1) {
        res.render('gamepage', { message: `Clue: @fallacies_q0` });
      } else if (!["''", '""', ''].includes(answer.NextAccount)) {
        res.render('gamepage', { message: `Clue: @${answer.NextAccount}` });
      } else {
        res.render('lastpage', { message: 'You have already submitted all the answers!' });
      }
      // res.send('gamepage')
    } else {
      res.redirect('/login');
    }
  }
  catch (e) {
    console.log('submission get request');
    console.log(e.message);
  }
});

submissions.post('/', async (req, res) => {
  try {
  
    if (!req.session.email) {
      res.redirect('/login');
      return;
    }

    const users = await user.findOne({
      email: req.session.email,
    });

    const answer = await question.findOne({
      Id: users.points,
    });

    if (answer) {
      console.log(typeof req.body.answer);
      if (typeof req.body.answer === 'string' && answer.Answer.map((x) => x.toLowerCase()).includes(req.body.answer.toLowerCase())) {
        users.points += 1;
        const date = new Date();
        users.timestamp = date.getTime();
        try {
          users.save();
        } catch (e) {
          console.log(`Error occured: ${e}`);
        }
        if (!["''", '""', ""].includes(answer.NextAccount)) {
          res.send({ status: answer.NextAccount });
        } else {
          res.send({ status: 'all-question-complete' });
        }
      } else {
        res.send({ status: 'wrong-answer' });
      }
    } else {
      res.send({ status: 'completed' });
    }
  } catch (e) {
    console.log('submission post request');
  }
});
module.exports = submissions;
