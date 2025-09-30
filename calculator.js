 // Global variables tostore calculator state
 let currentInput = '';
 let previousInput = '';
 let operator = '';
 
 let shouldResetDisplay= false;

 // Get display element
 const display = document.getElementById('display');
 /**
 * Append value to display
 * @param {string} value-The value to append (number, operator,or decimal)
 */
 function appendToDisplay(value){
 // If we should resetdisplay (after calculation), clear it first
 if (shouldResetDisplay){
 clearDisplay();
 shouldResetDisplay= false;
 }
 // Handle differenttypes of input
 if (isOperator(value)){
 handleOperator(value);
 } else if (value ==='.') {
 handleDecimal();
 } else {
handleNumber(value);
 }
 updateDisplay();
 }
 /**
 * Handle number input
 * @param {string} number-The number to add
 */
 function handleNumber(number){
 if (currentInput.length< 10) { // Prevent overflow
 currentInput +=number;
 }
 }
 /**
 * Handle decimal pointinput
 */
 function handleDecimal(){
 // Only add decimalif there isn't one already
 if (!currentInput.includes('.')){
 currentInput =currentInput || '0'; // Add 0 if empty
 currentInput +='.';
 }
 }
 /**
 * Handle operator input
 * @param {string} op-The operator (+,-, *, /, %, √)
 */
 function handleOperator(op){
/* for the suareroot value to come befor the number  */
  if (op === '√') {
    operator = op;
    previousInput = ''; // no previous number needed
    currentInput = '';  // wait for user to enter the number
    return;
  }


 // If there's a currentcalculation in progress, calculate itfirst
 if (currentInput !=='' && previousInput !== '' && operator !=='' && digit !=='') {
 calculate();
 }
 // Set up for nextoperation
 if (currentInput !=='') {
 previousInput= currentInput;
 currentInput ='';
 operator = op;
 } else if (previousInput!== '') {
 // Allow changingoperator if no new number entered
 operator = op;
 }
 }
 /**
 * Check if a value isan operator
 * @param {string} value-Value to check
* @returns {boolean}-True if value is an operator
 */
 function isOperator(value){
 return ['+', '-','*', '/', '%', '√'].includes(value);
 }
 /**
 * Perform the calculation
 */
 function calculate() {
if (operator === '√') {
    // Square root only needs one input
    const value = currentInput !== '' ? parseFloat(currentInput) : parseFloat(previousInput);
    let result = squareroot(value);

    if (typeof result === 'string') {
      currentInput = result; // error message
    } else {
      currentInput = parseFloat(result.toFixed(10)).toString();
    }

    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
    updateDisplay();
    return;
  }

 if (previousInput=== '' || currentInput === '' || operator ==='') {
 return;
 }
 const prev = parseFloat(previousInput);
 const current = parseFloat(currentInput);
 let result;
 try {
 switch (operator){
 case '+':
 result= add(prev, current);
 break;
 case '-':
 result= subtract(prev, current);
 break;
 case '*':
 result= multiply(prev, current);
 break;
 case '/':
 result= divide(prev, current);
 break;
 case '%':
 result= modulus(prev, current);
 break;
 default:
 throw new Error('Invalid operator');
 }
 
 // Handle theresult
 if (typeof result=== 'string') {
 // Error message
 currentInput= result;
 } else {
 // Round toprevent floating point errors
 currentInput= parseFloat(result.toFixed(10)).toString();
 }
 } catch (error) {
 currentInput ='Error';
 }
 // Reset for nextcalculation
 previousInput = '';
 operator = '';
 shouldResetDisplay= true;
 updateDisplay();
 }
 /**
 * Basic arithmetic functions
 */
 function add(a, b) {
 return a + b;
 }
 function subtract(a, b){
 return a - b;
 }
 function multiply(a, b){
 return a * b;
 }
 function divide(a, b){
 if (b === 0) {
 return "Cannot divide by zero";
 }
 return a / b;
 }

 /* create modulus arithmetic function */
function modulus(a, b){
  if( b === 0){
    return "Invalid input"
  }
return a % b
 }

 /* create squareroot function */
 function squareroot(value){
    if(value < 0){
        return "Invalid input"
    }
    return Math.sqrt(value)
 }

 /**
 * Clear the entire displayand reset calculator
 */
 function clearDisplay(){
 currentInput = '';
 previousInput = '';
 operator = '';
 shouldResetDisplay= false;
 updateDisplay();
 }
 /**
 * Delete the last enteredcharacter
 */
 function deleteLast(){
 if (currentInput.length> 0) {
 currentInput =currentInput.slice(0,-1);
 updateDisplay();
 }
 }
 /**
 * Update the displaywith current input
 */
function updateDisplay(){
 let displayValue =currentInput || '0';
 // Format large numberswith commas
 if (!isNaN(displayValue)&& displayValue !== '') {/* verifies displayValue is a number and not an empty string, If it is annumber then display Value id displayed otherwise it defaults to 0 */
 const num = parseFloat(displayValue); /* parseFloat convets a decimal into a whole number */
 if (Math.abs(num)>= 1000) { /* Math.abs converts a negative number into a positive number. Check if positive number is greater than a thousand */
 displayValue= num.toLocaleString(); /* If a number is > 1000 then it formats it using toLocaleString() eg 12345 -> 12,345*/
 }
 }
 display.value = displayValue;
 }
 /**
 * Add keyboard support
 */
 document.addEventListener('keydown',function(event) {
 event.preventDefault();// Prevent default browser behavior
 const key = event.key;
 // Handle number keys
 if (key >= '0' &&key <= '9') {
 appendToDisplay(key);
 }
 // Handle operatorkeys
 else if (['+', '-', '*', '/', '%', '√'].includes(key)) {
 appendToDisplay(key);
 }
 // Handle decimalpoint
 else if (key === '.'|| key === ',') {
 appendToDisplay('.');
 }
 // Handle enter/equals
 else if (key === 'Enter'|| key === '=') {
 calculate();
 }
 // Handle escape/clear
 else if (key === 'Escape'|| key === 'c' || key === 'C') {
 clearDisplay();
 }
 // Handle backspace
 else if (key === 'Backspace'){
 deleteLast();
 }
 });
 // Initialize display
 updateDisplay();