let dualRecorder = null


// callback is an asynchronous one-variable function that takes a Blob audio object
export async function startAudioAndMicRecording (callback) {
    console.log("starting dual recording...")
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

    // Await for user permissions to get the audio streams
    Promise.all([webAudioPromise, micAudioPromise]).then((a) => {

        const dualAudioChunks = [] // Buffer for storing audio

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

        console.log(dualAudioStream.getAudioTracks());

        dualRecorder.onstop = async () => {
            console.log("stopping...");
            const audioBlob = new Blob(dualAudioChunks, {type : "audio/webm"})
            window.open(URL.createObjectURL(audioBlob), "_blank")
            await callback(audioBlob)
        }

        dualRecorder.start()
    })
}

export async function stopAudioAndMicRecording() {
    console.log("stopping dual recording...")
    dualRecorder.stop()
}