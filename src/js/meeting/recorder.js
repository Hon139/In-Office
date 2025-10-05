let dualRecorder = null
let webpageStream = null
let microphoneStream = null
let audioContext = null
let webAudioSource = null
let micAudioSource = null

export async function default_callback (audio) {
    //window.open(URL.createObjectURL(audio), "_blank")

    const fd = new FormData()
    fd.append("audio", audio)

    try {
        const response = await fetch(window.CONFIG.TR_URL, {
            method: 'POST',
            body: fd,
            headers: {
                'Accept': 'text/html',
            }, 
            credentials: 'include'
        })
        
        if (response.ok){
            console.log(response)
            const tr = await response.text()
            const newWindow = window.open('', '_blank')

            if (newWindow) {
                newWindow.document.write(tr)
                newWindow.document.close()
            } 
        } else {
            console.log("error in backend")
        }
    } catch (error) {
        console.error("Error in default_callback:", error)
    }
}

// callback is an asynchronous one-variable function that takes a Blob audio object
export async function startAudioAndMicRecording (callback) {

    const webAudioOptions = {
        video: {
            displaySurface: "window",
        },
        audio: true,
        preferCurrentTab: true
    }
    
    const micAudioOptions = {
        audio: true
    }
    
    const webAudioPromise = navigator.mediaDevices.getDisplayMedia(webAudioOptions);
    const micAudioPromise = navigator.mediaDevices.getUserMedia(micAudioOptions);

    try {
        // Await for user permissions to get the audio streams
        const a = await Promise.all([webAudioPromise, micAudioPromise])

        webpageStream = a[0]
        microphoneStream = a[1]
    
        const dualAudioChunks = [] // Buffer for storing audio
        webpageStream = a[0]
        microphoneStream = a[1]
    
            // Combining the two streams via this...
        audioContext = new AudioContext()
        webAudioSource = audioContext.createMediaStreamSource(a[0])
        micAudioSource = audioContext.createMediaStreamSource(a[1])
        const destination = audioContext.createMediaStreamDestination()
    
        webAudioSource.connect(destination)
        micAudioSource.connect(destination)

        const dualAudioStream = new MediaStream()
    
        dualAudioStream.addTrack(destination.stream.getAudioTracks()[0])
    
        dualRecorder = new MediaRecorder(dualAudioStream)
    
        dualRecorder.ondataavailable = async (event) => {
            dualAudioChunks.push(event.data)
        }
    
        dualRecorder.onstop = async () => {
            console.log("stopping...");
            const audioBlob = new Blob(dualAudioChunks, {type : "audio/webm"})
            await callback(audioBlob)
        }
    
        dualRecorder.start()

        console.log("success!!!!!");
        return true

    } catch (error) {
        console.log(error)
        if (webpageStream !== null) {
            for (const s of webpageStream.getTracks()) {
                // Check if track is still active before stopping
                if (s.readyState !== 'ended') {
                    s.stop()
                }
            }
        }

        if (microphoneStream !== null) {
            for (const s of microphoneStream.getTracks()) {
                // Check if track is still active before stopping
                if (s.readyState !== 'ended') {
                    s.stop()
                }
            }
        }

        webpageStream = null
        microphoneStream = null

        return false
    }
    
}

export function stopAudioAndMicRecording() {
    // Stop the recorder first
    if (dualRecorder != null && dualRecorder.state !== 'inactive'){
        try {
            dualRecorder.stop()
        } catch (e) {
            console.warn('Failed to stop recorder:', e)
        }
    }
    dualRecorder = null

    // Disconnect audio nodes before stopping streams
    try {
        if (webAudioSource) {
            webAudioSource.disconnect()
            webAudioSource = null
        }
        if (micAudioSource) {
            micAudioSource.disconnect()
            micAudioSource = null
        }
    } catch (e) {
        console.warn('Failed to disconnect audio sources:', e)
    }

    // Close the audio context
    if (audioContext != null && audioContext.state !== 'closed') {
        try {
            audioContext.close()
        } catch (e) {
            console.warn('Failed to close audio context:', e)
        }
    }
    audioContext = null

    // Stop media stream tracks
    if (webpageStream != null) {
        for (const str of webpageStream.getTracks()) {
            // Check if track is still active before stopping
            if (str.readyState !== 'ended') {
                try {
                    str.stop()
                } catch (e) {
                    console.warn('Failed to stop webpage track:', e)
                }
            }
        }
    }
    webpageStream = null

    if (microphoneStream != null) {
        for (const str of microphoneStream.getTracks()) {
            // Check if track is still active before stopping
            if (str.readyState !== 'ended') {
                try {
                    str.stop()
                } catch (e) {
                    console.warn('Failed to stop microphone track:', e)
                }
            }
        }
    }
    microphoneStream = null
}