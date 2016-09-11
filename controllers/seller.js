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
exports.getSellerDashboard = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('seller/seller', _.extend(req.params, {
    title: 'Seller'
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
  res.render('seller/listings', _.extend(req.params, {
    title: 'Listings'
  }));
};

/**
 * GET /listing/<id>
 * See listing details.
 */
exports.getListing = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('seller/listing', _.extend(req.params, {
    title: 'Listing'
  }));
};

/**
 * GET /listing/<id>/disclosures
 * Fillout disclosures statement.
 */
exports.getDisclosures = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('seller/disclosure', _.extend(req.params, {
    title: 'Disclosures',
  }));
};

/**
 * GET /listing/<id>/disclosures/inventory
 * Fillout disclosures statement.
 */
exports.getDisclosuresInventory = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  var step = req.params.stepId || 1
  res.render('seller/disclosure_inventory_' + step, _.extend(req.params, {
    title: 'Disclosures'
  }));
};

/**
 * GET /listing/<id>/disclosures/structure
 * Fillout disclosures statement.
 */
exports.getDisclosuresStructure = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  var step = req.params.stepId || 1
  res.render('seller/disclosure_structure_' + step, _.extend(req.params, {
    title: 'Disclosures'
  }));
};

/**
 * GET /listing/<id>/disclosures/general
 * Fillout disclosures statement.
 */
exports.getDisclosuresGeneral = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('seller/disclosure/general', _.extend(req.params, {
    title: 'Disclosures'
  }));
};

/**
 * GET /listing/<id>/disclosures/review
 * Fillout disclosures statement.
 */
exports.getDisclosuresReview = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  console.log('user = ' + req.user);
  console.log('user.token = ' + req.user.token);
  if (!req.user.token) {
    return res.redirect('/listing/' + req.params.listingId + '/disclosures/structure')
  }
  res.render('seller/disclosure_review', _.extend(req.params, {
    title: 'Disclosures'
  }));
};

/**
 * POST /listing/<id>/disclosures
 * Fillout disclosures statement.
 */
exports.postDisclosures = (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  generateTdsToken(function(error, token) {
    if (error) {
      console.log('Error:' + error);
      return next(err);
    }
    req.user.token = token;
    console.log('Setting user token = ' + req.user.token);
    req.user.save((err) => {
      if (err) {
        console.log('Error:' + err);
        res.status(400).send('Failed saving user');
      } else {
        console.log('Success saving user token');
        res.send({ 'disclosureDocumentToken': token });
      } 
    });
  });
};

function generateTdsToken(callback) {
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
                    "text": "Seller",
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
            },
            {
              "value": null,
              "type": "INPUT",
              "binding": "{approval.signed}",
              "extract": false,
              "extractAnchor": {
                "text": "Date",
                "index": 4,
                "width": 75,
                "height": 20,
                "anchorPoint": "TOPRIGHT",
                "characterIndex": 4,
                "leftOffset": 5,
                "topOffset": -5
              },
              "subtype": "LABEL",
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
  var tdsDocumentContent = fs.readFileSync(path.join(__dirname, '../public/pdf') + '/tds.pdf');
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
        value: tdsDocumentContent,
        options: {
          filename: 'tds.pdf',
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
      signerId: 'seller'
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
