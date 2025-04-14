import express, { json } from "express"; 
import cors from "cors";
import { SessionsClient } from '@google-cloud/dialogflow';

const app = express();
const port = 3002;
app.use(cors());
app.use(json());

app.listen(port,()=>{
    console.log(`${port} 연결 성공`)
})

app.post("/api/chat",async(req, res)=> {

    const {message, sessionId} = req.body;
    const sessionClient = new SessionsClient({
        keyFilename: '../f--tvdm-99cfc39455c5.json'
    });
    const sessionPath = sessionClient.projectAgentSessionPath('f--tvdm', sessionId);

    const request = {
        session: sessionPath,
        queryInput:{
            text: {
                text:message,
                languageCode: 'ko',
            },
        },

    };
    try{
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({answer: result.fulfillmentText,
        parameters: result.parameters
    });
    }catch (error) {
        console.error("Dialogflow 호출 오류:", error);
        res.status(500).json({ error: "Dialogflow 호출 실패" });
    }
}); 