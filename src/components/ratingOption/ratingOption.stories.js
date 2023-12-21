import { RatingOption } from './RatingOption';

export default {
	component: RatingOption,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		score: { control: 'number' },
		label: { control: 'text' },
		smiley: {
			control: {
				type: 'select',
				options: [
					'very-angry',
					'angry',
					'neutral',
					'happy',
					'very-happy',
					false,
				],
			},
		},
		selected: { control: 'boolean' },
		onClick: { control: 'function' },
	},
};

export const Base = {
	args: {
		score: 0,
		label: 'Default',
		smiley: 'neutral',
		onClick: () => {},
	},
};

export const VeryAngry = {
	args: {
		...Base.args,
		score: 1,
		smiley: 'very-angry',
	},
};

export const Angry = {
	args: {
		...Base.args,
		score: 2,
		smiley: 'angry',
	},
};

export const Neutral = {
	args: {
		...Base.args,
		score: 3,
		smiley: 'neutral',
	},
};

export const Happy = {
	args: {
		...Base.args,
		score: 4,
		smiley: 'happy',
	},
};

export const VeryHappy = {
	args: {
		...Base.args,
		score: 5,
		smiley: 'very-happy',
	},
};
