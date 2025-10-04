

let active = false;

export const JitsiState = {
  currentRoom: "",
  activateMeeting: async () => {
    if (!active)  {
        console.log("activating meeting...")
        active = true;
        const api = new JitsiMeetExternalAPI("meet.jit.si/teaaaaaam", {
          roomName: "myuniquemeetingroomname",
          width: 540,
          height: 540,
          parentNode: document.querySelector("#jitsi-meeting")
        })



        console.log("heyy")

        api.on("readyToClose", (a) => {
            api.dispose();
        })


        /*setTimeout(() => {
            api.executeCommand('hangup')
            api.dispose()
            setTimeout(() => {
                active = false;
            }, 2000)
        }, 2000);*/

    }
    return;
  }

}
