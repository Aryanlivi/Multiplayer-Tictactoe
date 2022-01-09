import { REMOTE_ROOM_SHORT_TIMEOUT } from "@colyseus/core/build/Utils";
import { Schema,ArraySchema,Context, type } from "@colyseus/schema";
const empty=" ";
class Player extends Schema
{
  @type("string") type:string;
  @type("number") index:number;
  constructor()
  {
    super()
    this.type=empty;
    this.index=0;
  }
}
class TTTBox extends Schema
{
  @type('string') status:string=empty;
}
class Chat extends Schema
{
  @type('string') msg:string;
  @type('string') id:string;
}
export class GameState extends Schema 
{
  @type("number") nplayers:number=0;
  @type(Player) player:Player;
  @type([Player]) players:Player[];
  @type(Player) winner:Player;
  //@type(Chat) playerchat: Chat;
  @type([TTTBox]) Boxes:TTTBox[];
  winc:number[][];
  boxstatus:[];
  constructor()
  {
    super();
    //this.playerchat=new Chat();
    this.player=new Player();
    this.winner=new Player();
    this.players=new ArraySchema();
    this.Boxes=new ArraySchema();
    for(let i=0;i<9;i++)
    {
      this.Boxes.push(new TTTBox());
    }
    this.winc=[[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,4,6],[2,5,8],[3,4,5],[6,7,8]];
  }
  checkwinner()
  {
    let i:number;
    let j:number;
    let k:number;
    for(let loop:number=0;loop<this.winc.length;loop++)
    {
      i=this.winc[loop][0];
      j=this.winc[loop][1];
      k=this.winc[loop][2];
      if(this.Boxes[i].status!=empty || this.Boxes[j].status!=empty || this.Boxes[k].status!=empty)
      {
        if(this.Boxes[i].status==this.Boxes[j].status && this.Boxes[j].status==this.Boxes[k].status)
        {
          this.players.forEach((player)=>{
            if(player.type==this.Boxes[i].status)
            {
              this.winner=player;
            }
          })
          return true;
        }
      } 
    }
  }
}
