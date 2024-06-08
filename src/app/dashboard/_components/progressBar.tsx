import React from 'react';

interface ProgressBarProps {
	progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
	const progressStyle = {
		width: `${progress}%`,
		backgroundColor: progress >= 80 ? 'red' : '#2563eb',
	};

	return (
		<div className='w-full flex bg-border rounded-sm h-4 mb-4 '>
			<div
				className='h-4 rounded-sm'
				style={progressStyle}
			></div>
		</div>
	);
};
