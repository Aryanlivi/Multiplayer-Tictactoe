import { Room, Client } from "colyseus";
import e from "express";
//import { Dispatcher } from "@colyseus/command";
import { GameState } from "./schema/GameState";

let roomstate:GameState=null;
export class MyRoom extends Room<GameState> {

  onCreate (options: any) {
    this.setState(new GameState());
  }

  onJoin (client: Client,options:any) {
    console.log(client.sessionId, "joined!");
    roomstate=this.state
    roomstate.nplayers++;
    const Player={
      empty:" ",
      X:"X",
      O:"O"
    }
    if(roomstate.nplayers==1)
    {
      roomstate.player.type=Player.X;
      roomstate.player.index=roomstate.nplayers;
    }
    else if(roomstate.nplayers==2)
    {
      roomstate.player.type=Player.O;
      roomstate.player.index=roomstate.nplayers;
    }
    else{console.log("Error!")};
    //since we have to activate user interaction.
    this.broadcast("nplayers",roomstate.nplayers);

    //since only the respective player will get its info.
    client.send("playerinfo",roomstate.player);
    this.onMessage("updatesign",(client,box)=>
    {
      const TTTBox=this.state.Boxes[box.index]
      if(TTTBox.status==Player.empty)
      {
        TTTBox.status=box.status;
      }
      const ibox={
        status:TTTBox.status,
        index:box.index
      }
      this.broadcast("update",ibox);
    });
    
    this.onMessage("CheckWinner",(client,message)=>{
      if(roomstate.checkwinner())
      {
        this.broadcast("GameWon",roomstate.winner);
      }
    });
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    roomstate.nplayers--;
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