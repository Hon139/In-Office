let dualRecorder = null
let webpageStream = null
let microphoneStream = null

export async function default_callback (audio) {
    //window.open(URL.createObjectURL(audio), "_blank")

    const fd = new FormData()
    fd.append("audio", audio)

    const request = fetch(window.CONFIG.TR_URL, { // TODO change the location of this.
        method: 'POST',
        body: fd,
        headers: {
            'Accept': 'text/html',
        }, credentials: 'include'
    })
    request.then(async (val) => {
        if (val.ok){
            console.log(val)
            const tr = await val.text()
            console.log()
            const newWindow = window.open('', '_blank')

            if (newWindow) {
                newWindow.document.write(tr)
                newWindow.document.close()
            } 
        } else {
            console.log("error in backend")
        }
    })
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
        const audioContext = new AudioContext()
        const webAudioSource = audioContext.createMediaStreamSource(a[0])
        const micAudioSource = audioContext.createMediaStreamSource(a[1])
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
                s.stop()
            }
        }

        if (microphoneStream !== null) {
            for (const s of microphoneStream.getTracks()) {
                s.stop()
            }
        }

        webpageStream = null

        return false
    }
    
}

export function stopAudioAndMicRecording() {
<<<<<<< HEAD
    if (webpageStream != null) {
        for (const str of webpageStream.getTracks()) {
            str.stop()
        }
    }
=======
    dualRecorder.stop()
    recording = false

    if (webpageStream !== null) {
        for (const s of webpageStream.getTracks()) {
            s.stop()
        }
        webpageStream = null
    }

    if (microphoneStream !== null) {
        for (const s of microphoneStream.getTracks()) {
            s.stop()
        }
        microphoneStream = null
    }
}
>>>>>>> eac7bf78a06194ef538ab8bb5454b64171a8c753

    if (microphoneStream != null) {
        for (const str of microphoneStream.getTracks()) {
            str.stop()
        }
    }

    if (dualRecorder == null){
    
        dualRecorder.stop()
    }
}