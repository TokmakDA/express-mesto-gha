const express = require('express');
const jwt = require('jsonwebtoken');

function generateToken(user, secret, deadline) {
  const token = jwt.sign({ _id: user._id }, secret, { expiresIn: deadline });
  console.log('generateToken =>', token);
  return token;
}

module.exports = {
  generateToken,
};
