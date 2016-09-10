const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');

/**
 * GET /seller
 * See all your listings.
 */
exports.getSellerDashboard = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('seller/dashboard', {
    title: 'Seller'
  });
};

/**
 * GET /listing/<id>
 * See listing details.
 */
exports.getListing = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('seller/listing', {
    title: 'Listing'
  });
};