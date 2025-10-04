

let active = false;
let currentMeeting = null;

const state = {
  currentRoom: "creativeandcoolmeetingroom",
  activateMeeting: async function () {
    if (!active)  {
        console.log("activating meeting...")
        active = true;
        console.log(this);
        currentMeeting = await new JitsiMeetExternalAPI("meet.jit.si", {
          roomName: this.currentRoom,
          width: 540,
          height: 540,
          parentNode: document.querySelector("#jitsi-meeting")
        })
    }
  },
  deactivateMeeting: async function () {
    if (active) {
        console.log("deactivating meeting...")

        currentMeeting.executeCommand('hangup');
        currentMeeting.dispose();




        setTimeout(() => {
            active = false;
        }, 100000)
    }
  }

}

export const JitsiState = state
