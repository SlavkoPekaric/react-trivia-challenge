import Speaker from '../core/speaker'
import { config } from '../config'

const speaker = new Speaker(config.voiceSettings)

export const speak = (input, onComplete) => {
	try {
		speaker.speak(input, onComplete)
	} catch(e) {
		if (typeof onComplete === 'function') onComplete();
	}
}
