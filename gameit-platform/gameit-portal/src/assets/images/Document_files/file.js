"use strict"

// let num = 12.23;
// console.log(num)
// console.log(Number.MIN_SAFE_INTEGER)
// console.log(Number.MAX_SAFE_INTEGER)

// console.log(Math.PI);

// mathematical operators

// let num = 12;
// num = num +2;
// console.log(num-10)
// console.log(12%9)
// console.log(4**4)
// console.log(2**53-1)

// precedence //associativity
// paranthesis
// exponents   right to left
// * / %       left to right
// + -         left to right

// console.log((2 + 3) / 2 + 3**2**2 + (4 / 2 * 3) -3);
// console.log(5 / 2 + 3**2**2 + (4/2*3) -3);
// console.log(5 / 2 + 3**4 + (4/2*3) -3);

// e in numbers

// let num = 1000
// let num = 1e3
// let num = 2.1e4; //21000 2.1 * 10000
// console.log(num);

// let num2 = 2.1e-4; // 2.1/ 10000
// console.log(num2);

// number separators
// let num = 100_000_000
// console.log(num+1)

// increment and decrement
// let num = 0
// num = num+2
// console.log(num+3);
// num++;
// console.log(num)

// prefix and postfix
// let num = 4;
// console.log(num++);
// console.log(num);

// let num2 = 4;
// console.log(++num2);
// console.log(num2);

// mix strings and numbers
// let num = "10"
// let str = "hello"
// console.log(num+str)

// let num = 12;
// let num2 = 10;
// num2 = parseInt(num2)
// console.log(num+num2)

// let num = 12;
// let num2 = 10.23;
// num2 = parseFloat(num2);
// console.log(num+num2);

// console.log(typeof "4");

// null & undefined
// let num;
// console.log(num);

// let num= null;
// console.log(num);

// math object
// let num = 12.9;
// console.log(Math.round(num));
// console.log(Math.floor(num));
// console.log(Math.ceil(num));

// absolute value

// let num= -12;
// console.log(Math.abs(num));

// let num= -12.29;
// console.log(Math.max(12,23,19.2,15));
// console.log(Math.min(12,23,19.2,15));

// random numbers

let randomnumber = Math.floor (Math.random()*10);
console.log(randomnumber);