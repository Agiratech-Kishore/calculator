window.onload = () => {
    document.getElementById("display").focus();
  }
  
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".buttons button");
  
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      ButtonClick(button.value);
    });
  });
  
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); 
      ButtonClick("=");
    }
  });
  
  const precedence = {
    "^": 3,
    "/": 2,
    "*": 2,
    "+": 1,
    "-": 1,
  };

  function ButtonClick(value) {
    if (value === "C") {
      display.value = "";
    } else if (value === "Del") {
      display.value = display.value.slice(0, -1);
    } else if (value === "=") {
      try {
        let input = display.value;
        let result = printResult(input);
        localStorage.setItem(display.value, result);
        display.value = result;
      } catch (error) {
        display.value = error;
      }
    } else {
      display.value += value;
    }
  } 

  function printResult(input) {
    return infixToPostfix(input);
  }

  function infixToPostfix(infixExpression) {
    let lastCharacterIndex = 0;
    let postfixExpressionList = [];
    let symbolStack = [];
    for (let i = 0; i < infixExpression.length; i++) {
      let currentElement = infixExpression.charAt(i);
      let operatorString = "^/*+-";
      let indexOfCurrentElement = i;
      if (i > 0 && !operatorString.includes(infixExpression[i-1]) && operatorString.includes(currentElement)) {
        postfixExpressionList.push(infixExpression.substring(lastCharacterIndex, indexOfCurrentElement).trim());
        lastCharacterIndex = indexOfCurrentElement + 1;
        insertSymbolIntoPostfixExpressionList(postfixExpressionList, symbolStack, currentElement);
      } else if (i === infixExpression.length - 1) {
        postfixExpressionList.push(infixExpression.substring(lastCharacterIndex, indexOfCurrentElement + 1).trim());
        emptySymbolStack(symbolStack, postfixExpressionList);
      }
    }
    console.log(postfixExpressionList);
    let result = performCalculation(postfixExpressionList);
    saveToStorage(infixExpression, result);
    if (isNaN(result)) return "Malformed Expression";
    return result;
  }
  
  function insertSymbolIntoPostfixExpressionList(postFixExpressionList, symbolStack, currentElement) {
    while (
      symbolStack.length > 0 &&
      precedence[currentElement] <=
        precedence[symbolStack[symbolStack.length - 1]]
    ) {
      postFixExpressionList.push(symbolStack.pop());
    }
    symbolStack.push(currentElement);
  }
  
  function emptySymbolStack(symbolStack, postFixExpressionList) {
    while (symbolStack.length > 0) {
      postFixExpressionList.push(symbolStack.pop());
    }
  }
  
  function performCalculation(postFixExpressionList) {
    let numberStack = [];
    while (postFixExpressionList.length > 0) {
      let firstPoppedElement = postFixExpressionList.shift();
      if ("^/*+-".includes(firstPoppedElement)) {
        let secondNumber = parseFloat(numberStack.pop());
        let firstNumber = parseFloat(numberStack.pop());
        //console.log(secondNumber + " " + firstNumber);
        if (firstPoppedElement === "^")
          numberStack.push(Math.pow(firstNumber, secondNumber));
        else if (firstPoppedElement === "/")
          numberStack.push(firstNumber / secondNumber);
        else if (firstPoppedElement === "*")
          numberStack.push(firstNumber * secondNumber);
        else if (firstPoppedElement === "+")
          numberStack.push(firstNumber + secondNumber);
        else if (firstPoppedElement === "-")
          numberStack.push(firstNumber - secondNumber);
        else return "invalid operator";
      } else {
        numberStack.push(firstPoppedElement);
      }
    }
    return numberStack.pop();
  }
  
  function saveToStorage(infixExpression, result) {
    localStorage.setItem(infixExpression, result);
    sessionStorage.setItem(infixExpression, result);
  }