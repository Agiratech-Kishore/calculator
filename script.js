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

function ButtonClick(value) {
  if (value === "C") {
    display.value = "";
  } else if (value === "Del") {
    display.value = display.value.slice(0, -1);
  } else if (value === "=") {
    try {
      let result = evaluateInput(display.value);
      localStorage.setItem(display.value, result);
      display.value = result;
    } catch (error) {
      display.value = "Error";
    }
  } else {
    display.value += value;
  }
}

function evaluateInput(input) {
  const arithmeticoperators = ['+', '-', '*', '/'];
  const  numberSymbolList= input.split(/([\+\-\*\/])/);
  
  const ValidOperator = numberSymbolList.filter(operator => operator.trim() !== '');

  const stack = [];
  let currentSymbol = null;

  for (let i = 0; i< ValidOperator.length; i++) {
    const operator = ValidOperator[i];
    if (arithmeticoperators.includes(operator)) {
      currentSymbol = operator;
    } else {
      const num = parseFloat(operator);
      if (!isNaN(num)) {
        if (currentSymbol === null) {
          stack.push(num);
        } else {
          const prevNum = stack.pop();
          switch (currentSymbol) {
            case '+':
              stack.push(prevNum + num);
              break;
            case '-':
              stack.push(prevNum - num);
              break;
            case '*':
              stack.push(prevNum * num);
              break;
            case '/':
              if (num !== 0) {
                stack.push(prevNum / num);
              } else {
                throw new Error("Division by zero");
              }
              break;
          }
        }
      }
    }
  }

  if (stack.length === 1) {
    return stack[0];
  } else {
    throw new Error("Invalid expression");
  }
}
