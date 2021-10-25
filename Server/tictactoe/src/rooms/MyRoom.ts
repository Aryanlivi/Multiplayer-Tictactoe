import { Room, Client } from "colyseus";
//import { Dispatcher } from "@colyseus/command";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    this.setState(new MyRoomState());
  }

  onJoin (client: Client,options:any) {

    console.log(client.sessionId, "joined!");
    /*
    let oldmessage:string;
    let oldclient_id:string;
    this.onMessage("say", (client, message) => 
    {
      this.state.message=message;
      this.state.id=client.id;
      this.broadcast("replied",client.id+": "+message);
    });
    oldmessage=this.state.message;
    oldclient_id=this.state.id;
    if(oldmessage!=undefined)
    {
      client.send("return",oldclient_id+": "+oldmessage);
    }
    */
    this.onMessage("updatesign",(client,index)=>
    {
      this.state.Boxes[index].status="X";
      //this.state.status="O"
      //console.log(this.state.Boxes);
      const ibox={
        status:this.state.Boxes[index].status,
        index:index
      }
      this.broadcast("update",ibox);
    });
    this.state.nplayers++;
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.nplayers--;
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
