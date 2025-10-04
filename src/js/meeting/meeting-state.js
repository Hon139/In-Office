


export class MeetingState {
    constructor () {
        this.roomName = "";
        this.displayName = "Default User";
        this.activeMeeting=false;
        this.email = "";
    }

    // attach_to_id should be set to ... when
    function connect(attach_to_id) {
        const api = new JitsiMeetExternalAPI("meet.jit.si/HTVX", {
            roomName : this.roomName,
            parentNode: attach_to_id,
            userInfo : {
                displayName: this.displayName;
                email: this.email;
            }
        });

    }

    function disconnect() {
        this.activeMeeting=false;
    }
}


