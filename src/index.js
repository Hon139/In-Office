import * as me from "melonjs";
import PlayScreen from "./js/stage/play.js";
import { resources } from "./resources.js";


const JitsiState = {
  active: false,
  currentRoom: "",
  activateMeeting: () => {
    console.log("activating meeting...")
    const api = new JitsiMeetExternalAPI("meet.jit.si/teaaaaaam", {
      roomName: "Hackthevalleytestroom",
      width: 300,
      height: 300,
      parentNode: document.querySelector("#jitsi-meeting")
    })
  }

}



me.device.onReady(() => {
  me.video.init(960, 540, { parent: "screen", scale: "auto", renderer: me.video.AUTO });
  me.loader.preload(resources, () => {
    me.state.set(me.state.PLAY, new PlayScreen());
    me.state.change(me.state.PLAY);
  });
});
