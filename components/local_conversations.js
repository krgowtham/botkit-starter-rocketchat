// this module is used to create local conversations with your bot
const axios = require('axios');
var res = {};
module.exports = function localConversations(controller) {
    
    controller.hears(['Hi'], 'direct_message,live_chat,channel,private_channel', function (bot, message) {
         bot.startConversation(message, function (err, convo) {
			convo.say('Hello ' + message.raw_message.u.name);
			convo.say('Please send me a Diff URL or Pull Request URL or Commit URL to review the code.');
		 });
     });

    controller.hears('https://stash.ghx.com:7893/*', 'direct_message,live_chat,channel,private_channel', async(bot, message) => {
		axios.post('http://localhost:8080/code-review-service/review', {
			"reviewUrl": `${ message.text }`
		})
		.then(function (response) {
			res = response.data;
			resJson = JSON.stringify(res);
            bot.reply(message,{ text: "Request ID: " + `${res.reviewRequestId}` 
+ "\nFiles Reviewed: " + `${res.numOfAnalyzedFiles}` + "\nNumber of Comments: " + `${res.numOfComments}` + "\nCheck out https://code-review.smi.com/" + `${res.reviewRequestId}` + " for more details."});
            console.log(":", res);
		})
		.catch(function (error) {
			console.log(error);
		});
	});
}
