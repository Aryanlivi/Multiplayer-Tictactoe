import * as Colyseus from "colyseus.js";
import * as PIXI from "pixi.js"

class MainApp extends PIXI.Application
{
    ttt=new TTTBoard();
    constructor()
    {
        super();
        this.view.width=450;
        this.view.height=450;
        document.body.appendChild(this.view);
        // Add it to the stage to render
        this.stage.addChild(this.ttt);
    }
} 



class TTTBoard extends PIXI.Container
{
    NO_OF_BOXES=9;
    box:TTTBox;
    constructor()
    {
        super();
        this.box=new TTTBox(0,0,this.NO_OF_BOXES);
        this.addChild(this.box);
    }
    
}
class TTTBox extends PIXI.Graphics
{
    obj:PIXI.RoundedRectangle;
    color=0xffffff;
    constructor(posx,posy,nboxes)
    {
        super();
        this.obj.width=APP.view.width/nboxes;
        this.obj.height=APP.view.height/nboxes;
        this.obj.radius=20;
        this.buttonMode=true;
        this.interactive=true;
        this.drawRoundedRect(posx,posy,this.obj.width,this.obj.height,this.obj.radius);
    }
}



const APP=new MainApp();


class Player extends Colyseus.Client{
    room:Colyseus.Room=null;
    constructor()
    {
        super();
        this.endpoint='ws://localhost:2567';
        this.connect();
        this.messagebox();
    }
    connect()
    {
        
        //const CLIENT = new Colyseus.Client('ws://localhost:2567');
        this.joinOrCreate("my_room").then(proom => {
            this.room=proom;
            console.log(this.room.sessionId, "joined", this.room.name);

            this.room.onMessage("replied",(message)=>
            {
                const textarea=(<HTMLTextAreaElement>document.getElementById("chatbox"));
                const oldValue=textarea.value;
                const newValue=oldValue+"\n"+message;
                textarea.value=newValue;
            });

            this.room.onMessage("return",(message)=>
            {
                console.log("server just sent this message:");
                console.log(message);
                const textarea=(<HTMLTextAreaElement>document.getElementById("chatbox"));
                const oldValue=textarea.value;
                const newValue=oldValue+"\n"+message;
                textarea.value=newValue;
            });

        }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }

    messagebox()
    {
        window.onload=()=>
        {
            const BUTTON=<HTMLInputElement>document.getElementById("send");
            BUTTON.addEventListener("click",()=>
            {
                const message=(<HTMLInputElement>document.getElementById("msgbox"));
                this.room.send("say",message.value);
                message.value=" ";
            });
        }
    }
}
const PLAYER=new Player();

