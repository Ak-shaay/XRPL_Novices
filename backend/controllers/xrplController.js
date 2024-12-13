const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const xrpl = require("xrpl");

const SERVER_URL = "wss://s.altnet.rippletest.net:51233";
const { BANK_ACCOUNT_SECRET, BANK_ACCOUNT_ADDRESS } = process.env;
const xrpRate = 100;

function validateUPIAddress(upi) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

    // Check if the UPI address matches the pattern
    if (!upi.match(regex)) {
        console.log("regex");
        
        return false;
    }

    // Split the UPI address into username and bank name
    const [username, bank] = upi.split('@');

    // Check the length of the username and bank name
    if (username.length < 3 || username.length > 50) {
        console.log("yser")
        return false; // Username should be between 3 and 50 characters
    }

    if (bank.length < 2 || bank.length > 15) {
        console.log("bank")
        return false; // Bank name should be between 2 a
        // nd 15 characters
    }

    
    return true;
}

// IMPORTANT USERS RESOURCE
const client = new xrpl.Client(SERVER_URL);

exports.balance = catchAsync(async (req, res, next) => {
    const { walletAddress } = req.body;
    if (!walletAddress) {
        return next(new AppError("Invalid Wallet address", 404));
      }
    await client.connect();
    const balance = await client.getXrpBalance(walletAddress);
    if (!balance) {
      return next(new AppError("Couldn't fetch balance", 404));
    }
    await client.disconnect();

    res.status(200).json({
      result: "success",
      balance,
      xrpRate
    });

  });

  exports.upi = catchAsync(async (req, res, next) => {
    const { walletAddress,redeemAmount, upiId, secret } = req.body; 

    // if (!req.body || !walletAddress || !redeemAmount || !upiId || !secret) {
    //     return next(new AppError("Missing required fields", 400));
    // }
    if (!walletAddress) {
        return next(new AppError("Missing wallet address", 400));
    }
    // Validate UPI address format (You need to implement this validation)
    if (!upiId || !validateUPIAddress(upiId)) {        
        return next(new AppError("Invalid UPI address format", 404));
    }
    
    if (!secret) {
        return next(new AppError("Invalid secret key format", 400));
    }
    // Create wallet from secret (private key)
    const wallet = xrpl.Wallet.fromSeed(secret);
    
    // Connect to the XRP client
    await client.connect();
    
    // Fetch the wallet balance
    const balance = await client.getXrpBalance(wallet.address);
    
    // Check for minimum balance
    if (balance <= 20) {
        return next(new AppError("Minimum balance should be kept", 201));
    }
    
    // Ensure the transaction doesn't leave the wallet with less than 20 XRP
    if ((balance - redeemAmount) <= 20) {
        return next(new AppError("Insufficient balance for this transaction", 201));
    }

    
    // Prepare the payment transaction
    const prepared = await client.autofill({
        TransactionType: "Payment",
        Account: wallet.address,
        DeliverMax: xrpl.xrpToDrops(redeemAmount),
        Destination: BANK_ACCOUNT_ADDRESS,  // Make sure this is the correct recipient
    });
    
    // Sign the transaction
    const signed = wallet.sign(prepared);
    
    // Submit the transaction and wait for the response
    const tx = await client.submitAndWait(signed.tx_blob);
    const finalBalance = await client.getXrpBalance(wallet.address)
    
    // Disconnect after transaction
    await client.disconnect();
    
    // Respond with the transaction result
    res.status(200).json({
        result: "success",
        balance :finalBalance 
    })
});

exports.bank = catchAsync(async (req, res, next) => {
    const { walletAddress,redeemAmount, bankAccount, ifscCode, secret } = req.body;

    if (!redeemAmount || !walletAddress || !bankAccount || !ifscCode || !secret) {
        return next(new AppError("Missing required fields", 400));
    }
    if (!walletAddress) {
        return next(new AppError("Missing wallet address", 400));
    }
    if (isNaN(redeemAmount) || redeemAmount <= 0) {
        return next(new AppError("Redeem amount must be a positive number", 400));
    }

    if (!/^[a-zA-Z0-9]+$/.test(bankAccount)) {
        return next(new AppError("Invalid bank account format", 400));
    }

    if (!/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/.test(ifscCode)) {
        return next(new AppError("Invalid IFSC code format", 400));
    }

    if (!secret) {
        return next(new AppError("Invalid secret key format", 400));
    }

    const wallet = xrpl.Wallet.fromSeed(secret);

    await client.connect();

    const balance = await client.getXrpBalance(walletAddress);

    if (balance <= 20) {
        return next(new AppError("Minimum balance should be kept", 201));
    }

    if ((balance - redeemAmount) <= 20) {
        return next(new AppError("Insufficient balance for this transaction", 201));
    }

    const prepared = await client.autofill({
        TransactionType: "Payment",
        Account: walletAddress,
        DeliverMax: xrpl.xrpToDrops(redeemAmount),
        Destination: BANK_ACCOUNT_ADDRESS, 
    });

    const signed = wallet.sign(prepared);

    const tx = await client.submitAndWait(signed.tx_blob);
    const finalBalance = await client.getXrpBalance(walletAddress);

    await client.disconnect();

    res.status(200).json({
        result: "success",
        balance: finalBalance
    });
});
