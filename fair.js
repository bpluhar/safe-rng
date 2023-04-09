/*
Title: Fairjs
Author: Disemerge

FairJS is a JavaScript library for generating provably fair numbers in online gambling and betting applications. 
It uses a combination of client seed, server seed, and nonce to generate random numbers within a specified range.
FairJS provides functions for generating integers, floats, and dice rolls, as well as utility functions for combining 
seeds and hashing data. Overall, FairJS is a simple and easy-to-use library that ensures fairness and transparency 
in online gambling and betting applications.
*/


const crypto = require('crypto')

const combine = (client, server, nonce) => client + server + nonce
const sha512  = string => crypto.createHash('sha512').update(string).digest('hex')

module.exports = {

    /**
     * Generates a random 256 long hex hash
     * 
     * @returns {string} random 256 long string
    */
    generateServerSeed: function() {
        return crypto.randomBytes(256).toString('hex')
    },
    
    /**
     * Generates a random 256 long hex hash
     * 
     * @returns {string} random 256 long string
    */
    generateClientSeed: function() {
        return crypto.randomBytes(256).toString('hex')   
    },

    /**
     * Generates a random integer between min and max using the specified client seed, server seed, and nonce.
     *
     * @param {string} clientseed - The client seed.
     * @param {string} serverseed - The server seed.
     * @param {number} nonce - The nonce.
     * @param {number} min - The minimum value of the range.
     * @param {number} max - The maximum value of the range.
     * @returns {number} A random integer between min and max (inclusive).
     */
    generateInteger: function(clientseed, serverseed, nonce, min, max) {
        const preHash = combine(clientseed, serverseed, nonce)
        const hash    = sha512(preHash)

        const range = max - min + 1

        return parseInt(hash.slice(0, 8), 16) % range + min;
    },

    /**
     *  Generates a random boolean using the specified client seed, server seed, and nonce.
     * 
     * @param {string} clientseed - The client seed.
     * @param {string} serverseed - The server seed.
     * @param {number} nonce       - The nonce.
     * @returns {boolean} random boolean true/false
    */
    generateBool: function(clientseed, serverseed, nonce) {
        return this.generateInteger(clientseed, serverseed, nonce, 0, 1) === 1 ? true : false
    },

    /**
     * Selects a random object from an array of objects based on their probabilities.
     *
     * @param {string} clientseed - The client seed.
     * @param {string} serverseed - The server seed.
     * @param {number} nonce      - The nonce.
     * @param {Array}  objects    - An array of objects with an ID and a probability property.
     * @returns {String} The ID of the randomly selected object.
     */
    selectRandomObject: function(clientseed, serverseed, nonce, objects) {
        // Calculate the total probability of all objects
        const totalProbability = objects.reduce((acc, obj) => acc + obj.probability, 0);
        
        // Generate a random number between 0 and the total probability
        const randomNum = this.generateInteger(clientseed, serverseed, nonce, 0, totalProbability - 1);
        
        // Iterate over the objects and subtract their probabilities from the random number
        let index = 0;
        for (let i = 0; i < objects.length; i++) {
            index += objects[i].probability;
          if (randomNum < index) {
            return objects[i].id;
          }
        }
      }
}
