"use strict";

const express = require("express");
const app = express();
require("dotenv").config();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const JRE = require("json-rules-engine");

//middlewares
app.use(morgan("tiny"));
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function getRule(obj) {
  const objProps = Object.getOwnPropertyNames(obj);
  const newObj = {};
  for (let i = 0; i < objProps.length; i++) {
    newObj[objProps[i]] = objProps[i];
  }

  const rule = {
    conditions: {
      all: [
        {
          // all:[{

          // }]
          fact: newObj.reserveAmount,
          operator: "greaterThan",
          value: obj[newObj.financialAuthority], //"financialAuthority",
          // path: "$.financialAuthority",
          //337, //"financialAuthority",
        },
        {
          fact: newObj.productName,
          operator: "in",
          value: [
            "Product 1",
            "Product 5",
            "Product 4",
            "Product 3",
            "Product 2",
          ],
        },
        {
          fact: newObj.bsi,
          operator: "lessThan",
          value: obj[newObj.reserveAmount],
        },
      ],
    },
    event: {
      // define the event to fire when the conditions evaluate truthy
      type: "all conditions passed",
      params: {
        result: {
          shouldSendForApproval: true,
          condition2: "Product name is in product list",
          amount: obj[newObj.bsi],
        },
      },
    },
  };

  return rule;
}

app.use("/task", async (req, res) => {
  const engine = new JRE.Engine();

  const facts = req.body.facts;

  const rule = getRule(facts);

  engine.addRule(rule);

  // Render function is created to show the successfull messages or failed message and conditions
  function render(event, ruleResult) {
    // if rule succeeded, render success message
    // console.log("event", event, "eventEnd");
    if (ruleResult.result) {
      return event.params.result; //console.log(event.params.result); //, ruleResult);
    }

    // Return detail if failed
    let detail = ruleResult.conditions.all
      .filter((condition) => !condition.result)
      .map((condition) => {
        switch (condition.operator) {
          case "greaterThan":
            event.params.result.shouldSendForApproval = false;
            return event.params.result;
          case "in":
            event.params.result.condition2 =
              "Product name is not in product list";
            return event.params.result;
          case "lessThan":
            event.params.result.amount = facts.reserveAmount;
            return event.params.result;
          default:
            return "";
        }
      });
    // console.log("detail 0", detail[0]);
    return detail[0];
  }

  engine.on("success", (event, almanac, ruleResult) => {
    const result = {};
    result.message = "Condition/conditions passed";
    result.result = render(event, ruleResult);
    console.log("success", result);
    res.status(200).json(result);
    // return result;
    // })
  });

  engine.on("failure", (event, almanac, ruleResult) => {
    // const result = render(event, ruleResult);
    const result = {};
    result.message = "Condition/conditions failed";
    result.result = render(event, ruleResult);
    console.log("failure", result);
    res.status(200).json(result);
    //   });
  });

  //   console.log(await engine.run(facts));
  await engine.run(facts);
});

async function start() {
  app.listen(3000, () => console.log("Server is listening at 3000"));
}

start();
