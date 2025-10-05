import * as me from 'melonjs';
import { Player } from '../entities/player';
import {default_callback, stopAudioAndMicRecording, startAudioAndMicRecording, isRecording} from './recorder.js'
let jitsiApi = null;
let player = null;
let recording = false;

let mountSeq = 0;

function showCallUI(show) {
  document.getElementById("jitsi-box").classList.toggle("hidden", !show);
  document.getElementById("jitsi-leave").classList.toggle("hidden", !show);
  document.getElementById("jitsi-record").classList.toggle("hidden", !show);
}

async function ensureVisibleAndSized() {
  const box = document.getElementById('jitsi-box');
  const host = document.getElementById('jitsi-meeting');

  // 1) Make visible
  showCallUI(true);
  box.style.display = 'block';

  // 2) Guarantee a non-zero size (in case CSS didn’t apply yet)
  if (!box.style.width) box.style.width = '360px';
  if (!box.style.height) box.style.height = '240px';

  // 3) Force a reflow, then let the browser paint a frame
  //    (reading offsetWidth triggers layout)
  void box.offsetWidth;
  await new Promise((r) => requestAnimationFrame(r));
}

function freshContainer() {
  const host = document.getElementById('jitsi-meeting');
  // remove any old iframe completely
  host.innerHTML = '';
  // create a brand new child each time (no DOM reuse)
  const el = document.createElement('div');
  el.id = `jitsi-container-${++mountSeq}`;
  el.style.position = 'absolute';
  el.style.inset = '0';
  host.appendChild(el);
  return el;
}

export async function openMeeting(roomName, p) {
  player = p;
  let displayName = player?.displayName || player?.name || window.playerName || 'Guest';
  const parentNode = document.getElementById('jitsi-meeting');

  await ensureVisibleAndSized();

  const container = freshContainer();

  await new Promise((r) => requestAnimationFrame(r));

  if (!window.JitsiMeetExternalAPI) {
    console.error('Jitsi API not loaded');
    showCallUI(false);
    return;
  }
  const rect = container.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    console.warn('Jitsi container has zero size; aborting open');
    showCallUI(false);
    return;
  }

  // show box and clean any previous iframe
  try {
    jitsiApi?.dispose();
  } catch {}
  parentNode.innerHTML = '';

  // create the iframe
  jitsiApi = new JitsiMeetExternalAPI('meet.jit.si', {
    roomName,
    parentNode,
    width: me.game.viewport.width,
    height: me.game.viewport.height,
    userInfo: { displayName },
    configOverwrite: {
      prejoinConfig: { enabled: false },
      startWithAudioMuted: true,
      startWithVideoMuted: true,
      disableThirdPartyRequests: true, // reduces analytics noise
    },
    interfaceConfigOverwrite: { MOBILE_APP_PROMO: false },
  });

  document.getElementById('jitsi-leave')?.focus();
}

export function closeMeeting() {
  // try to hang up nicely, then dispose and hide
  try {
    jitsiApi?.executeCommand?.('hangup');
  } catch {}
  try {
    jitsiApi?.dispose?.();
  } catch {}
  jitsiApi = null;
  document.getElementById('jitsi-box').style.display = 'none';
  document.getElementById('jitsi-meeting').innerHTML = '';
  showCallUI(false);
  stopAudioAndMicRecording()
  recording = false
  
  queueMicrotask(() => {
    try {
      player?.leaveMeeting?.();
    } catch (e) {
      console.warn('player.leaveMeeting failed:', e);
    }
  });
}

export async function recordMeeting() {
  if (recording) { // Stop recording!!!!
    console.log("stopping recording")
    stopAudioAndMicRecording()
      document.getElementById('jitsi-record').innerHTML = "Start Recording!"
    recording = true
  } else {
    console.log("starting recording")
    if (await startAudioAndMicRecording(default_callback)) {
      recording = true
      document.getElementById('jitsi-record').innerHTML = "Stop Recording!"
    } else {
      recording = false // To jam it up
      document.getElementById('jitsi-record').innerHTML = "Try again?"
    }
  }
}

// Wire the button
document.getElementById('jitsi-leave').addEventListener('click', closeMeeting);
document.getElementById('jitsi-record').addEventListener('click', recordMeeting)

// Optional: allow ESC to close
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMeeting();
});

// Example: call this when you want to start a call
// openMeeting("break-room-1", window.playerName || "Guest");
