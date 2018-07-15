// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const { dialogflow } = require('actions-on-google');
const { SimpleResponse } = require('actions-on-google');
 
const app = dialogflow();



app.intent('Default Welcome Intent', (conv) => {
  var current_year = (new Date()).getFullYear();

  var now = new Date().getTime();

  console.log(now);

  var check = new Date('03/21/' + current_year + ' 00:45:00 UTC+0700');

  if (check - now <= 0) {
    current_year++;
  }

  let TargetDate = '03/21/' + current_year + ' 00:45:00 UTC+0700';

  let countDownDate = new Date(TargetDate).getTime();
  let distance = countDownDate - now;
  
  console.log(distance);
  
  var DaysInMonth = [
    31, 29, 31,
    30, 31, 30,
    31, 31, 30,
    31, 30, 31
  ];
  
  function isLeap(Year) {
    return (Year % 4 === 0 && Year % 100 !== 0) || (Year % 400 === 0);
  }
  
  function getDaysAndMonths(days) {
    let daysLeft = days;
    let thisMonth = (new Date()).getMonth();
    let monthsPassed = 0;
    while ( daysLeft > DaysInMonth[thisMonth] ) {
      let days = ( isLeap((new Date()).getFullYear()) && thisMonth == 1 ) ? DaysInMonth[thisMonth] + 1: DaysInMonth[thisMonth];
      thisMonth = ( thisMonth + 1 >= 12 ) ? 0 : thisMonth + 1;
      daysLeft = daysLeft - days;
      monthsPassed++;
    }
    return {day: daysLeft, month: monthsPassed};
  }
  
  let process = getDaysAndMonths(distance / (1000 * 60 * 60 *24));
  
  console.log("RES: "+process);
  console.log("IN: "+(distance / (1000 * 60 * 60 *24)));
  
  let months = Math.floor(process.month);
  let days = Math.floor(process.day);
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  console.log("MON: " + months);
  console.log("DAY: " + days);
  console.log("HRS: " + hours);
  console.log("MIN: " + minutes);
  console.log("SEC: " + seconds);
  
  let res_text="Hello! Our glorious leader, Prayuth Chan-O-Cha's birthday will be soon in ";
  
  let res_ssml="<speak><s>Hello</s><break time='600ms'/><s>Our glorious leader<break time='300ms'/>Prayuth Chan-O-Cha's birthday will be soon in<break time='150ms' />"
  
  if(months!== 0) {
    res_text += months+" months ";
    res_ssml += months+" months<break time='300ms' />";
  }
  if(days!== 0) {
    res_text += days+" days ";
    res_ssml += days+" days<break time='300ms' />";
  }
  if(hours!== 0) {
    res_text += hours+" hours ";
    res_ssml += hours+" hours<break time='300ms' />";
  }
  if(minutes!== 0) {
    res_text += minutes+" minutes ";
    res_ssml += minutes+" minutes<break time='300ms' />";
  }
  if(seconds!== 0) {
    res_text += seconds+" seconds ";
    res_ssml += seconds+" seconds<break time='300ms' />";
  }
  
  res_text += ". We wish him a happy birthday and wish him was healthtieness.";
  res_ssml += ".</s><s>We wish him a happy birthday and wish him was healthtieness.</s></speak>";

  conv.close(new SimpleResponse({
    speech: res_ssml,
    text: res_text,
  }));

});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
