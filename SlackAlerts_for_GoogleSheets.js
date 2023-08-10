/** 
Using Google App Script, this script can read data from Google Sheets, Sort it and send a Custom Alert on Slack using the Slack App Webhook.
Use case example: 

Use Google App Script to trigger this script each time a new Form response is captured in Google Sheets
*/

/** Function to Sort Responses in Google Sheet */
function sortResponses() {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Enter the Sheet tab name here");
  sheet.sort(1, false);/** Row number, false will short in descending, true will short in ascending order */
  getSheetValues(sheet)
}

/** Function to send prepare data for Slack Notifications */
function getSheetValues(sheet) {
  
  const ss = sheet
  let data = ss.getRange("Select the cells range, example A2:A6").getValues();

  /** Calling the Function to create require data and send Slack alert */
  sendAlert(convertSlackFormat(data))
}

/** Function to build data into Slack format */
function convertSlackFormat(message) {
  let managerEmail = message[0][0]
  let newHireName = message[0][1]

  let payload = {
    /** Converting data into slack undestable format https://app.slack.com/block-kit-builder/ */
    "blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text":":new: "+managerEmail+" just completed "+ newHireName+"'s <https://docs.google.com/spreadsheets/d/example|New Hire IT Onboarding Form>"
			}
		}
	]
  }
  return payload;
}

/** Funtion to send Slack Alert */
function sendAlert(payload) {
  const webhook = "Enter your Slack App Webhook URL";
  var options = {
    "method": "post", 
    "contentType": "application/json", 
    "muteHttpExceptions": true, 
    "payload": JSON.stringify(payload) 
  };
  
  try {
    UrlFetchApp.fetch(webhook, options);
  } catch(e) {
    Logger.log(e);
    console.log(e)
  }
}
