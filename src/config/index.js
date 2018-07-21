export const config = {

	// settings
	apiUrl: 'https://opentdb.com/api.php',
	gameTypes: {
		'boolean': {
			title: 'True or False',
			possibleAnswers: ['True', 'False']
		},
		'multiple': {
			title: 'Multiple Choice',
			shuffle: true
		}
	},
	gameDifficulty: ['easy', 'medium', 'hard'],
	
	// defaults
	defaultGameType: 'boolean',
	defaultDifficulty: 'hard',
	defaultQuestionCount: 10,

	// voice
	voiceSettings: {
		lang: 'en-US',
		voice: 2,
		pitch: 1,
		rate: 0.8
	}

}