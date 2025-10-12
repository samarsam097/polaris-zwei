import { NVIDIA_API_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	// 1. Get both 'keywords' and our new 'context' from the request
	const { keywords, context } = await request.json();

	if (!keywords || !context) {
		return json({ error: 'Keywords and context are required.' }, { status: 400 });
	}

	// 2. Use a variable for our prompt
	let prompt = '';

	// 3. Set the prompt based on the context
	switch (context) {
		case 'profileSummary':
			prompt = `As an experienced professional, craft a compelling resume profile summary of 30-60 words using the provided keywords that highlights key skills, expertise, and career achievements, ensuring it effectively captures your qualifications and value to potential employers."${keywords}".`;
			break;
		case 'workExperience':
			prompt = `You are an expert resume writer. Write 2-3 achievement-oriented bullet points for a work experience section based on these keywords: "${keywords}". Start each bullet point with the "•" character and a sapce. EACH BULLET POINT SHOULD BE ON NEW LINE. Do not include any introductory text.`;
			break;
			case 'projectSummary':
			prompt = `You are an expert resume writer. Write 2-3 bullet points(5-10 words each) describing a project for a resume's project section. The description should highlight the technologies used and the project's outcome, based on these keywords: "${keywords}". Start each bullet point with the "•" character and a space. Each bullet point must be on a new line.Do not include any introductory text.`;
			break;
		default:
			return json({ error: 'Invalid context provided.' }, { status: 400 });
	}

	try {
		const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${NVIDIA_API_KEY}`
			},
			body: JSON.stringify({
				model: 'meta/llama3-8b-instruct',
				messages: [{ role: 'user', content: prompt }] // The selected prompt is used here
			})
		});

		const data = await response.json();

		if (!response.ok) {
			console.error('NVIDIA API Error:', data.error?.message || data);
			throw new Error(data.error?.message || 'Failed to fetch from NVIDIA API');
		}

		const generatedText = data.choices[0].message.content.trim();

		// We'll return the text in a generic 'text' field to keep it reusable
		return json({ text: generatedText });

	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to communicate with the AI service.' }, { status: 500 });
	}
};