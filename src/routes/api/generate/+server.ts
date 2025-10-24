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
			prompt = `You are a professional resume maker tasked with creating a concise summary for a resume.Use the following keywords: [insert keywords here].Your summary should be between 50-80 words and must form coherent and professional sentences.Ensure that the summary reflects the competencies and experiences suggested by the keywords while maintaining a polished and engaging tone.Focus on clarity, conciseness, and relevance to a potential employer.do not include any greetings or sign-offs in the summary.Only provide the summary text without any additional commentary or formatting.

"${keywords}".`;
			break;
		case 'workExperience':
			prompt = `Create a concise work experience summary for a resume using the following keywords: [insert keywords here].Structure the summary in 3-5 bullet points, ensuring each bullet point begins on a new line.Formulate complete sentences that incorporate the keywords naturally and effectively.Utilize relevant technical terms associated with the keywords to enhance professionalism and clarity.Ensure the tone is formal and suitable for a professional resume."${keywords}". Start each bullet point with the "•" character and a sapce. EACH BULLET POINT SHOULD BE ON NEW LINE. Do not include any introductory text.`;
			break;
			case 'projectSummary':
			prompt = `You are an AI resume maker tasked with creating a concise project summary for a resume.Use the following keywords to generate 2-4 small bullet points.Each bullet point must start on a new line, incorporate relevant technical terms, and transform the keywords into proper sentences.Ensure that the bullet points are brief yet impactful, demonstrating efficiency and professionalism."${keywords}". Start each bullet point with the "•" character and a space. Each bullet point must be on a new line.Do not include any introductory text.`;
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