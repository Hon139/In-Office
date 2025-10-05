let active = false;
let currentMeeting = null;

import {startAudioAndMicRecording, stopAudioAndMicRecording} from './recorder.js'

const state = {
  profile: {
    email: '',
    displayName: 'Guest',
  },
  currentRoom: 'creativeandcoolmeetingroom',
  activateMeeting: async function (meetingName) {
    if (!active) {
      console.log('activating meeting...');
      active = true;
      currentMeeting = await new JitsiMeetExternalAPI('meet.jit.si', {
        roomName: meetingName,
        width: 540,
        height: 540,
        parentNode: document.querySelector('#jitsi-meeting'),
        userInfo: this.profile,
      });
      return true;
    }
    return active;
  },
  deactivateMeeting: async function () {
    if (active) {
      console.log('deactivating meeting...');
      currentMeeting.executeCommand('hangup');
      currentMeeting.dispose();
      active = false;
    }
  },
  startRecording: async function (callback) {
    startAudioAndMicRecording(callback)
  },
  stopRecording: async function () {
    stopAudioAndMicRecording()
  }
  hasAMeeting: function () {
    return active;
  },
};

export const JitsiState = state;
