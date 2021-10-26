import * as Colyseus from "colyseus.js"
export class TTTClient extends Colyseus.Client{
    room:Colyseus.Room=null;
    constructor()
    {
        super();
        this.endpoint='ws://localhost:2567';
    }
    async connect()
    {
        try
        {
            this.room=await this.joinOrCreate("my_room");
            //this.messagebox();
        }
        catch(error)
        {
            console.log("Error during Room creation!",error);
        }
        return true;//Promise
    }

    messagebox()
    {
        window.onload=()=>{
            const INPUT_AREA=<HTMLInputElement>document.getElementById("inputmsg");
            const BUTTON=<HTMLInputElement>document.getElementById("sendbtn");
            /*
            const sendmsg=()=>{
                const MESSAGE=(<HTMLInputElement>document.getElementById("inputmsg"));
                this.room.send("say",MESSAGE.value);
                MESSAGE.value=" ";
            }
            INPUT_AREA.addEventListener("keydown",(event)=>{
                if(event.code=="Enter")
                {
                    const MESSAGE=(<HTMLInputElement>document.getElementById("inputmsg"));
                    this.room.send("say",MESSAGE.value);
                    MESSAGE.value=" ";
                }
            });
            */
            BUTTON.addEventListener("click",()=>
            {
                const MESSAGE=(<HTMLInputElement>document.getElementById("inputmsg"));
                this.room.send("say",MESSAGE.value);
                MESSAGE.value=" ";
            });     
        }
        this.room.onMessage("replied",(message)=>
            {
                const textarea=(<HTMLTextAreaElement>document.getElementById("chatbox"));
                const oldValue=textarea.value;
                const newValue=oldValue+"\n"+message;
                textarea.value=newValue;
            });
            this.room.onMessage("return",(message)=>
            {
                const textarea=(<HTMLTextAreaElement>document.getElementById("chatbox"));
                const oldValue=textarea.value;
                const newValue=oldValue+"\n"+message;
                textarea.value=newValue;
                console.log("aaaaaaaaa");
            });
    }

}