const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const _ = require('underscore');
const User = require('../models/User');
const request = require('request');
const fs = require('fs');
const path = require('path');
const apiKey = 'RTVINU5kcHFvZGtPOk1yaVNDMkdtQkNJQg==';

/**
 * GET /seller
 * See all your listings.
 */
exports.getBuyerDashboard = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('buyer/buyer', _.extend(req.params, {
    title: 'Buyer'
  }));
};

/**
 * GET /listing/<id>
 * See listing details.
 */
exports.getListings = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('buyer/listings', _.extend(req.params, {
    title: 'Listings'
  }));
};

/**
 * GET /listing/<id>/offer_create
 * See listing details.
 */
exports.getOfferCreate = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('buyer/offer_create', _.extend(req.params, {
    title: 'Listings'
  }));
};

exports.getMakeOfferReview = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  generateOfferToken(function(error, token) {
    if (error) {
      console.log('Error:' + error);
      return next(err);
    }
    req.user.offerToken = token;
    console.log('Setting user offer token = ' + req.user.offerToken);
    req.user.save((err) => {
      if (err) {
        console.log('Error:' + err);
        res.status(400).send('Failed saving user');
      } else {
        console.log('Success saving user token');
        res.redirect('/buyer/listing/' + req.params.listingId + '/make_offer/sign');
      } 
    });
  });
}

exports.getMakeOfferSign = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  if (!req.user.offerToken) {
    return res.redirect('/buyer/listing/' + req.params.listingId + '/make_offer');
  }
  res.render('buyer/offer_sign', _.extend(req.params, {
    title: 'Listings'
  }));
}

/**
 * POST /listing/<id>/offer
 * See listing details.
 */
exports.postOffer = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('buyer/listings', _.extend(req.params, {
    title: 'Listings'
  }));
};

/**
 * GET /offers/<id>
 * See listing details.
 */
exports.getOffers = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('buyer/offers', _.extend(req.params, {
    title: 'Offers'
  }));
};

function generateOfferToken(callback) {
  async.waterfall([
    createPackage,
    getSignerToken,
  ], (err, token) => {
    callback(err, token);
  });
}

function createPackage(done) {
  var json = {
    "roles": [{
        "id": "buyer",
        "type": "SIGNER",
        "signers": [{
            "firstName": "Fei",
            "lastName": "Xue",
            "email": "fayexuexue@gmail.com",
            "id": "buyer"
        }]
    },{
        "id": "seller",
        "type": "SIGNER",
        "signers": [{
            "firstName": "Yohannes",
            "lastName": "Kifle",
            "email": "ykifle2@gmail.com",
            "id": "seller"
        }]
    }],
    "documents": [{
        "approvals": [{
            "role": "seller",
            "signed": null,
            "accepted": null,
            "data": null,
            "fields": [{
                "subtype": "FULLNAME",
                "width": 200,
                "binding": null,
                "extract": false,
                "extractAnchor": {
                    "text": "SELLER",
                    "index": 18,
                    "width": 200,
                    "height": 20,
                    "anchorPoint": "TOPRIGHT",
                    "characterIndex": 6,
                    "leftOffset": 5,
                    "topOffset": -5
                },
                "validation": null,
                "data": null,
                "type": "SIGNATURE",
                "value": ""
            }],
            "name": ""
        },{
            "role": "buyer",
            "signed": null,
            "accepted": null,
            "data": null,
            "fields": [{
                "subtype": "FULLNAME",
                "width": 200,
                "binding": null,
                "extract": false,
                "extractAnchor": {
                    "text": "BUYER",
                    "index": 18,
                    "width": 200,
                    "height": 20,
                    "anchorPoint": "TOPRIGHT",
                    "characterIndex": 6,
                    "leftOffset": 5,
                    "topOffset": -5
                },
                "validation": null,
                "data": null,
                "type": "SIGNATURE",
                "value": ""
            }],
            "name": ""
        }],
        "name": "Sample Contract",
        "id": "contract",
        "extract": true
    }],
    "name": "NodeJS Example",
    "type": "PACKAGE",
    "status": "SENT"
  };
  var jsonPayload = JSON.stringify(json);
  var offerDocumentContent = fs.readFileSync(path.join(__dirname, '../public/pdf') + '/offer.pdf');
  var options = {
    method: 'POST',
    url: 'https://sandbox.esignlive.com/api/packages',
    headers:
    {
      accept: 'application/json',
      authorization: 'Basic ' + apiKey,
      'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
    },
    formData: {
      file: {
        value: offerDocumentContent,
        options: {
          filename: 'offer.pdf',
          contentType: null
        }
      },
      payload: jsonPayload
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(body);

      var tmp = JSON.parse(body);
      console.log(tmp);
      packageid = tmp['id'];
      console.log("The package id is: " + packageid);
    }
    done(error, packageid);
  });
}

function getSignerToken(packageId, done) { 
  var options = {
    method: 'POST',
    url: 'https://sandbox.esignlive.com/api/signerAuthenticationTokens',
    headers: {  
      'content-type': 'application/json',
      accept: 'application/json',
      authorization: 'Basic ' + apiKey
    },
    body: {
      packageId: packageId,
      signerId: 'buyer'
    },
    json: true
  };

  request(options, function (error, response, body) {
      if (error) {
        console.log(error);
      }

      token = body ? body['value'] : '';
      console.log("The session token is: " + token);
      done(error, token);
  });      
}
