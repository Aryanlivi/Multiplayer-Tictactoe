import { REMOTE_ROOM_SHORT_TIMEOUT } from "@colyseus/core/build/Utils";
import { Schema,ArraySchema,Context, type } from "@colyseus/schema";
export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";
  @type("number") clientCount : number =0;
  @type('string') message:string;
  @type('string') id:string;
  //@type('string') status:string=" ";
  @type(['number']) Boxes:ArraySchema<number>;
  constructor()
  {
    super();
    this.Boxes=new ArraySchema();
  }
  
}
