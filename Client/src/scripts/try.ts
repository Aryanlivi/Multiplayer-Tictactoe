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
        await this.createboard();
        this.interact();
    }
    async createboard()
    {
        await client.connect();
        roomState=client.room.state;
        //console.log(roomState.nplayers);
        this.tttboard=new TTTBoard();
        this.stage.addChild(this.tttboard);
    }
    interact()
    {
        this.tttboard.Boxes.forEach((box)=>{
            box.on("pointerdown",()=>{
                client.room.send("updatesign",box.index);
            });
        })
        client.room.onMessage("update",(message)=>{
            this.update(message);
        })
    }
    update(ibox)
    {
        const box=this.tttboard.Boxes[ibox.index];
        box.status=ibox.status;
        box.letter.text=box.status;
        box.addChild(box.letter);
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
        let index=0;
        for(let row=0;row<nrows;row++)
        {
            for(let col=0;col<ncols;col++)
            {
                this.box=new TTTBox(index,row,col);
                this.Boxes.push(this.box);
                this.addChild(this.box);
                index++;
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
    index:number;
    POSX:number=0;
    POSY:number=0;
    WIDTH:number=0;
    HEIGHT:number=0;
    textStyle:PIXI.TextStyle;
    letter:PIXI.Text;
    //conditions:Array<string>=[" ","X","O"];
    status:string;
    color=0xffffff;
    constructor(index:number,posX:number,posY:number)
    {
        super();
        this.drawboxes(index,posX,posY);
        this.initsign();
    }
    drawboxes(index:number,posX:number,posY:number)
    {
        this.index=index; 
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
    initsign()
    {
        this.textStyle=new PIXI.TextStyle(
            {
                fontFamily:"Comic Sans MS",
                fontSize:50
            }
        );
        this.status="";
        this.letter=new PIXI.Text(this.status,this.textStyle);
        this.letter.x=this.POSX+0.3*this.WIDTH;
        this.letter.y=this.POSY+0.2*this.HEIGHT;
        this.addChild(this.letter);
    }
}

const APP=new TicTacToe(); 
