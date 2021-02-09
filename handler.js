"use strict";
const { inspect } = require("util");

const AWS = require("aws-sdk");
const lambda = new AWS.Lambda({ region: "us-east-1" });

module.exports.onSuccess = async (event) => {
  console.log("success", event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "hi there, from onSuccess",
    }),
  };
};

module.exports.onFailure = async (event) => {
  console.log("failed", event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "hi there, from onFailure",
    }),
  };
};

module.exports.subLambda = async (event) => {
  console.log("sublambda event", event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "hi there, from sublam",
    }),
  };
};

module.exports.hello = async (event) => {
  console.log("hello event", event);
  let response;

  try {
    response = await new Promise((resolve, rej) => {
      const params = {
        FunctionName: "svless-dev-hi",
        InvocationType: "Event",
        Payload: JSON.stringify({}),
      };

      lambda.invoke(params, (err, res) => {
        if (err) rej(err);
        else resolve(res);
      });
    });
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Inner lambda failed to exec",
        stack: JSON.stringify(e),
      }),
    };
  }

  console.log("ressss", response);

  return {
    statusCode: 200,
    body: inspect({
      message: response,
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
