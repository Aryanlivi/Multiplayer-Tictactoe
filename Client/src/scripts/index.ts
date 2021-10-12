import * as Colyseus from "colyseus.js";
import * as PIXI from "pixi.js"
const APP_WIDTH:number=400;
const APP_HEIGHT:number=400;
class MainApp extends PIXI.Application
{
    tttboard:TTTBoard;
    constructor()
    {
        super();
        this.view.width=APP_WIDTH;
        this.view.height=APP_HEIGHT;
        document.body.appendChild(this.view);
        // Add it to the stage to render
        this.addboard();
    }
    addboard()
    {
        this.tttboard=new TTTBoard();
        this.stage.addChild(this.tttboard);
    }
} 
class TTTBoard extends PIXI.Container
{ 
    box:TTTBox;
    boxarray:Array<TTTBox>=[];
    constructor()
    {
        super();
  
        const nrows:number=3;
        const ncols:number=3;
        for(let row=0;row<nrows;row++)
        {
            for(let col=0;col<ncols;col++)
            {
                this.box=new TTTBox(row,col);
                this.boxarray.push(this.box);
                this.addChild(this.box);
            }
        }
        this.pivot.x=this.width/2;
        this.pivot.y=this.height/2;
        this.x=APP_WIDTH/2;
        this.y=APP_HEIGHT/2;
    }   
}
class TTTBox extends PIXI.Graphics
{
    POSX:number=0;
    POSY:number=0;
    WIDTH:number=0;
    HEIGHT:number=0;
    textStyle:PIXI.TextStyle;
    letter:PIXI.Text;
    conditions:Array<string>=[" ","X","O"];
    status:string=this.conditions[0];
    color=0xffffff;
    constructor(posX:number,posY:number)
    {
        super();
        this.drawboxes(posX,posY)
        this.displaysign();
        this.clickevent();
    }
    drawboxes(posX:number,posY:number)
    {
        const OFFSETX=5;
        const OFFSETY=5;
        this.WIDTH=0.25*APP_WIDTH;
        this.HEIGHT=0.25*APP_HEIGHT;
        this.POSX=posX*(this.WIDTH+OFFSETX);
        this.POSY=posY*(this.HEIGHT+OFFSETY);
        this.buttonMode=true;
        this.interactive=true;
        this.beginFill(0xffffff);
        this.drawRect(this.POSX,this.POSY,this.WIDTH,this.HEIGHT);
        this.endFill();
    }
    displaysign()
    {
        this.textStyle=new PIXI.TextStyle(
            {
                fontFamily:"Comic Sans MS",
                fontSize:50
            }
        );
        this.letter=new PIXI.Text(this.status,this.textStyle);
        this.letter.x=this.POSX+0.3*this.WIDTH;
        this.letter.y=this.POSY+0.2*this.HEIGHT;
        this.addChild(this.letter);
    }
    clickevent()
    {
        this.on("pointerdown",()=>{
            PLAYER.room.send("updatesign");
            PLAYER.room.state.onchange=(changes)=>{
                changes.foreach(change=>{
                    console.log(change);
                })
            }   
            /*
            PLAYER.room.onMessage("newboxstatus",(message)=>
            {
                this.letter.text=message;
                this.addChild(this.letter);
                console.log("done");
            });
            */
        });
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
            const INPUT_AREA=<HTMLInputElement>document.getElementById("inputmsg");
            const BUTTON=<HTMLInputElement>document.getElementById("sendbtn");
            const sendmsg=()=>{
                const MESSAGE=(<HTMLInputElement>document.getElementById("inputmsg"));
                this.room.send("say",MESSAGE.value);
                MESSAGE.value=" ";
            }
            INPUT_AREA.addEventListener("keydown",(event)=>{
                if(event.code=="Enter")
                {
                    sendmsg();
                }
            });
            BUTTON.addEventListener("click",()=>
            {
                sendmsg();
            });
        }
    }

}
const PLAYER=new Player();

