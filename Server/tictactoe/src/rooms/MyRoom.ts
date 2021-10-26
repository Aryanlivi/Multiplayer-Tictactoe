import { Room, Client } from "colyseus";
//import { Dispatcher } from "@colyseus/command";
import { GameState } from "./schema/GameState";

export class MyRoom extends Room<GameState> {

  onCreate (options: any) {
    this.setState(new GameState());
  }

  onJoin (client: Client,options:any) {
    console.log(client.sessionId, "joined!");
    this.state.nplayers++;
    const Player={
      X:"X",
      O:"O"
    }
    if(this.state.nplayers==1)
    {
      this.state.player.type=Player.X;
      this.state.player.index=this.state.nplayers;
    }
    else if(this.state.nplayers==2)
    {
      this.state.player.type=Player.O;
      this.state.player.index=this.state.nplayers;
    }
    else{console.log("Error!")};
    //since we have to activate user interaction.
    this.broadcast("nplayers",this.state.nplayers);
    //since only the respective player will get its info.
    client.send("playerinfo",this.state.player);
    this.onMessage("updatesign",(client,box)=>
    {
      console.log(box);
      this.state.Boxes[box.index].status=box.status;
      //this.state.status="O"
      //console.log(this.state.Boxes);
      const ibox={
        status:this.state.Boxes[box.index].status,
        index:box.index
      }
      this.broadcast("update",ibox);
    });
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.nplayers--;
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}


/*
    let oldmessage:string;
    let oldclient_id:string;
    this.onMessage("say", (client, message) => 
    {
      console.log("said");
      this.state.playerchat.msg=message;
      this.state.playerchat.id=client.id;
      this.broadcast("replied",client.id+": "+message);
    });
    oldmessage=this.state.playerchat.msg;
    console.log(oldmessage);
    if(oldmessage!=undefined)
    {
      client.send("return",oldmessage);
    }
    oldmessage=this.state.message;
    oldclient_id=this.state.id;
    if(oldmessage!=undefined)
    {
      client.send("return",oldclient_id+": "+oldmessage);
    }
    */