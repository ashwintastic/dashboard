import express from 'express';
import flowService from '../service/FlowService';
import botService from '../service/BotService';
import { auth } from '../config';
import logoImage from '../components/Header/logo_full.png';
import loadingImage from '../components/Chart/gif-load.gif';

const router = express.Router();

const htmlLayoutHead = (auth, data) => `
    <head>
    <script>

        window.fbAsyncInit = function() {
        FB.init({
            appId: "${auth.facebook.id}",
            xfbml: true,
            version: "v2.6"
        });

        FB.Event.subscribe('send_to_messenger', function(e) {
            //console.log('sendtomessenger', e);
            if(e.event === "clicked"){
            //console.log('sendtomessenger: User clicked so showing m.me link!');
            setTestlinkStatus('${data._id}');
            document.getElementById("sentToMessengerStatus").innerHTML = '<br><p>If the "Send to Messenger" checkbox is blue you should have received a message. Here is a link to go to messenger directly:</p><a href="//m.me/${data.platformBotId}">Click to Messenger</a>';
            } else if (!e.is_after_optin && e.event === "rendered") {
            //console.log('sendtomessenger: Hiding logo image!');
            document.getElementById("sentToMessengerStatus").innerHTML = "";
            }
        });
        };

        (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        function setTestlinkStatus(testLinkId) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
            };
            xhttp.open("PUT", '/api/testlink/'+ testLinkId +'/status/active', true);
            xhttp.send();
        }
    </script>
    </head>`;

const htmlLayoutBody = (auth, logoImage, loadingImage, data) => {
    return htmlLayoutStart(logoImage) + htmlContent(auth, loadingImage, data) + htmlLayoutEnd();
}
const htmlLayoutStart = (logoImage) => `
    <body>
    <div style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); border-radius: 0px; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; box-sizing: border-box; font-family: Roboto, sans-serif; color: rgba(0, 0, 0, 0.870588); box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px; background-color: rgb(0, 188, 212); position: relative; z-index: 1100; width: 100%; display: flex; padding-left: 24px; padding-right: 24px;">
        <div style="margin-top: 8px; margin-right: 8px; margin-left: -16px;">
            <img src=${logoImage} alt="Logo" height="45px" />
        </div>
        <h1 style="font-weight: 400; white-space: nowrap; text-overflow: ellipsis; margin: 0px; padding-top: 0px; letter-spacing: 0px; font-size: 24px; overflow: hidden; color: rgb(255, 255, 255); height: 64px; line-height: 64px; flex: 1 1 0%;">
        </h1>
    </div>


    <div style="-webkit-tap-highlight-color:rgba(0,0,0,0);color:rgba(0, 0, 0, 0.87);background-color:#ffffff;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;box-sizing:border-box;font-family:Roboto, sans-serif;box-shadow:0 1px 6px rgba(0, 0, 0, 0.12),
         0 1px 4px rgba(0, 0, 0, 0.12);border-radius:2px;mui-prepared:;">
        <div style="padding:20px">
            <div style="margin-bottom:30px">
                <h3>Bot Testing</h3>
            </div>`;

const htmlLayoutEnd = () => `</div></div></body>`;

const htmlContent = (auth, loadingImage, data) => {
    let content = `<p>Please click on the "Send to Messenger" button below to start testing.</p>
        <p>If you are not logged into Facebook or this is the first time testing then Facebook will ask you to login and provide permission.
        <p>After accepting you should receive a message from the bot on Facebook messenger.</p>

        <div style="margin:20px;"></div>
        <div class="fb-send-to-messenger"
        messenger_app_id="${auth.facebook.id}"
        page_id="${data.platformBotId}"
        data-ref="${data.testRef}"
        color="blue"
        size="large">
        </div>

        <div id="sentToMessengerStatus"><img src="${loadingImage}"/></div>`;
    if (data.status === "deactivated") {
        content = "The link has been deactivated";        
    } else if (data.status === "active") {
        content = "<p>This link has already been activated. You should be able to test this on messenger now.</p>"+ 
                "<p>Here is a link to go to messenger directly:</p><a href='//m.me/"+ data.platformBotId +"'>Click to Messenger</a>";        
    }
    return content;
};

router.get(
    '/:testlinkId',
    async (req, res) => {
        var testlinkId = req.params.testlinkId;

        //const data = await botService.getTestLinkData(testlinkId);
        botService.getTestLinkData(testlinkId).then(function(data) {
            let htmlResponse = "";
            if (data.expiry < Date.now() && data.status === "inactive") {
                var expiredMsg = "The link is expired";
                htmlResponse = "<html>"+ 
                        htmlLayoutStart(logoImage) + 
                        expiredMsg +
                        htmlLayoutEnd() + "</html>";
            } else {
                htmlResponse = "<html>"+ 
                    htmlLayoutHead(auth, data) + 
                    htmlLayoutBody(auth, logoImage, loadingImage, data) + "</html>";
            }
            res.send(`${htmlResponse}`);
        }).catch(function(err) {
            const errMsg = "<p>This test link is not valid.  Please check with the user who created it.</p>"
            let htmlResponse = "<html>"+ 
                    htmlLayoutStart(logoImage) + 
                    errMsg +
                    htmlLayoutEnd() + "</html>";
            res.send(`${htmlResponse}`);
        });

    });

export const testingRouter = router;
