import { REMOTE_ROOM_SHORT_TIMEOUT } from "@colyseus/core/build/Utils";
import { Schema,ArraySchema,Context, type } from "@colyseus/schema";
class Player extends Schema
{
  @type("string") type:string;
  @type("number") index:number;
  constructor()
  {
    super()
    this.type=" ";
    this.index=0;
  }
}
class Box extends Schema
{
  @type('string') status:string=" ";
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
  //@type(Chat) playerchat: Chat;
  @type([Box]) Boxes:Box[];
  constructor()
  {
    super();
    //this.playerchat=new Chat();
    this.player=new Player();
    this.Boxes=new ArraySchema();
    for(let i=0;i<9;i++)
    {
      this.Boxes.push(new Box());
    }
  }
}
