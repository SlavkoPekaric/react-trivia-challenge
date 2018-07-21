export default class Speaker {

	constructor(settings) {
		this.settings = settings
		this.synth = window.speechSynthesis
		this.voicePitch = settings.pitch || 1
		this.voiceRate = settings.rate || 1
		this.voiceActive = settings.voice || 0
		this.utterThis = null
		this.voices = []
		this.isReady = false
		this.quene = []

		this.populateVoiceList = this.populateVoiceList.bind(this)

		// voice population
		if (this.synth.onvoiceschanged !== undefined) {
			this.synth.onvoiceschanged = this.populateVoiceList
		} else {
			this.populateVoiceList()
		}
	}

	
	// get available voices and check quene
	populateVoiceList() {
		this.voices = this.synth.getVoices()

		if (this.settings.lang) {
			const _this = this
			this.voices = Object.keys(this.voices).filter(key => {
				return _this.voices[key].lang === _this.settings.lang
			}).map(key => {
				return _this.voices[key]
			})
		}

		this.isReady = true

		console.log('Speech is ready!')

		// check quene and speak first piece of data
		if (this.quene.length) {
			this.speak(this.quene[0])
		}
	}

	// set events for current voice
	ttsEvents(onComplete) {
		this.utterThis.onend = e => {
	    this.removeFromQuene(e.currentTarget.text)
	    if(typeof onComplete === 'function') onComplete(e);
		}

		this.utterThis.onerror = e => {
	    console.log('An error has occurred with the speech synthesis: ' + e.error);
		}
	}

	// add operation to quene if plugin not ready
	addToQuene(text) {
		this.quene.push(text)
	} 

	// remove item from quene by text value
	removeFromQuene(text) {
		if (!this.quene.length) return;
		
		this.quene = Object.keys(this.quene).filter(key => {
			return this.quene[key] !== text
		}).map(key => {
			return this.quene[key]
		})
	}

	// check if speech is in progress
	isSpeaking() {
		return this.synth.speaking
	}

	// set voice volume
	setVolume(volume) {
		this.utterThis.volume(volume)
	}

	// set active voice
	setVoice(index) {
		this.voiceActive = index
	}
	
	speak(text, onComplete = null) {
		const _this = this

		try {
			// check is speaking already
			if (this.isSpeaking()) this.synth.cancel()

			if (this.isReady) {
				// generate new speech object
				this.utterThis = new SpeechSynthesisUtterance(text)
		    this.utterThis.voice = this.voices[this.voiceActive]
		    this.utterThis.pitch = this.voicePitch
				this.utterThis.rate = this.voiceRate

				this.ttsEvents(onComplete)

				this.synth.speak(this.utterThis)
			} else {
				this.addToQuene(text)
					
			}
		} catch(e) {
			console.log(e)
			_this.addToQuene(text)
		}
	}
	
}

