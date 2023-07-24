
"JSON-rule-engine" -> json-rules-engine is a powerful, lightweight rules engine. Rules are composed of simple json structures, making them human readable and easy to persist.

In this example->

Input ->  

{
    "facts" : {
        "reserveAmount": 987,
        "financialAuthority": 337,
        "productName": "Product 1",
        "bsi": 123
    }
}


Output -> 

{
    "message": "Condition/conditions passed",
    "result": {
        "authority": true,
        "condition2": "Product name is in product list",
        "amount": 123
    }
}


Conditions for passing the rule -> 

1. if reserveAmount > financialAuthority then shouldSendForApproval = true else shouldSendForApproval = false

2. if productName is in Product Array (Product array is set in rules)

3. if bsi < reserveAmount then amount = bsi else amount = reserveAmount


If all conditions are passed then ->

Output - > 

{
    "message": "Condition/conditions passed",
    "result": {
        "shouldSendForApproval": true,
        "condition2": "Product name is in product list",
        "amount": 123
    }
}

If first condition fails ->

Output - > 

{
    "message": "Condition/conditions failed",
    "result": {
        "shouldSendForApproval": false,
        "condition2": "Product name is in product list",
        "amount": 123
    }
}

If second condition fails ->

Output - > 

{
    "message": "Condition/conditions failed",
    "result": {
        "shouldSendForApproval": true,
        "condition2": "Product name is not in product list",
        "amount": 123
    }
}

