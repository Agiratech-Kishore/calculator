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
        let result = finalResult(input);
        localStorage.setItem(display.value, result);
        display.value = result;
      } catch (error) {
        display.value = error;
      }
    } else {
      display.value += value;
    }
  } 

  function finalResult(input) {
    return infixToPostfix(input);
  }

  function infixToPostfix(input) {
    let lastCharacterIndex = 0;
    let array = [];
    let symbolStack = [];
    for (let num = 0; num < input.length; num++) {
      let currentElement = input.charAt(num);
      let operatorString = "^/*+-";
      let iOfCurrentElement = num;
      if (num > 0 && operatorString.includes(currentElement)) {
        array.push(input.substring(lastCharacterIndex, iOfCurrentElement));
        lastCharacterIndex = iOfCurrentElement + 1;
        insertSymbolIntoSymbolStack(array, symbolStack, currentElement);
      } else if (num === input.length - 1) {
        array.push(input.substring(lastCharacterIndex, iOfCurrentElement + 1));
        emptySymbolStack(symbolStack, array);
      }
    }
    let result = evaluatepostfix(array);
    if (isNaN(result)) return "Error";
    return result;
  }
  
  function insertSymbolIntoSymbolStack(array, symbolStack, currentElement) {
    while (
      symbolStack.length > 0 &&
      precedence[currentElement] <= precedence[symbolStack[symbolStack.length - 1]]) {
      array.push(symbolStack.pop());
    }
    symbolStack.push(currentElement);
  }
  
  function emptySymbolStack(symbolStack, array) {
    while (symbolStack.length > 0) {
      array.push(symbolStack.pop());
    }
  }
 

function evaluatepostfix(array) {
  const stack = [];//111
 
  for (const num of array) {
    if (!isNaN(num) || num.includes(".")) {
      stack.push(parseFloat(num));
    } else {
      const operand2 = stack.pop();
      const operand1 = stack.pop();
 
      switch (num) {
        case "+":
          stack.push(operand1 + operand2);
          break;
        case "-":
          stack.push(operand1 - operand2);
          break;
        case "*":
          stack.push(operand1 * operand2);
          break;
        case "^":
            stack.push(Math.pow(operand1, operand2));
          break;
        case "/":
          if (operand2 === 0) {
            throw new Error("Division by zero");
          }
          stack.push(operand1 / operand2);
          break;
      }
    }
  }
 
  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }
  return stack.pop();
}
  
  