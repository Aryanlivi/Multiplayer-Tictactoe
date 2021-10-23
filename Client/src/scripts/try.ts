import { Room } from "colyseus.js";
import * as PIXI from "pixi.js"
import {TTTClient} from "../ClientServer"
const APP_WIDTH:number=400;
const APP_HEIGHT:number=400;
const client=new TTTClient();
let roomState=null;
class TicTacToe extends PIXI.Application
{
    tttboard:TTTBoard;
    constructor()
    {
        super();
        this.view.width=APP_WIDTH;
        this.view.height=APP_HEIGHT;
        document.body.appendChild(this.view);
        // Add it to the stage to render
        this.init();
    }
    async init()
    {
        const room_created=await client.connect();
        if(room_created)
        {
            roomState=client.room.state;
            this.tttboard=new TTTBoard();
            this.stage.addChild(this.tttboard);
        }
    }
} 
class TTTBoard extends PIXI.Container
{ 
    box:TTTBox;
    Boxes:Array<TTTBox>=[];
    ibox:TTTBox;//Interacted Box
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
                this.Boxes.push(this.box);
                roomState.Boxes.push(this.box);
                console.log(roomState.Boxes);
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
        this.drawboxes(posX,posY);
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
            client.room.send("updatesign");
            client.room.state.onChange=(changes)=>{
                changes.forEach(change=>{
                    if(change.field=="status")
                        {
                           this.status=change.value;
                           this.letter.text=change.value; 
                        }
                });
            }   
        
        });
    }
}

const APP=new TicTacToe(); 



/*
            PLAYER.room.onMessage("newboxstatus",(message)=>
            {
                this.letter.text=message;
                this.addChild(this.letter);
                console.log("done");
            });
*/
            