/* eslint-disable comma-dangle */
const express = require('express');
const asyncHandler = require('express-async-handler');
const webPush = require('web-push');
const { getEmployees } = require('../model/employees');
require('dotenv').config();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

const router = express.Router();
const subscription = [];

webPush.setVapidDetails(
  'mailto:wolfsberger.r03@htlwienwest.at',
  publicVapidKey,
  privateVapidKey
);

router.get(
  '/employees',
  asyncHandler(async (req, res) => {
    res.json(getEmployees());
  })
);
router.post(
  '/subscription',
  asyncHandler(async (req, res) => {
    subscription.push(req.body);
    res.status(201).end();
  })
);

router.post('/notify', (req) => {
  const payload = JSON.stringify({ title: 'Push Test', body: req.body });
  for (const sub of subscription) {
    try {
      webPush.sendNotification(sub, payload);
    } catch (error) {
      console.error(error);
    }
  }
});

module.exports = router;
