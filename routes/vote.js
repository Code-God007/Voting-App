const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Poll = require('../models/Poll');

const Pusher = require('pusher');

var pusher = new Pusher({
    appId: '801269',
    key: 'dbb78265f3f219a2c421',
    secret: '24f3d1a28ddb56953af6',
    cluster: 'ap2',
    encrypted: true
  });

router.get('/', (req, res) => {
    Poll.find().then(votes => res.json({success: true,
    votes: votes}));
});

router.post('/', (req, res) => {
  const newVote = {
    series: req.body.series,
    points: 1
  }

  new Poll(newVote).save().then(vote => {
    pusher.trigger('series-poll', 'series-vote', {
      points: parseInt(vote.points),
      series: vote.series
    });
    return res.json({ success: true, message: 'Thank You for Voting' });
  });
});

module.exports = router;