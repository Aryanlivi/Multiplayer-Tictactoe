import { REMOTE_ROOM_SHORT_TIMEOUT } from "@colyseus/core/build/Utils";
import { Schema,ArraySchema,Context, type } from "@colyseus/schema";
class Box extends Schema
{
  @type('string') status:string=" ";
}
export class MyRoomState extends Schema 
{
  @type("number") nplayers:number=0;
  //@type('string') message:string;
  //@type('string') id:string;
  //@type('string') status:string=" ";
  @type([Box]) Boxes:Box[];
  constructor()
  {
    super();
    this.Boxes=new ArraySchema();
    for(let i=0;i<9;i++)
    {
      this.Boxes.push(new Box());
    }
  }
}
