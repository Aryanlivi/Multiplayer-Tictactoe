import { Room, Client } from "colyseus";
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
      //console.log(client.id);
      //console.log(message);
      this.broadcast("replied",client.id+": "+message);
    });
    oldmessage=this.state.message;
    oldclient_id=this.state.id;
    //console.log("this is old:"+oldmessage);
    if(oldmessage!=undefined)
    {
      client.send("return",oldclient_id+": "+oldmessage);
    }
    this.state.clientCount++;
    console.log(this.state.clientCount);
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
