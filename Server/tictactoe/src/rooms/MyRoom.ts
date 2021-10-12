import { Room, Client } from "colyseus";
//import { Dispatcher } from "@colyseus/command";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    this.setState(new MyRoomState());
    
  }

  onJoin (client: Client,options:any) {

    console.log(client.sessionId, "joined!");
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
    this.onMessage("updatesign",()=>
    {
      this.state.status="X";
      console.log("update");
      //this.broadcast("newboxstatus",this.state.status);
    });


    this.state.clientCount++;
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.clientCount--;
    console.log(this.state.clientCount);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
