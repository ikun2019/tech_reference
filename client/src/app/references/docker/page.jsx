import React from 'react';
import {
	fetchServerDockerCommands,
	fetchDockerComposeCommands,
	fetchDockerSwarmCommands,
} from '@/lib/api/commandsAPI';
import { fetchServerDockerStarterKits } from '@/lib/api/starterkitsAPI';
import DockerReferencClient from '@/app/components/DockerReferencClient';

export default async function DockerPage() {
	const dockerCommandsResponse = await fetchServerDockerCommands();
	const dockerStarterKitsResponse = await fetchServerDockerStarterKits();
	const dockerComposeCommandsResponse = await fetchDockerComposeCommands();
	const dockerSwarmCommandsResponse = await fetchDockerSwarmCommands();

	return (
		<DockerReferencClient
			dockerCommands={dockerCommandsResponse}
			dockerComposeCommands={dockerComposeCommandsResponse}
			dockerStarterKits={dockerStarterKitsResponse}
			dockerSwarmCommands={dockerSwarmCommandsResponse}
		/>
	);
}
